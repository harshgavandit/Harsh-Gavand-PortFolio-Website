import assert from "node:assert/strict";
import { test } from "node:test";
import { generateWithQuota } from "../server/quota-lifecycle.mjs";
import {
  RedisQuota,
  ENQUEUE_SETTLEMENT_SCRIPT,
  CLAIM_SETTLEMENTS_SCRIPT,
  SETTLE_SCRIPT,
  RETRY_FAILURE_SCRIPT,
} from "../server/quota.mjs";
import { buildRequest } from "../server/openai.mjs";
const request = buildRequest([
  { role: "user", content: "Explain API architecture." },
]);
function fixture(overrides = {}) {
  const events = [];
  const controller = new AbortController();
  const quota = {
    reserve: async (amount) => {
      events.push("reserve");
      return { amount };
    },
    settle: async (_reservation, actual) => events.push(["settle", actual]),
    releaseOrEnqueueRetry: async (_reservation, recovery) =>
      events.push(["recover", recovery]),
    ...overrides,
  };
  const generate = async () => {
    events.push("generate");
    return {
      answer: "Answer",
      usage: { input_tokens: 100, output_tokens: 10 },
    };
  };
  return {
    events,
    controller,
    quota,
    run: (extra = {}) =>
      generateWithQuota({
        request,
        signal: controller.signal,
        quota,
        generate,
        ...extra,
      }),
  };
}
test("already-aborted requests never reserve or invoke the provider", async () => {
  const f = fixture();
  f.controller.abort();
  await assert.rejects(f.run(), { name: "AbortError" });
  assert.deepEqual(f.events, []);
});
test("abort while admission is in flight releases before provider dispatch", async () => {
  const f = fixture();
  f.quota.reserve = async (amount) => {
    f.controller.abort();
    return { amount };
  };
  await assert.rejects(f.run(), { name: "AbortError" });
  assert.deepEqual(f.events, [
    ["recover", { providerDispatched: false, actual: undefined }],
  ]);
});
test("successful generation reconciles actual usage exactly once", async () => {
  const f = fixture();
  assert.equal((await f.run()).answer, "Answer");
  assert.deepEqual(f.events, ["reserve", "generate", ["settle", 30]]);
});
test("provider timeout keeps potentially billable usage reserved and is not retried", async () => {
  const f = fixture();
  let calls = 0;
  await assert.rejects(
    f.run({
      generate: async () => {
        calls++;
        throw new Error("upstream timeout");
      },
    }),
    /upstream timeout/,
  );
  assert.equal(calls, 1);
  assert.deepEqual(f.events, [
    "reserve",
    ["recover", { providerDispatched: true, actual: undefined }],
  ]);
});
test("failed settlement queues reconciliation and preserves the generated answer", async () => {
  const f = fixture({
    settle: async () => {
      throw new Error("lost acknowledgement");
    },
  });
  assert.equal((await f.run()).answer, "Answer");
  assert.deepEqual(f.events, [
    "reserve",
    "generate",
    ["recover", { providerDispatched: true, actual: 30 }],
  ]);
});
test("failed retry enqueue surfaces an accounting failure instead of swallowing it", async () => {
  const f = fixture({
    settle: async () => {
      throw new Error("store down");
    },
    releaseOrEnqueueRetry: async () => {
      throw new Error("journal unavailable");
    },
  });
  await assert.rejects(f.run(), /journal unavailable/);
});
const monthKey = "{portfolio-ai:v1}:month:2026-10";
const requestKey =
  "{portfolio-ai:v1}:request:123e4567-e89b-42d3-a456-426614174000";
const reservation = { monthKey, requestKey, amount: 140 };
function storeWith(handler) {
  return new RedisQuota({
    url: "https://test.upstash.io",
    token: "synthetic",
    clock: () => 100000,
    fetchImpl: async (_url, options) =>
      Response.json({ result: await handler(JSON.parse(options.body)) }),
  });
}
test("unknown provider failures cannot trigger a refund or retry command", async () => {
  let calls = 0;
  const q = storeWith(() => {
    calls++;
    return 1;
  });
  assert.equal(
    await q.releaseOrEnqueueRetry(reservation, { providerDispatched: true }),
    "retained",
  );
  assert.equal(calls, 0);
});
test("pre-dispatch rollback uses idempotent settlement at zero cost", async () => {
  const commands = [];
  const q = storeWith((c) => {
    commands.push(c);
    return 1;
  });
  assert.equal(
    await q.releaseOrEnqueueRetry(reservation, { providerDispatched: false }),
    "released",
  );
  assert.equal(commands[0][1], SETTLE_SCRIPT);
  assert.equal(commands[0].at(-1), 0);
});
test("durable retry stores only reservation metadata and validated actual usage", async () => {
  const commands = [];
  const q = storeWith((c) => {
    commands.push(c);
    return 1;
  });
  assert.equal(
    await q.releaseOrEnqueueRetry(reservation, {
      providerDispatched: true,
      actual: 112,
    }),
    "queued",
  );
  assert.equal(commands[0][1], ENQUEUE_SETTLEMENT_SCRIPT);
  assert.deepEqual(JSON.parse(commands[0].at(-1)), {
    ...reservation,
    actual: 112,
  });
  assert.ok(!commands[0].at(-1).includes("Answer"));
  await assert.rejects(
    q.releaseOrEnqueueRetry(reservation, {
      providerDispatched: true,
      actual: 141,
    }),
  );
});
test("reconstructed worker claims jobs with a lease and settles once before removing them", async () => {
  const commands = [];
  const job = JSON.stringify({ ...reservation, actual: 112 });
  const q = storeWith((c) => {
    commands.push(c);
    if (c[1] === CLAIM_SETTLEMENTS_SCRIPT) return [job];
    return 1;
  });
  assert.deepEqual(await q.retrySettlements(), {
    claimed: 1,
    settled: 1,
    failed: 0,
    deadLettered: 0,
  });
  assert.ok(commands.some((c) => c[1] === SETTLE_SCRIPT));
  assert.equal(commands.at(-1)[0], "ZREM");
  assert.ok(CLAIM_SETTLEMENTS_SCRIPT.includes("ZADD"));
});
test("repeated settlement failure is recorded in the dead-letter path", async () => {
  const job = JSON.stringify({ ...reservation, actual: 112 });
  const q = storeWith((c) => {
    if (c[1] === CLAIM_SETTLEMENTS_SCRIPT) return [job];
    if (c[1] === SETTLE_SCRIPT) throw new Error("unavailable");
    if (c[1] === RETRY_FAILURE_SCRIPT) return -1;
    return 1;
  });
  assert.deepEqual(await q.retrySettlements(), {
    claimed: 1,
    settled: 0,
    failed: 0,
    deadLettered: 1,
  });
  assert.match(RETRY_FAILURE_SCRIPT, /attempts >= 5/);
});
test("malformed or cross-namespace retry payloads fail closed", async () => {
  const q = storeWith((c) =>
    c[1] === CLAIM_SETTLEMENTS_SCRIPT
      ? [
          JSON.stringify({
            ...reservation,
            monthKey: "foreign:month",
            actual: 10,
          }),
        ]
      : 1,
  );
  await assert.rejects(
    q.retrySettlements(),
    (e) => e.code === "quota_unavailable",
  );
});
