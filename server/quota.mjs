import { randomUUID } from "node:crypto";
import { ChatError } from "./openai.mjs";

// Integer micro-dollars avoid floating point errors. A 2x pricing margin keeps
// this an intentionally conservative allowance rather than an invoice ledger.
// GPT-6 Luna Standard: $0.10/M input, $0.50/M output (13 October 2026).
export function reservationFor(request) {
  if (
    request.model !== "gpt-6-luna" ||
    request.service_tier !== "default" ||
    request.reasoning?.effort !== "none" ||
    request.max_output_tokens !== 1000 ||
    request.tools
  )
    throw new Error("Unsupported budget pricing configuration.");
  const bytes = Buffer.byteLength(JSON.stringify(request), "utf8");
  if (bytes > 100000)
    throw new ChatError(
      400,
      "context_too_large",
      "Please shorten the conversation and try again.",
    );
  // Byte-level text tokenizers cannot emit more text tokens than UTF-8 bytes.
  // Count the entire serialized request plus generous framing overhead.
  const inputBound = bytes + 4096;
  return { inputBound, amount: Math.ceil(inputBound / 5 + 1000) };
}

export function usageCost(usage, reservation) {
  if (
    !Number.isSafeInteger(usage?.input_tokens) ||
    usage.input_tokens < 0 ||
    usage.input_tokens > reservation.inputBound ||
    !Number.isSafeInteger(usage?.output_tokens) ||
    usage.output_tokens < 0 ||
    usage.output_tokens > 1000
  )
    return reservation.amount;
  // Treat every input token as uncached: provider cache discounts only save money.
  return Math.min(
    reservation.amount,
    Math.ceil(usage.input_tokens / 5 + usage.output_tokens),
  );
}

export function periodsAt(time) {
  const date = new Date(time);
  if (!Number.isFinite(date.getTime())) throw new Error("Invalid quota clock.");
  const day = date.toISOString().slice(0, 10);
  const month = day.slice(0, 7);
  return {
    day,
    month,
    dayReset: Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate() + 1,
    ),
    monthReset: Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1),
  };
}

export const RESERVE_SCRIPT = `
local daily = tonumber(redis.call('GET', KEYS[1]) or '0')
local monthly = tonumber(redis.call('GET', KEYS[2]) or '0')
local amount = tonumber(ARGV[3])
if not daily or not monthly or daily < 0 or monthly < 0 then return redis.error_reply('Invalid quota state') end
if redis.call('EXISTS', KEYS[3]) ~= 0 then return redis.error_reply('Duplicate reservation') end
if daily >= tonumber(ARGV[1]) then return {0, 'daily'} end
if monthly + amount > tonumber(ARGV[2]) then return {0, 'monthly'} end
redis.call('INCR', KEYS[1])
redis.call('INCRBY', KEYS[2], amount)
redis.call('EXPIREAT', KEYS[1], ARGV[4])
redis.call('EXPIREAT', KEYS[2], ARGV[5])
redis.call('HSET', KEYS[3], 'amount', amount, 'settled', 0)
redis.call('EXPIREAT', KEYS[3], ARGV[5])
return {1, daily + 1, monthly + amount}
`;

export const SETTLE_SCRIPT = `
if redis.call('EXISTS', KEYS[1]) == 0 or redis.call('EXISTS', KEYS[2]) == 0 then
  return redis.error_reply('Missing quota state')
end
if redis.call('HGET', KEYS[2], 'settled') == '1' then return 0 end
local reserved = tonumber(redis.call('HGET', KEYS[2], 'amount'))
local actual = tonumber(ARGV[1])
local monthly = tonumber(redis.call('GET', KEYS[1]))
if not reserved or not monthly or actual < 0 or actual > reserved or monthly < reserved then
  return redis.error_reply('Invalid settlement')
end
redis.call('DECRBY', KEYS[1], reserved - actual)
redis.call('HSET', KEYS[2], 'settled', 1)
return 1
`;

// Retry records contain accounting metadata only; never prompts or responses.
export const ENQUEUE_SETTLEMENT_SCRIPT = `
if redis.call('EXISTS', KEYS[1]) == 0 then return redis.error_reply('Missing reservation') end
if redis.call('HGET', KEYS[1], 'settled') == '1' then return 0 end
local reserved = tonumber(redis.call('HGET', KEYS[1], 'amount'))
local actual = tonumber(ARGV[1])
if not reserved or not actual or actual < 0 or actual > reserved then return redis.error_reply('Invalid retry') end
redis.call('ZADD', KEYS[2], 'NX', ARGV[2], ARGV[3])
return 1
`;

export const CLAIM_SETTLEMENTS_SCRIPT = `
local jobs = redis.call('ZRANGEBYSCORE', KEYS[1], '-inf', ARGV[1], 'LIMIT', 0, ARGV[3])
for _, job in ipairs(jobs) do redis.call('ZADD', KEYS[1], ARGV[2], job) end
return jobs
`;

export const RETRY_FAILURE_SCRIPT = `
if redis.call('EXISTS', KEYS[1]) == 0 or redis.call('HGET', KEYS[1], 'settled') == '1' then
  redis.call('ZREM', KEYS[2], ARGV[1])
  return 0
end
local attempts = redis.call('HINCRBY', KEYS[1], 'retry_attempts', 1)
if attempts >= 5 then
  redis.call('ZADD', KEYS[3], ARGV[2], ARGV[1])
  redis.call('EXPIRE', KEYS[3], 7776000)
  redis.call('ZREMRANGEBYSCORE', KEYS[3], '-inf', tonumber(ARGV[2]) - 7776000000)
  redis.call('ZREM', KEYS[2], ARGV[1])
  return -1
end
redis.call('ZADD', KEYS[2], 'XX', tonumber(ARGV[2]) + math.min(300000, 30000 * (2 ^ (attempts - 1))), ARGV[1])
return attempts
`;

const unavailable = () =>
  new ChatError(
    503,
    "quota_unavailable",
    "The assistant is temporarily paused to protect its usage allowance. Please try later or contact Harsh.",
    60,
  );

export class RedisQuota {
  constructor({
    url,
    token,
    dailyLimit = 200,
    monthlyBudgetMicros = 1000000,
    namespace = "portfolio-ai:v1",
    clock = Date.now,
    fetchImpl = fetch,
  }) {
    this.configured = Boolean(url && token);
    this.url = url;
    this.token = token;
    this.dailyLimit = dailyLimit;
    this.monthlyBudgetMicros = monthlyBudgetMicros;
    this.namespace = namespace;
    this.clock = clock;
    this.fetchImpl = fetchImpl;
    if (
      !Number.isSafeInteger(dailyLimit) ||
      dailyLimit < 1 ||
      !Number.isSafeInteger(monthlyBudgetMicros) ||
      monthlyBudgetMicros < 1 ||
      !/^[a-zA-Z0-9:_-]{1,100}$/.test(namespace)
    )
      throw new Error("Invalid quota configuration.");
    if (url) {
      const parsed = new URL(url);
      if (
        parsed.protocol !== "https:" ||
        parsed.username ||
        parsed.password ||
        !/^[a-z0-9-]+\.upstash\.io$/.test(parsed.hostname) ||
        parsed.pathname !== "/" ||
        parsed.search ||
        parsed.hash
      )
        throw new Error("Use the HTTPS Upstash REST endpoint.");
    }
  }
  async command(command) {
    if (!this.configured) throw unavailable();
    try {
      const response = await this.fetchImpl(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify(command),
        signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) throw new Error("Quota service unavailable.");
      const body = await response.json();
      if (body.error || !Object.hasOwn(body, "result"))
        throw new Error("Quota command failed.");
      return body.result;
    } catch {
      throw unavailable();
    }
  }
  async reserve(amount) {
    if (!Number.isSafeInteger(amount) || amount < 1) throw unavailable();
    const time = this.clock();
    const periods = periodsAt(time);
    // A hash tag co-locates every key for Redis deployments with clustering.
    const prefix = `{${this.namespace}}`;
    const dayKey = `${prefix}:day:${periods.day}`;
    const monthKey = `${prefix}:month:${periods.month}`;
    const requestKey = `${prefix}:request:${randomUUID()}`;
    const result = await this.command([
      "EVAL",
      RESERVE_SCRIPT,
      3,
      dayKey,
      monthKey,
      requestKey,
      this.dailyLimit,
      this.monthlyBudgetMicros,
      amount,
      Math.ceil(periods.dayReset / 1000) + 172800,
      Math.ceil(periods.monthReset / 1000) + 604800,
    ]);
    if (
      Array.isArray(result) &&
      result[0] === 0 &&
      ["daily", "monthly"].includes(result[1])
    ) {
      const daily = result[1] === "daily";
      throw new ChatError(
        429,
        daily ? "daily_limit" : "monthly_budget",
        daily
          ? "The assistant has reached today's question allowance. Please return tomorrow or contact Harsh."
          : "The assistant has reached its monthly usage allowance. Please explore the projects or contact Harsh.",
        Math.max(
          1,
          Math.ceil(
            ((daily ? periods.dayReset : periods.monthReset) - time) / 1000,
          ),
        ),
      );
    }
    if (
      !Array.isArray(result) ||
      result[0] !== 1 ||
      !Number.isSafeInteger(result[1]) ||
      !Number.isSafeInteger(result[2]) ||
      result[1] < 1 ||
      result[1] > this.dailyLimit ||
      result[2] < amount ||
      result[2] > this.monthlyBudgetMicros
    )
      throw unavailable();
    return { monthKey, requestKey, amount };
  }
  async snapshot() {
    const periods = periodsAt(this.clock());
    const prefix = `{${this.namespace}}`;
    const result = await this.command([
      "MGET",
      `${prefix}:day:${periods.day}`,
      `${prefix}:month:${periods.month}`,
    ]);
    if (
      !Array.isArray(result) ||
      result.length !== 2 ||
      result.some((v) => v !== null && !/^[0-9]+$/.test(String(v)))
    )
      throw unavailable();
    const [requestsUsed, budgetUsedMicros] = result.map((v) => Number(v || 0));
    if (![requestsUsed, budgetUsedMicros].every(Number.isSafeInteger))
      throw unavailable();
    const backlog = await Promise.all([
      this.command(["ZCARD", `${prefix}:settlement-retries`]),
      this.command(["ZCARD", `${prefix}:settlement-dead-letters`]),
    ]);
    if (!backlog.every((value) => Number.isSafeInteger(value) && value >= 0))
      throw unavailable();
    return {
      day: periods.day,
      month: periods.month,
      requestsUsed,
      dailyLimit: this.dailyLimit,
      requestsRemaining: Math.max(0, this.dailyLimit - requestsUsed),
      budgetUsedUsd: budgetUsedMicros / 1000000,
      monthlyBudgetUsd: this.monthlyBudgetMicros / 1000000,
      budgetRemainingUsd:
        Math.max(0, this.monthlyBudgetMicros - budgetUsedMicros) / 1000000,
      dailyResetUtc: new Date(periods.dayReset).toISOString(),
      monthlyResetUtc: new Date(periods.monthReset).toISOString(),
      settlementRetriesQueued: backlog[0],
      settlementDeadLetters: backlog[1],
    };
  }
  async releaseOrEnqueueRetry(reservation, { providerDispatched, actual }) {
    if (providerDispatched && actual === undefined) return "retained";
    const amount = providerDispatched ? actual : 0;
    if (!providerDispatched) {
      try {
        await this.settle(reservation, 0);
        return "released";
      } catch {
        /* A failed rollback becomes a durable zero-cost settlement. */
      }
    }
    if (
      !Number.isSafeInteger(amount) ||
      amount < 0 ||
      amount > reservation.amount
    )
      throw unavailable();
    const job = JSON.stringify({ ...reservation, actual: amount });
    const result = await this.command([
      "EVAL",
      ENQUEUE_SETTLEMENT_SCRIPT,
      2,
      reservation.requestKey,
      `{${this.namespace}}:settlement-retries`,
      amount,
      this.clock(),
      job,
    ]);
    if (result !== 0 && result !== 1) throw unavailable();
    return result === 1 ? "queued" : "settled";
  }
  async retrySettlements({ limit = 5 } = {}) {
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 20)
      throw unavailable();
    const prefix = `{${this.namespace}}`;
    const queue = `${prefix}:settlement-retries`;
    const now = this.clock();
    const jobs = await this.command([
      "EVAL",
      CLAIM_SETTLEMENTS_SCRIPT,
      1,
      queue,
      now,
      now + Math.max(120000, limit * 12000 + 30000),
      limit,
    ]);
    if (!Array.isArray(jobs) || jobs.length > limit) throw unavailable();
    const report = {
      claimed: jobs.length,
      settled: 0,
      failed: 0,
      deadLettered: 0,
    };
    for (const encoded of jobs) {
      let job;
      try {
        job = JSON.parse(encoded);
      } catch {
        throw unavailable();
      }
      if (
        typeof job.monthKey !== "string" ||
        !job.monthKey.startsWith(prefix) ||
        !/^:month:\d{4}-\d{2}$/.test(job.monthKey.slice(prefix.length)) ||
        typeof job.requestKey !== "string" ||
        !job.requestKey.startsWith(prefix) ||
        !/^:request:[a-f0-9-]{36}$/.test(job.requestKey.slice(prefix.length)) ||
        !Number.isSafeInteger(job.amount) ||
        job.amount < 1 ||
        !Number.isSafeInteger(job.actual) ||
        job.actual < 0 ||
        job.actual > job.amount
      )
        throw unavailable();
      try {
        // Expired reservations belong to an expired accounting window.
        const exists = await this.command(["EXISTS", job.requestKey]);
        if (exists !== 0 && exists !== 1) throw unavailable();
        if (exists === 1) await this.settle(job, job.actual);
        await this.command(["ZREM", queue, encoded]);
        report.settled++;
      } catch {
        const status = await this.command([
          "EVAL",
          RETRY_FAILURE_SCRIPT,
          3,
          job.requestKey,
          queue,
          `${prefix}:settlement-dead-letters`,
          encoded,
          this.clock(),
        ]);
        if (status === -1) report.deadLettered++;
        else if (Number.isSafeInteger(status) && status >= 0 && status < 5)
          report.failed++;
        else throw unavailable();
      }
    }
    return report;
  }
  async settle(reservation, actual) {
    if (
      !Number.isSafeInteger(actual) ||
      actual < 0 ||
      actual > reservation.amount
    )
      throw unavailable();
    const result = await this.command([
      "EVAL",
      SETTLE_SCRIPT,
      2,
      reservation.monthKey,
      reservation.requestKey,
      actual,
    ]);
    if (result !== 0 && result !== 1) throw unavailable();
  }
}
