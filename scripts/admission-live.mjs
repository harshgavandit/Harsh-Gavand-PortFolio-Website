// Explicit Redis/Lua verification in isolated, expiring namespaces. No model calls.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { loadConfig } from "../server/config.mjs";
import { RedisQuota } from "../server/quota.mjs";
import { RedisAdmission } from "../server/admission.mjs";

const config = loadConfig();
if (!config.quotaUrl || !config.quotaToken)
  throw new Error(
    "Upstash credentials are required for this explicit verification.",
  );
const namespace = `admission-verification:${randomUUID()}`;
const keys = new Set();
const now = Date.now();
function store(suffix) {
  const q = new RedisQuota({
    url: config.quotaUrl,
    token: config.quotaToken,
    namespace: namespace + suffix,
  });
  const command = q.command.bind(q);
  q.command = (args) => {
    const candidates =
      args[0] === "EVAL" ? args.slice(3, 3 + args[2]) : [args[1]];
    for (const key of candidates) {
      assert.ok(
        typeof key === "string" && key.startsWith(`{${namespace}`),
        "Never touch the production namespace",
      );
      keys.add(key);
    }
    return command(args);
  };
  return q;
}
const first = store(":requests");
try {
  const options = {
    store: first,
    clientLimit: 2,
    globalLimit: 3,
    concurrentLimit: 3,
    clock: () => now,
  };
  const a = new RedisAdmission(options),
    b = new RedisAdmission(options);
  const attempts = await Promise.allSettled(
    Array.from({ length: 8 }, (_, i) =>
      (i % 2 ? a : b).acquire("synthetic-client-a"),
    ),
  );
  const leases = attempts
    .filter((result) => result.status === "fulfilled")
    .map((result) => result.value);
  assert.equal(
    leases.length,
    2,
    "Independent instances must share the client allowance",
  );
  assert.ok(
    attempts
      .filter((result) => result.status === "rejected")
      .every((result) => result.reason.status === 429),
  );
  await Promise.all(leases.map((lease) => a.release(lease)));
  const third = await b.acquire("synthetic-client-b");
  await b.release(third);
  await assert.rejects(a.acquire("synthetic-client-c"), {
    status: 429,
    code: "rate_limit",
  });

  const concurrentStore = store(":concurrency");
  const concurrent = new RedisAdmission({
    store: concurrentStore,
    concurrentLimit: 1,
    clock: () => now,
  });
  const activeKey = `{${concurrentStore.namespace}}:admission:active`;
  await concurrentStore.command([
    "ZADD",
    activeKey,
    now - 1,
    "synthetic-expired-lease",
  ]);
  const active = await concurrent.acquire("synthetic-client-a");
  await assert.rejects(
    concurrent.acquire("synthetic-client-b"),
    (error) => error.status === 429 && error.retryAfter === 5,
  );
  await concurrent.release(active);
  const replacement = await concurrent.acquire("synthetic-client-b");
  await concurrent.release(replacement);
  assert.equal(await concurrentStore.command(["ZCARD", activeKey]), 0);
  console.log(
    JSON.stringify({
      independentInstances: 2,
      concurrentAttempts: 8,
      admittedForOneClient: leases.length,
      sharedGlobalLimitEnforced: true,
      expiredLeaseRecovered: true,
      concurrencyReleased: true,
      providerCalls: 0,
      productionLedgerModified: false,
    }),
  );
} finally {
  const targets = [...keys];
  assert.ok(
    targets.length > 0 &&
      targets.every((key) => key.startsWith(`{${namespace}`)),
  );
  await Promise.all(
    targets.map((key) =>
      RedisQuota.prototype.command.call(first, ["DEL", key]),
    ),
  );
}
