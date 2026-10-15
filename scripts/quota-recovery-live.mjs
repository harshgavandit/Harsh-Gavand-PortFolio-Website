// Isolated Redis/Lua verification. No provider calls or production ledger writes.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { loadConfig } from "../server/config.mjs";
import { RedisQuota, periodsAt } from "../server/quota.mjs";
const config = loadConfig();
if (!config.quotaUrl || !config.quotaToken)
  throw new Error("Configure Upstash for isolated recovery verification.");
const namespace = "quota-recovery-test:" + randomUUID();
const prefix = `{${namespace}}`;
let now = Date.now();
const settings = {
  url: config.quotaUrl,
  token: config.quotaToken,
  namespace,
  clock: () => now,
  dailyLimit: 100,
  monthlyBudgetMicros: 10000,
};
const quota = new RedisQuota(settings);
const keys = new Set([
  `${prefix}:day:${periodsAt(now).day}`,
  `${prefix}:settlement-retries`,
  `${prefix}:settlement-dead-letters`,
]);
async function reserve() {
  const r = await quota.reserve(140);
  keys.add(r.monthKey);
  keys.add(r.requestKey);
  return r;
}
try {
  const cancelled = await reserve();
  assert.equal(
    await quota.releaseOrEnqueueRetry(cancelled, { providerDispatched: false }),
    "released",
  );
  assert.equal((await quota.snapshot()).budgetUsedUsd, 0);
  const uncertain = await reserve();
  assert.equal(
    await quota.releaseOrEnqueueRetry(uncertain, { providerDispatched: true }),
    "retained",
  );
  const settled = await reserve();
  assert.equal(
    await quota.releaseOrEnqueueRetry(settled, {
      providerDispatched: true,
      actual: 112,
    }),
    "queued",
  );
  const instances = [new RedisQuota(settings), new RedisQuota(settings)];
  const reports = await Promise.all(
    instances.map((store) => store.retrySettlements()),
  );
  assert.equal(
    reports.reduce((sum, report) => sum + report.claimed, 0),
    1,
  );
  assert.equal(
    reports.reduce((sum, report) => sum + report.settled, 0),
    1,
  );
  await quota.settle(settled, 112);
  assert.equal((await quota.snapshot()).budgetUsedUsd, 252 / 1000000);
  const deferredAbort = await reserve();
  const broken = new RedisQuota(settings);
  broken.settle = async () => {
    throw new Error("Injected transient settlement failure");
  };
  assert.equal(
    await broken.releaseOrEnqueueRetry(deferredAbort, {
      providerDispatched: false,
    }),
    "queued",
  );
  assert.equal((await new RedisQuota(settings).retrySettlements()).settled, 1);
  assert.equal((await quota.snapshot()).budgetUsedUsd, 252 / 1000000);
  const exhausted = await reserve();
  await quota.releaseOrEnqueueRetry(exhausted, {
    providerDispatched: true,
    actual: 100,
  });
  for (let attempt = 1; attempt <= 5; attempt++) {
    now += 300001;
    const report = await broken.retrySettlements();
    assert.equal(report.claimed, 1);
    assert.equal(report.deadLettered, attempt === 5 ? 1 : 0);
  }
  assert.equal(
    await quota.command(["ZCARD", `${prefix}:settlement-dead-letters`]),
    1,
  );
  assert.equal(
    await quota.command(["ZCARD", `${prefix}:settlement-retries`]),
    0,
  );
  assert.equal((await quota.snapshot()).budgetUsedUsd, 392 / 1000000);
  const proof = {
    verifiedAt: new Date().toISOString(),
    preDispatchRollback: true,
    uncertainProviderUsageRetained: true,
    reconstructedWorkerRecovery: true,
    concurrentWorkersClaimOnce: true,
    idempotentSettlement: true,
    deferredAbortRecovery: true,
    fiveFailuresDeadLettered: true,
    providerCalls: 0,
    productionLedgerModified: false,
  };
  await mkdir(new URL("../tmp/", import.meta.url), { recursive: true });
  await writeFile(
    new URL("../tmp/quota-recovery-verification.json", import.meta.url),
    JSON.stringify(proof, null, 2) + "\n",
  );
  console.log(JSON.stringify(proof));
} finally {
  assert.ok(
    namespace.startsWith("quota-recovery-test:") &&
      [...keys].every((key) => key.startsWith(prefix + ":")),
  );
  await quota.command(["DEL", ...keys]);
}
