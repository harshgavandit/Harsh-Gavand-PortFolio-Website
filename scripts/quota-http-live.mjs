// Manual live Redis + HTTP process-restart verification; no OpenAI calls.
import assert from "node:assert/strict";
import { fork } from "node:child_process";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";
import { createServer } from "../server/app.mjs";
import { loadConfig } from "../server/config.mjs";
import { RedisQuota } from "../server/quota.mjs";

if (process.argv[2] === "--fixture") {
  const c = loadConfig();
  let calls = 0;
  const quota = new RedisQuota({
    url: c.quotaUrl,
    token: c.quotaToken,
    namespace: process.argv[3],
    dailyLimit: 1,
    monthlyBudgetMicros: 1000000,
  });
  const server = createServer({
    ...c,
    quota,
    generate: async () => {
      calls++;
      return {
        answer: "Fixture answer; no model invoked.",
        projectIds: [],
        sections: [],
      };
    },
  });
  server.listen(0, "127.0.0.1", () =>
    process.send({ port: server.address().port }),
  );
  process.on("message", () => {
    server.closeAllConnections();
    server.close(() => {
      process.send({ calls });
      process.disconnect();
    });
  });
} else {
  const namespace = `quota-http-verification:${randomUUID()}`;
  async function start() {
    const child = fork(
      fileURLToPath(import.meta.url),
      ["--fixture", namespace],
      { stdio: ["ignore", "ignore", "inherit", "ipc"] },
    );
    const port = await new Promise((resolve, reject) => {
      child.once("message", (m) => resolve(m.port));
      child.once("error", reject);
      child.once("exit", () =>
        reject(new Error("Fixture exited before ready")),
      );
    });
    return { child, origin: `http://127.0.0.1:${port}` };
  }
  async function stop(fixture) {
    const calls = new Promise((resolve) =>
      fixture.child.once("message", (m) => resolve(m.calls)),
    );
    const exited = new Promise((resolve) =>
      fixture.child.once("exit", resolve),
    );
    fixture.child.send("close");
    const result = await calls;
    await exited;
    return result;
  }
  async function question(fixture) {
    const response = await fetch(fixture.origin + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "Tell me about Harsh" }],
      }),
      signal: AbortSignal.timeout(10000),
    });
    return { status: response.status, body: await response.json() };
  }
  const first = await start();
  const admitted = await question(first);
  const firstCalls = await stop(first);
  assert.equal(admitted.status, 200);
  assert.equal(firstCalls, 1);
  const restarted = await start();
  const rejected = await question(restarted);
  const secondCalls = await stop(restarted);
  assert.equal(rejected.status, 429);
  assert.equal(rejected.body.code, "daily_limit");
  assert.equal(secondCalls, 0);
  const evidence = {
    verifiedAt: new Date().toISOString(),
    initialStatus: admitted.status,
    restartedStatus: rejected.status,
    code: rejected.body.code,
    separateNodeProcesses: true,
    generationCallsAfterRestart: secondCalls,
    openAiCalls: 0,
  };
  console.log(JSON.stringify(evidence, null, 2));
  if (process.argv[2])
    await writeFile(process.argv[2], JSON.stringify(evidence, null, 2));
}
