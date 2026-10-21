import assert from "node:assert/strict";
import { test } from "node:test";
import { PublicGuideCache, AIMetrics } from "../server/ai-operations.mjs";
import { retrieveCode } from "../server/grounding.mjs";
import { buildTask, normalizeTask } from "../server/ai-tools.mjs";
import {
  factualContradictions,
  capabilityKeys,
} from "../server/evidence-policy.mjs";
import { aiEvalCases, gradeCase } from "./ai-eval-cases.mjs";
import { createServer } from "../server/app.mjs";
import { generateReply, buildRequest } from "../server/openai.mjs";

const publicMessages = [
  {
    role: "user",
    content:
      "Where does the portfolio release a quota reservation when a client aborts?",
  },
];
test("valid but unrelated citations cannot substantiate Kafka, Java, or Rust", () => {
  for (const technology of ["Kafka", "Java", "Rust"]) {
    const task = buildTask(
      "recruiter",
      { text: `We need production ${technology} experience.` },
      "gpt-6-luna",
    );
    const result = normalizeTask(task, {
      summary: "Synthetic invalid model claim.",
      requirements: [
        {
          requirement: `Production ${technology} experience`,
          assessment: "supported",
          explanation: "Invalid evidence.",
          evidenceIds: ["experience-0"],
        },
      ],
    });
    assert.equal(result.requirements[0].assessment, "not_shown");
    assert.deepEqual(result.requirements[0].evidence, []);
  }
  assert.ok(!capabilityKeys("JavaScript").includes("java"));
});
test("duration and production-operation claims stay partial even when the technology is shown", () => {
  for (const requirement of [
    "Seven years of Node.js engineering",
    "Production Python operations",
  ]) {
    const task = buildTask("recruiter", { text: requirement }, "gpt-6-luna");
    const result = normalizeTask(task, {
      summary: "Related evidence.",
      requirements: [
        {
          requirement,
          assessment: "supported",
          explanation: "Related work.",
          evidenceIds: [
            requirement.includes("Node") ? "experience-1" : "experience-0",
          ],
        },
      ],
    });
    assert.equal(result.requirements[0].assessment, "partial");
  }
});
test("an employment stack tag alone cannot establish a delivered Kubernetes workflow", () => {
  const task = buildTask(
    "recruiter",
    { text: "Kubernetes development experience is required." },
    "gpt-6-luna",
  );
  const result = normalizeTask(task, {
    summary: "Related technology tag.",
    requirements: [
      {
        requirement: "Kubernetes development",
        assessment: "supported",
        explanation: "Listed technology.",
        evidenceIds: ["experience-1"],
      },
    ],
  });
  assert.equal(result.requirements[0].assessment, "partial");
});
test("the contradictory refund claim from the audit fails the grader and runtime output guard", async () => {
  const answer =
    "When a client aborts, this implementation always refunds every dispatched request and guarantees that provider usage is zero.";
  const item = aiEvalCases[0];
  assert.ok(factualContradictions(answer, item.text).length);
  assert.equal(
    gradeCase(item, {
      answer,
      execution: { elapsedMs: 1, model: "gpt-6-luna" },
      evidence: retrieveCode(item.text),
    }).passed,
    false,
  );
  await assert.rejects(
    generateReply(publicMessages, {
      apiKey: "synthetic",
      model: "gpt-6-luna",
      fetchImpl: async () =>
        Response.json({
          status: "completed",
          output: [
            {
              type: "message",
              role: "assistant",
              content: [
                {
                  type: "output_text",
                  text: JSON.stringify({
                    answer,
                    projectIds: [],
                    sections: [],
                    evidenceIds: [],
                  }),
                },
              ],
            },
          ],
        }),
    }),
    (error) => error.code === "unsupported_claim",
  );
  assert.deepEqual(
    factualContradictions(
      "Before dispatch, reservations are released. After dispatch, unknown usage is retained conservatively.",
      item.text,
    ),
    [],
  );
});
test("a source link alone cannot make an irrelevant guide answer pass", () => {
  const item = aiEvalCases[0];
  assert.equal(
    gradeCase(item, {
      answer:
        "The application cancels requests and has excellent software architecture.",
      execution: { elapsedMs: 1, model: "gpt-6-luna" },
      evidence: retrieveCode(item.text),
    }).passed,
    false,
  );
});
test("admission retrieval includes the atomic enforcement, not only constructor defaults", () => {
  const item = aiEvalCases.find((item) => item.id === "guide-auth-admission");
  const evidence = retrieveCode(item.text);
  assert.ok(
    evidence.some(
      (chunk) =>
        chunk.path === "server/admission.mjs" &&
        /ADMIT_SCRIPT[\s\S]*redis\.call/.test(chunk.text),
    ),
  );
  assert.ok(
    evidence.some(
      (chunk) =>
        chunk.path === "server/admission.mjs" && /"EVAL"/.test(chunk.text),
    ),
  );
});

test("banking guide grading requires validation rules and separate confirmation without requiring demo labels", () => {
  const item = aiEvalCases.find((row) => row.id === "guide-harness-policy");
  const result = {
    execution: { elapsedMs: 1, model: "gpt-6-luna" },
    evidence: retrieveCode(item.text),
  };
  assert.equal(
    gradeCase(item, {
      ...result,
      answer:
        "Python validates beneficiaries, amounts, balances, and daily limits. A staged transfer needs explicit confirmation in a later turn before the isolated ledger changes.",
    }).passed,
    true,
  );
  assert.equal(
    gradeCase(item, {
      ...result,
      answer: "This is a mock simulation with a later confirmation step.",
    }).passed,
    false,
  );
  assert.equal(
    gradeCase(item, {
      ...result,
      answer:
        "Python checks the beneficiary, amount, and account balance before a ledger operation.",
    }).passed,
    false,
  );
});
test("unknown-fact grading accepts an explicit absence but rejects an invented salary", () => {
  const item = aiEvalCases.find((item) => item.unknown);
  const execution = { elapsedMs: 1, model: "gpt-6-luna" };
  assert.equal(
    gradeCase(item, {
      answer:
        "Harsh’s salary at GlobeTrek isn’t stated in his published profile. Please contact him directly.",
      execution,
    }).passed,
    true,
  );
  assert.equal(
    gradeCase(item, {
      answer: "Harsh received a salary of 200000 INR every month at GlobeTrek.",
      execution,
    }).passed,
    false,
  );
});
test("only public single-turn samples enter a versioned cache; stale or forged entries are misses", async () => {
  const commands = [];
  let saved;
  let now = 1000000000;
  const store = {
    configured: true,
    command: async (cmd) => {
      commands.push(cmd);
      if (cmd[0] === "SET") {
        saved = cmd[2];
        return "OK";
      }
      return saved;
    },
  };
  const cache = new PublicGuideCache({ store, clock: () => now });
  assert.equal(
    cache.key([
      { role: "user", content: "Private ticket for ada@example.com" },
    ]),
    null,
  );
  assert.equal(
    cache.key([
      ...publicMessages,
      { role: "assistant", content: "answer" },
      { role: "user", content: "followup" },
    ]),
    null,
  );
  const result = {
    answer:
      "Before dispatch the reservation is released; after dispatch unknown usage is retained.",
    projectIds: [],
    sections: [],
    evidence: retrieveCode(publicMessages),
  };
  await cache.put(publicMessages, result);
  assert.equal((await cache.get(publicMessages)).answer, result.answer);
  assert.ok(!commands[0][1].includes("client aborts"));
  assert.equal(commands[0].at(-1), 21600);
  const original = saved;
  saved = JSON.stringify({ ...JSON.parse(saved), evidenceIds: ["forged"] });
  assert.equal(await cache.get(publicMessages), null);
  saved = original;
  now += 21600001;
  assert.equal(await cache.get(publicMessages), null);
  assert.equal(
    await new PublicGuideCache({
      store: {
        configured: true,
        command: async () => {
          throw new Error("offline");
        },
      },
    }).get(publicMessages),
    null,
  );
});
test("aggregate metrics include success and failure counts without request content or identity", async () => {
  const calls = [];
  const store = {
    configured: true,
    command: async (cmd) => {
      calls.push(cmd);
      return 1;
    },
  };
  const metrics = new AIMetrics({ store, clock: () => Date.UTC(2026, 9, 17) });
  await metrics.record({
    kind: "triage",
    status: 504,
    elapsedMs: 2700,
    providerCall: true,
    allowanceMicros: 12,
    inputTokens: 20,
    outputTokens: 3,
    text: "private-ticket",
    ip: "203.0.113.1",
  });
  assert.ok(!JSON.stringify(calls).includes("private-ticket"));
  assert.ok(!JSON.stringify(calls).includes("203.0.113.1"));
  assert.ok(calls[0].includes("failures"));
  assert.ok(calls[0].includes(5000));
  assert.ok(calls[0].includes(504));
});
test("aggregate snapshots compute histogram bounds and expose no raw records", async () => {
  const store = {
    configured: true,
    command: async (cmd) => {
      const count = cmd[2],
        fields = cmd.slice(3 + count);
      return Array.from({ length: count }, (_, i) =>
        fields.map((field) =>
          i
            ? "0"
            : String(
                {
                  total: 3,
                  successes: 2,
                  failures: 1,
                  cacheHits: 1,
                  providerCalls: 2,
                  "latency:1000": 1,
                  "latency:5000": 1,
                  allowanceMicros: 33,
                }[field] || 0,
              ),
        ),
      ).flat();
    },
  };
  const result = await new AIMetrics({ store }).snapshot();
  assert.equal(result.requests, 3);
  assert.equal(result.uncachedP95UpperMs, 5000);
  assert.equal(result.allowanceCostUsd, 0.000033);
  assert.ok(!("records" in result));
});
test("cached HTTP answers still require admission and do not dispatch or reserve a provider call", async (t) => {
  const events = [];
  const records = [];
  const server = createServer({
    apiKey: "synthetic",
    model: "gpt-6-luna",
    allowedOrigins: ["https://harshgavand.dev"],
    quota: {
      configured: true,
      reserve: async () => {
        throw new Error("Must not reserve");
      },
    },
    admission: {
      acquire: async () => {
        events.push("admit");
        return {};
      },
      release: async () => events.push("release"),
    },
    guideCache: {
      get: async () => ({
        answer: "A versioned answer.",
        projectIds: [],
        sections: [],
        evidence: [],
      }),
    },
    metrics: {
      record: async (event) => records.push(event),
      snapshot: async () => ({ requests: records.length }),
    },
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(
    () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(resolve);
      }),
  );
  const url = `http://127.0.0.1:${server.address().port}`;
  const response = await fetch(url + "/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: publicMessages }),
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).execution.cache, "hit");
  await new Promise((resolve) => setImmediate(resolve));
  assert.deepEqual(events, ["admit", "release"]);
  assert.equal(records[0].providerCall, false);
  assert.equal(records[0].cacheHit, true);
  const invalid = await fetch(url + "/api/ai/triage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });
  assert.equal(invalid.status, 400);
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(records.at(-1).status, 400);
  const metrics = await fetch(url + "/api/ai/metrics");
  assert.equal(metrics.status, 200);
  assert.equal((await metrics.json()).requests, 2);
});
test("model context is selected and excludes the full project catalogue", () => {
  const request = buildRequest(publicMessages);
  assert.ok(request.instructions.length < 50000);
  assert.ok(!request.instructions.includes('"projectIndex"'));
});
