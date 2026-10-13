import assert from "node:assert/strict";
import { test } from "node:test";
import {
  RedisQuota,
  periodsAt,
  reservationFor,
  usageCost,
  RESERVE_SCRIPT,
  SETTLE_SCRIPT,
} from "../server/quota.mjs";
import { buildRequest } from "../server/openai.mjs";

const url = "https://test.upstash.io";
const token = "test-quota-secret";
const clock = () => Date.parse("2026-10-13T12:00:00Z");
const question = [{ role: "user", content: "Explain Harsh's AI projects." }];

test("reservation covers full trusted context, history, schema and capped output", () => {
  const request = buildRequest(question);
  const estimate = reservationFor(request);
  assert.ok(
    estimate.inputBound > Buffer.byteLength(JSON.stringify(request), "utf8"),
  );
  assert.ok(
    estimate.amount >=
      usageCost(
        { input_tokens: estimate.inputBound, output_tokens: 1000 },
        estimate,
      ),
  );
  assert.equal(
    usageCost({ input_tokens: 1000, output_tokens: 200 }, estimate),
    400,
  );
  for (const usage of [
    undefined,
    { input_tokens: -1, output_tokens: 2 },
    { input_tokens: estimate.inputBound + 1, output_tokens: 1 },
    { input_tokens: 1, output_tokens: 1001 },
  ])
    assert.equal(usageCost(usage, estimate), estimate.amount);
  for (const override of [
    { model: "expensive-model" },
    { service_tier: "fast" },
    { reasoning: { effort: "high" } },
    { max_output_tokens: 2000 },
    { tools: [] },
  ])
    assert.throws(() => reservationFor({ ...request, ...override }));
  assert.throws(
    () => reservationFor({ ...request, instructions: "x".repeat(100001) }),
    (e) => e.code === "context_too_large",
  );
});

test("periods and rollover use UTC, including year and leap-day boundaries", () => {
  const p = periodsAt("2026-12-31T23:59:59.999Z");
  assert.equal(p.day, "2026-12-31");
  assert.equal(p.month, "2026-12");
  assert.equal(new Date(p.dayReset).toISOString(), "2027-01-01T00:00:00.000Z");
  assert.equal(
    new Date(p.monthReset).toISOString(),
    "2027-01-01T00:00:00.000Z",
  );
  assert.equal(
    new Date(periodsAt("2028-02-28T12:00:00Z").dayReset).toISOString(),
    "2028-02-29T00:00:00.000Z",
  );
});

test("shared Redis reservation uses one atomic script and private authenticated requests", async () => {
  const calls = [];
  const store = new RedisQuota({
    url,
    token,
    clock,
    fetchImpl: async (endpoint, options) => {
      assert.equal(endpoint, url);
      assert.equal(options.headers.Authorization, `Bearer ${token}`);
      assert.ok(!options.body.includes(token));
      const command = JSON.parse(options.body);
      calls.push(command);
      return Response.json({
        result: command[1] === RESERVE_SCRIPT ? [1, 1, 3000] : 1,
      });
    },
  });
  const reservation = await store.reserve(3000);
  assert.deepEqual(calls[0].slice(0, 3), ["EVAL", RESERVE_SCRIPT, 3]);
  assert.match(calls[0][3], /day:2026-10-13$/);
  assert.match(calls[0][4], /month:2026-10$/);
  assert.equal(calls[0][6], 200);
  assert.equal(calls[0][7], 1000000);
  await store.settle(reservation, 400);
  assert.deepEqual(calls[1].slice(0, 3), ["EVAL", SETTLE_SCRIPT, 2]);
  assert.equal(calls[1][5], 400);
});

for (const [period, code, reset] of [
  ["daily", "daily_limit", 43200],
  ["monthly", "monthly_budget", 1598400],
]) {
  test(`${period} exhaustion blocks requests with a reset interval`, async () => {
    const store = new RedisQuota({
      url,
      token,
      clock,
      fetchImpl: async () => Response.json({ result: [0, period] }),
    });
    await assert.rejects(
      store.reserve(10),
      (e) => e.status === 429 && e.code === code && e.retryAfter === reset,
    );
  });
}

test("missing credentials, store errors and corrupt responses fail closed", async () => {
  const missing = new RedisQuota({});
  await assert.rejects(
    missing.reserve(10),
    (e) => e.code === "quota_unavailable",
  );
  for (const fetchImpl of [
    async () => {
      throw new Error(token);
    },
    async () => Response.json({ error: token }),
    async () => Response.json({ result: [1, 201, 10] }),
    async () => Response.json({ result: [1, 1, 1000001] }),
    async () => Response.json({ result: "invalid" }),
    async () => Response.json({}, { status: 503 }),
  ]) {
    const store = new RedisQuota({ url, token, fetchImpl });
    await assert.rejects(
      store.reserve(10),
      (e) => e.code === "quota_unavailable" && !e.message.includes(token),
    );
  }
});

test("budget credentials cannot be forwarded to arbitrary HTTP endpoints", () => {
  for (const bad of [
    "http://test.upstash.io",
    "https://attacker.example",
    "https://test.upstash.io?token=secret",
    "https://user:secret@test.upstash.io",
  ])
    assert.throws(() => new RedisQuota({ url: bad, token }));
});
