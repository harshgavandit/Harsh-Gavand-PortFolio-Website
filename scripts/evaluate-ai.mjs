import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { aiEvalCases, gradeCase } from "./ai-eval-cases.mjs";
import { runtimeDigest } from "./ai-runtime-digest.mjs";
import { loadConfig } from "../server/config.mjs";
import { createServer } from "../server/app.mjs";
import { retrieveCode, sourceSnapshot } from "../server/grounding.mjs";

if (!process.argv.includes("--live"))
  throw new Error(
    "Use --live for an explicitly paid evaluation with synthetic public inputs.",
  );
const remote = process.argv.find((arg) => arg.startsWith("--url="))?.slice(6);
if (remote && remote !== "https://harshgavand.dev")
  throw new Error(
    "Remote smoke checks are restricted to the canonical portfolio.",
  );
let server;
let origin = remote;
if (!origin) {
  // Controlled local evaluation permits this fixed dataset; production admission is unchanged.
  server = createServer({ ...loadConfig(), clientLimit: 20, globalLimit: 20 });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
}
const cases = remote
  ? [aiEvalCases[0], aiEvalCases[6], aiEvalCases[8]]
  : aiEvalCases;
const results = [];
try {
  for (const item of cases) {
    const path = item.kind === "guide" ? "/api/chat" : `/api/ai/${item.kind}`;
    const body =
      item.kind === "guide"
        ? { messages: [{ role: "user", content: item.text }] }
        : { text: item.text };
    const started = performance.now();
    let response, data, grading;
    try {
      response = await fetch(origin + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(35000),
      });
      data = await response.json();
      grading = response.ok
        ? gradeCase(item, data)
        : {
            passed: false,
            checks: [
              {
                name: `HTTP ${response.status} (${data.code || "unavailable"})`,
                passed: false,
              },
            ],
          };
    } catch {
      grading = {
        passed: false,
        checks: [
          { name: "request completed within time budget", passed: false },
        ],
      };
    }
    const result = {
      id: item.id,
      kind: item.kind,
      passed: grading.passed,
      checks: grading.checks
        .filter((check) => check.passed)
        .map((check) => check.name),
      failedChecks: grading.checks
        .filter((check) => !check.passed)
        .map((check) => check.name),
      elapsedMs: Math.round(performance.now() - started),
      allowanceCostUsd: data?.execution?.allowanceCostUsd || 0,
      output: data,
    };
    results.push(result);
    console.log(
      `${result.passed ? "PASS" : "FAIL"} ${result.id}${result.failedChecks.length ? ": " + result.failedChecks.join(", ") : ""}`,
    );
  }
} finally {
  if (server) {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
const retrievalCases = aiEvalCases.filter((item) => item.source);
const retrievalPassed = retrievalCases.filter((item) =>
  retrieveCode(item.text).some((source) => source.slug === item.source),
).length;
const latencies = results
  .map((result) => result.elapsedMs)
  .sort((a, b) => a - b);
const report = {
  status: "completed",
  model: "gpt-6-luna",
  evaluatedAt: new Date().toISOString(),
  sourceSnapshot: sourceSnapshot.digest,
  runtimeDigest: await runtimeDigest(),
  environment: remote ? "production-http-smoke" : "local-http-real-provider",
  cases: results.map(({ output: _output, ...result }) => result),
  retrieval: { passed: retrievalPassed, total: retrievalCases.length },
  summary: {
    passed: results.filter((result) => result.passed).length,
    total: results.length,
    medianLatencyMs: latencies[Math.floor(latencies.length / 2)],
    allowanceCostUsd:
      Math.round(
        results.reduce((sum, result) => sum + result.allowanceCostUsd, 0) *
          1000000,
      ) / 1000000,
  },
};
await mkdir(new URL("../tmp/ai-evaluation/", import.meta.url), {
  recursive: true,
});
await writeFile(
  new URL(
    `../tmp/ai-evaluation/${remote ? "production" : "local"}-outputs.json`,
    import.meta.url,
  ),
  JSON.stringify(results, null, 2) + "\n",
);
if (!remote) {
  await writeFile(
    new URL("../src/data/aiQuality.json", import.meta.url),
    JSON.stringify(report, null, 2) + "\n",
  );
  await mkdir(
    new URL("../verification/ai-workspace-2026-10-17/", import.meta.url),
    { recursive: true },
  );
  await writeFile(
    new URL(
      "../verification/ai-workspace-2026-10-17/evaluation.json",
      import.meta.url,
    ),
    JSON.stringify(report, null, 2) + "\n",
  );
}
console.log(
  JSON.stringify(
    {
      environment: report.environment,
      ...report.summary,
      retrieval: report.retrieval,
      runtimeDigest: report.runtimeDigest.slice(0, 12),
    },
    null,
    2,
  ),
);
assert.equal(
  report.summary.passed,
  report.summary.total,
  "Inspect failed evaluation cases; do not publish a fabricated success rate.",
);
