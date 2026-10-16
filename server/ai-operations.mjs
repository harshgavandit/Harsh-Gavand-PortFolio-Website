import { createHash } from "node:crypto";
import { AI_PROMPT_VERSION, buildRequest } from "./openai.mjs";
import { codeEvidence, sourceSnapshot } from "./grounding.mjs";
import { factualContradictions } from "./evidence-policy.mjs";

const publicQuestions = new Set(
  [
    "Where does the portfolio release a quota reservation when a client aborts?",
    "How does UGC refund credits when generation fails?",
    "How does the banking agent harness require later-turn confirmation?",
    "How does the RAG project combine BM25 and vector search?",
  ].map((value) => value.toLowerCase()),
);
const normalizedQuestion = (messages) =>
  messages?.length === 1 && messages[0].role === "user"
    ? messages[0].content.trim().replace(/\s+/g, " ").toLowerCase()
    : "";
const ttl = 21600;
const namespace = "{portfolio-ai-operations:v1}";
const bounds = [250, 500, 1000, 2500, 5000, 10000, 30000, 60000];

export class PublicGuideCache {
  constructor({ store, clock = Date.now }) {
    this.store = store;
    this.clock = clock;
  }
  key(messages) {
    const question = normalizedQuestion(messages);
    if (!publicQuestions.has(question)) return null;
    return (
      namespace +
      ":cache:" +
      createHash("sha256")
        .update(
          AI_PROMPT_VERSION +
            sourceSnapshot.digest +
            JSON.stringify(buildRequest(messages)) +
            question,
        )
        .digest("hex")
    );
  }
  async get(messages) {
    const key = this.key(messages);
    if (!key || !this.store.configured || !this.store.command) return null;
    try {
      const raw = await this.store.command(["GET", key]);
      if (typeof raw !== "string" || raw.length > 26000) return null;
      const value = JSON.parse(raw);
      if (
        typeof value.answer !== "string" ||
        !value.answer.trim() ||
        value.answer.length > 4000 ||
        !Number.isFinite(value.createdAt) ||
        this.clock() - value.createdAt > ttl * 1000 ||
        value.createdAt > this.clock() ||
        value.version !== AI_PROMPT_VERSION ||
        value.snapshot !== sourceSnapshot.digest ||
        !Array.isArray(value.projectIds) ||
        !Array.isArray(value.sections) ||
        factualContradictions(value.answer, normalizedQuestion(messages)).length
      )
        return null;
      const evidence = codeEvidence(value.evidenceIds, messages);
      if (
        !Array.isArray(value.evidenceIds) ||
        value.evidenceIds.length > 4 ||
        !evidence.length ||
        evidence.length !== new Set(value.evidenceIds).size
      )
        return null;
      return {
        answer: value.answer,
        projectIds: value.projectIds,
        sections: value.sections,
        evidence,
        cacheCreatedAt: new Date(value.createdAt).toISOString(),
      };
    } catch {
      return null;
    } // Cache failure must not prevent the bounded live request.
  }
  async put(messages, result) {
    const key = this.key(messages);
    if (
      !key ||
      !this.store.configured ||
      !this.store.command ||
      !result.evidence?.length
    )
      return;
    const value = JSON.stringify({
      answer: result.answer,
      projectIds: result.projectIds,
      sections: result.sections,
      evidenceIds: result.evidence.map((item) => item.id),
      createdAt: this.clock(),
      version: AI_PROMPT_VERSION,
      snapshot: sourceSnapshot.digest,
    });
    if (value.length > 26000) return;
    try {
      await this.store.command(["SET", key, value, "EX", ttl]);
    } catch {
      /* A miss costs one admitted provider request; it never bypasses quota. */
    }
  }
}

export const RECORD_AI_METRIC = `
local key = KEYS[1]
redis.call('HINCRBY', key, 'total', 1)
redis.call('HINCRBY', key, ARGV[1], 1)
redis.call('HINCRBY', key, 'kind:' .. ARGV[2], 1)
redis.call('HINCRBY', key, 'cacheHits', ARGV[3])
redis.call('HINCRBY', key, 'inputTokens', ARGV[4])
redis.call('HINCRBY', key, 'outputTokens', ARGV[5])
redis.call('HINCRBY', key, 'allowanceMicros', ARGV[6])
redis.call('HINCRBY', key, 'providerCalls', ARGV[7])
if ARGV[7] == '1' then redis.call('HINCRBY', key, 'latency:' .. ARGV[8], 1) end
redis.call('HINCRBY', key, 'status:' .. ARGV[9], 1)
redis.call('EXPIRE', key, 2678400)
return 1
`;
export class AIMetrics {
  constructor({ store, clock = Date.now }) {
    this.store = store;
    this.clock = clock;
  }
  get configured() {
    return Boolean(this.store.configured && this.store.command);
  }
  async record(event) {
    if (!this.configured) return;
    const integer = (value) =>
      Number.isSafeInteger(value) && value >= 0 ? value : 0;
    const day = new Date(this.clock()).toISOString().slice(0, 10);
    const kind = ["guide", "voice", "recruiter", "triage"].includes(event.kind)
      ? event.kind
      : "guide";
    const status = [
      200, 400, 401, 403, 404, 405, 413, 415, 429, 499, 500, 502, 503, 504,
    ].includes(event.status)
      ? event.status
      : 500;
    const bucket = bounds.find((bound) => event.elapsedMs <= bound) || 60000;
    try {
      await this.store.command([
        "EVAL",
        RECORD_AI_METRIC,
        1,
        namespace + ":day:" + day,
        status === 200 ? "successes" : "failures",
        kind,
        event.cacheHit ? 1 : 0,
        integer(event.inputTokens),
        integer(event.outputTokens),
        integer(event.allowanceMicros),
        event.providerCall ? 1 : 0,
        bucket,
        status,
      ]);
    } catch {
      console.error(JSON.stringify({ event: "ai_metrics_unavailable" }));
    }
  }
  async snapshot() {
    if (!this.configured) return null;
    const days = Array.from({ length: 7 }, (_, i) =>
      new Date(this.clock() - i * 86400000).toISOString().slice(0, 10),
    );
    const fields = [
      "total",
      "successes",
      "failures",
      "cacheHits",
      "providerCalls",
      "inputTokens",
      "outputTokens",
      "allowanceMicros",
      ...bounds.map((value) => "latency:" + value),
      ...["guide", "voice", "recruiter", "triage"].map(
        (kind) => "kind:" + kind,
      ),
    ];
    const script = `local result = {} for _,key in ipairs(KEYS) do local row = redis.call('HMGET', key, unpack(ARGV)) for _,value in ipairs(row) do table.insert(result, value or '0') end end return result`;
    const raw = await this.store.command([
      "EVAL",
      script,
      days.length,
      ...days.map((day) => namespace + ":day:" + day),
      ...fields,
    ]);
    if (
      !Array.isArray(raw) ||
      raw.length !== days.length * fields.length ||
      raw.some(
        (value) =>
          !/^\d+$/.test(String(value)) || !Number.isSafeInteger(Number(value)),
      )
    )
      throw new Error("Invalid aggregate metrics");
    const totals = Object.fromEntries(fields.map((field) => [field, 0]));
    raw.forEach((value, i) => {
      totals[fields[i % fields.length]] += Number(value);
    });
    if (
      Object.values(totals).some((value) => !Number.isSafeInteger(value)) ||
      totals.total !== totals.successes + totals.failures ||
      totals.cacheHits > totals.total ||
      totals.providerCalls > totals.total
    )
      throw new Error("Inconsistent aggregate counters");
    const cutoff = Math.ceil(totals.providerCalls * 0.95);
    let cumulative = 0;
    const p95UpperMs = totals.providerCalls
      ? bounds.find((bound) => {
          cumulative += totals["latency:" + bound];
          return cumulative >= cutoff;
        }) || 60000
      : null;
    return {
      window: "7 UTC calendar days",
      from: days.at(-1),
      through: days[0],
      updatedAt: new Date(this.clock()).toISOString(),
      requests: totals.total,
      successes: totals.successes,
      failures: totals.failures,
      cacheHits: totals.cacheHits,
      providerCalls: totals.providerCalls,
      inputTokens: totals.inputTokens,
      outputTokens: totals.outputTokens,
      allowanceCostUsd: totals.allowanceMicros / 1000000,
      uncachedP95UpperMs: p95UpperMs,
      byTool: Object.fromEntries(
        ["guide", "voice", "recruiter", "triage"].map((kind) => [
          kind,
          totals["kind:" + kind],
        ]),
      ),
      note: "Anonymous aggregate counters only. Latency is a histogram upper bound for requests that dispatched providers, including failures. Collection began with this release; small samples are not an uptime guarantee.",
    };
  }
}
