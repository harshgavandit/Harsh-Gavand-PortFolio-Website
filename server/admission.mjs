import { createHash, randomUUID } from "node:crypto";
import { ChatError } from "./openai.mjs";

// One atomic admission across every Vercel instance. Client addresses are hashed;
// no conversation text or raw IP addresses enter these short-lived keys.
export const ADMIT_SCRIPT = `
local client = tonumber(redis.call('GET', KEYS[1]) or '0')
local global = tonumber(redis.call('GET', KEYS[2]) or '0')
if not client or not global or client < 0 or global < 0 then return {-1, 0} end
local now = tonumber(ARGV[1])
redis.call('ZREMRANGEBYSCORE', KEYS[3], '-inf', now)
if client >= tonumber(ARGV[2]) or global >= tonumber(ARGV[3]) then
  return {0, tonumber(ARGV[6])}
end
if redis.call('ZCARD', KEYS[3]) >= tonumber(ARGV[4]) then return {0, 5} end
redis.call('INCR', KEYS[1])
redis.call('INCR', KEYS[2])
redis.call('PEXPIRE', KEYS[1], ARGV[5])
redis.call('PEXPIRE', KEYS[2], ARGV[5])
redis.call('ZADD', KEYS[3], now + tonumber(ARGV[7]), ARGV[8])
redis.call('PEXPIRE', KEYS[3], tonumber(ARGV[7]) * 2)
return {1, 0}
`;

function unavailable() {
  return new ChatError(
    503,
    "quota_unavailable",
    "The assistant’s usage protection is temporarily unavailable. Please try again later or contact Harsh.",
  );
}

export class RedisAdmission {
  constructor({
    store,
    clientLimit = 10,
    globalLimit = 60,
    concurrentLimit = 3,
    windowMs = 600000,
    leaseMs = 120000,
    clock = Date.now,
  }) {
    if (
      ![clientLimit, globalLimit, concurrentLimit, windowMs, leaseMs].every(
        (n) => Number.isSafeInteger(n) && n > 0,
      )
    )
      throw new Error("Invalid admission configuration.");
    this.store = store;
    this.clientLimit = clientLimit;
    this.globalLimit = globalLimit;
    this.concurrentLimit = concurrentLimit;
    this.windowMs = windowMs;
    this.leaseMs = leaseMs;
    this.clock = clock;
  }
  async acquire(client) {
    if (!this.store.configured) throw unavailable();
    const now = this.clock();
    const bucket = Math.floor(now / this.windowMs);
    const retryAfter = Math.max(
      1,
      Math.ceil(((bucket + 1) * this.windowMs - now) / 1000),
    );
    const prefix = `{${this.store.namespace}}:admission`;
    const identity = createHash("sha256")
      .update(String(client || "unknown"))
      .digest("hex");
    const lease = { key: `${prefix}:active`, id: randomUUID() };
    let result;
    try {
      result = await this.store.command([
        "EVAL",
        ADMIT_SCRIPT,
        3,
        `${prefix}:client:${identity}:${bucket}`,
        `${prefix}:global:${bucket}`,
        lease.key,
        now,
        this.clientLimit,
        this.globalLimit,
        this.concurrentLimit,
        this.windowMs * 2,
        retryAfter,
        this.leaseMs,
        lease.id,
      ]);
    } catch {
      throw unavailable();
    }
    if (
      !Array.isArray(result) ||
      result.length !== 2 ||
      !Number.isSafeInteger(result[1]) ||
      result[1] < 0
    )
      throw unavailable();
    if (result[0] === 0 && result[1] > 0)
      throw new ChatError(
        429,
        "rate_limit",
        "The assistant is busy. Please try again shortly or use the contact links.",
        result[1],
      );
    if (result[0] !== 1 || result[1] !== 0) throw unavailable();
    return lease;
  }
  async release(lease) {
    const result = await this.store.command(["ZREM", lease.key, lease.id]);
    if (result !== 0 && result !== 1) throw unavailable();
  }
}
