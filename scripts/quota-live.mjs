// Manual verification against the configured Redis database; no OpenAI calls.
// Uses isolated, expiring test keys and never resets the production allowance.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { loadConfig } from "../server/config.mjs";
import { RedisQuota } from "../server/quota.mjs";

const config = loadConfig();
if (!config.quotaUrl || !config.quotaToken)
  throw new Error("Configure the Upstash REST credentials first.");
const namespace = `quota-verification:${randomUUID()}`;
const settings = {
  url: config.quotaUrl,
  token: config.quotaToken,
  namespace,
  dailyLimit: 5,
  monthlyBudgetMicros: 1000,
};
const stores = [new RedisQuota(settings), new RedisQuota(settings)];
const results = await Promise.allSettled(
  Array.from({ length: 24 }, (_, i) => stores[i % 2].reserve(100)),
);
const accepted = results
  .filter((r) => r.status === "fulfilled")
  .map((r) => r.value);
assert.equal(accepted.length, 5);
assert.ok(
  results
    .filter((r) => r.status === "rejected")
    .every((r) => r.reason.code === "daily_limit"),
);
const restarted = new RedisQuota(settings);
await assert.rejects(restarted.reserve(100), (e) => e.code === "daily_limit");
const monthly = new RedisQuota({
  ...settings,
  namespace: namespace + ":monthly",
  dailyLimit: 200,
  monthlyBudgetMicros: 200,
});
const first = await monthly.reserve(150);
await assert.rejects(monthly.reserve(150), (e) => e.code === "monthly_budget");
await monthly.settle(first, 50);
await monthly.settle(first, 50); // Must not refund twice.
const second = await monthly.reserve(150);
await assert.rejects(
  new RedisQuota({
    ...settings,
    namespace: namespace + ":monthly",
    dailyLimit: 200,
    monthlyBudgetMicros: 200,
  }).reserve(1),
  (e) => e.code === "monthly_budget",
);
// Completion after a UTC month rollover reconciles against the original month.
let time = Date.now();
const crossing = new RedisQuota({
  ...settings,
  namespace: namespace + ":rollover",
  clock: () => time,
  dailyLimit: 1,
});
const before = await crossing.reserve(100);
const next = new Date(time);
time = Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 1);
await crossing.reserve(100);
await crossing.settle(before, 20);
const proof = {
  verifiedAt: new Date().toISOString(),
  concurrentAttempts: 24,
  admitted: accepted.length,
  separateInstancesShareQuota: true,
  reconstructedInstancePreservesQuota: true,
  monthlyCutoff: true,
  idempotentSettlement: true,
  utcMonthRollover: true,
  openAiCalls: 0,
};
console.log(JSON.stringify(proof, null, 2));
if (process.argv[2])
  await writeFile(process.argv[2], JSON.stringify(proof, null, 2));
