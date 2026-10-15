import assert from "node:assert/strict";
import { test } from "node:test";
import { RedisAdmission, ADMIT_SCRIPT } from "../server/admission.mjs";

test("shared admission uses one atomic command, hashed client keys and an expiring concurrency lease", async () => {
  const commands = [];
  const store = {
    configured: true,
    namespace: "synthetic-test",
    command: async (command) => {
      commands.push(command);
      return command[0] === "EVAL" ? [1, 0] : 1;
    },
  };
  const admission = new RedisAdmission({ store, clock: () => 100000 });
  const lease = await admission.acquire("203.0.113.42");
  assert.equal(commands.length, 1);
  assert.equal(commands[0][0], "EVAL");
  assert.equal(commands[0][1], ADMIT_SCRIPT);
  assert.equal(commands[0][2], 3);
  assert.ok(!JSON.stringify(commands).includes("203.0.113.42"));
  assert.match(commands[0][3], /:client:[a-f0-9]{64}:0$/);
  assert.equal(commands[0][5], lease.key);
  assert.ok(commands[0].at(-2) > 60000);
  assert.match(lease.id, /^[a-f0-9-]{36}$/);
  await admission.release(lease);
  assert.deepEqual(commands[1], ["ZREM", lease.key, lease.id]);
});

test("admission rejection preserves Retry-After and never acquires a lease", async () => {
  const admission = new RedisAdmission({
    store: {
      configured: true,
      namespace: "test",
      command: async () => [0, 15],
    },
  });
  await assert.rejects(
    admission.acquire("client"),
    (error) =>
      error.status === 429 &&
      error.code === "rate_limit" &&
      error.retryAfter === 15,
  );
});

test("missing storage and corrupt admission replies fail closed", async () => {
  const missing = new RedisAdmission({ store: { configured: false } });
  await assert.rejects(missing.acquire("client"), {
    status: 503,
    code: "quota_unavailable",
  });
  for (const reply of [
    null,
    [],
    [1],
    [1, 5],
    [0, 0],
    [-1, 0],
    [2, 0],
    [0, -1],
    [0, "10"],
  ]) {
    const admission = new RedisAdmission({
      store: {
        configured: true,
        namespace: "test",
        command: async () => reply,
      },
    });
    await assert.rejects(admission.acquire("client"), {
      status: 503,
      code: "quota_unavailable",
    });
  }
});

test("storage failure is sanitized and invalid admission limits are rejected", async () => {
  const store = {
    configured: true,
    namespace: "test",
    command: async () => {
      throw new Error("Synthetic private store failure");
    },
  };
  const admission = new RedisAdmission({ store });
  await assert.rejects(
    admission.acquire("client"),
    (error) => error.status === 503 && !error.message.includes("Synthetic"),
  );
  for (const value of [0, -1, 0.5, Infinity])
    assert.throws(() => new RedisAdmission({ store, clientLimit: value }));
});
