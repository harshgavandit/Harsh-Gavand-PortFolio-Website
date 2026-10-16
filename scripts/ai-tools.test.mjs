import assert from "node:assert/strict";
import { test } from "node:test";
import { buildTask, normalizeTask, redactInput } from "../server/ai-tools.mjs";
import { reservationFor } from "../server/quota.mjs";
import { createServer } from "../server/app.mjs";
import { ChatError } from "../server/openai.mjs";

test("recruiter task uses bounded factual context, valid source identities, and no fabricated fit score", () => {
  const task = buildTask(
    "recruiter",
    {
      text: "We need React, TypeScript, Python, PostgreSQL and Kafka experience.",
    },
    "gpt-6-luna",
  );
  assert.ok(reservationFor(task.request).amount > 0);
  assert.ok(task.sources.some((source) => source.id === "experience-0"));
  assert.match(task.request.instructions, /untrusted/i);
  assert.match(task.request.instructions, /not shown/i);
  assert.ok(!task.request.text.format.schema.properties.fitScore);
  assert.throws(
    () =>
      normalizeTask(task, {
        summary: "fit",
        requirements: [
          {
            requirement: "Kafka",
            assessment: "supported",
            explanation: "yes",
            evidenceIds: ["forged"],
          },
        ],
      }),
    /citation|evidence/i,
  );
});
test("task inputs are bounded before paid work", () => {
  for (const [kind, body] of [
    ["recruiter", {}],
    ["triage", { text: "" }],
    ["triage", { text: "x".repeat(1601) }],
    ["recruiter", { text: "x".repeat(6001) }],
    ["unknown", { text: "hello" }],
  ])
    assert.throws(() => buildTask(kind, body, "gpt-6-luna"));
});
test("ticket PII is redacted before it reaches a provider or UI result", () => {
  const text =
    "Contact ada@example.com or +1 202-555-0123. Card 4111 1111 1111 1111. password: Hunter123";
  const { text: redacted, fields } = redactInput(text);
  for (const value of ["ada@example.com", "202-555-0123", "4111", "Hunter123"])
    assert.ok(!redacted.includes(value));
  assert.ok(
    fields.includes("email") &&
      fields.includes("phone") &&
      fields.includes("payment") &&
      fields.includes("credential"),
  );
  const task = buildTask("triage", { text }, "gpt-6-luna");
  assert.ok(!JSON.stringify(task.request).includes("Hunter123"));
});
test("triage never acts on tickets and enforces human review for security issues or invalid model output", () => {
  const task = buildTask(
    "triage",
    { text: "Someone has taken over my account and changed my password." },
    "gpt-6-luna",
  );
  const result = normalizeTask(task, {
    category: "access",
    priority: "low",
    summary: "Account access issue",
    rationale: "Reset needed",
    needsReview: false,
  });
  assert.equal(result.needsReview, true);
  assert.equal(result.priority, "urgent");
  const invalid = normalizeTask(task, { category: "invented" });
  assert.equal(invalid.needsReview, true);
  assert.equal(invalid.status, "needs_review");
  assert.equal(result.actionsExecuted, 0);
});
test("recruiter unsupported rows cannot masquerade as supported experience", () => {
  const task = buildTask(
    "recruiter",
    { text: "We require Java and Kafka experience." },
    "gpt-6-luna",
  );
  const result = normalizeTask(task, {
    summary: "Some requirements are not established.",
    requirements: [
      {
        requirement: "Java",
        assessment: "supported",
        explanation: "No source supplied",
        evidenceIds: [],
      },
    ],
  });
  assert.equal(result.requirements[0].assessment, "not_shown");
});

async function httpFixture(t, overrides = {}) {
  const events = [];
  const quota = {
    configured: true,
    dailyLimit: 200,
    monthlyBudgetMicros: 1000000,
    reserve: async (amount) => {
      events.push("reserve");
      return { amount };
    },
    settle: async () => {
      events.push("settle");
    },
    releaseOrEnqueueRetry: async () => {
      events.push("recover");
    },
  };
  const server = createServer({
    apiKey: "synthetic-key",
    model: "gpt-6-luna",
    allowedOrigins: ["https://harshgavand.dev"],
    quota,
    generateTask: async (request, { signal }) => {
      events.push("provider");
      assert.ok(signal instanceof AbortSignal);
      assert.ok(!JSON.stringify(request).includes("ada@example.com"));
      return {
        category: "billing",
        priority: "normal",
        summary: "Duplicate charge",
        rationale: "Billing specialist can inspect charges.",
        needsReview: false,
        usage: { input_tokens: 100, output_tokens: 40 },
      };
    },
    ...overrides,
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(
    () =>
      new Promise((resolve) => {
        server.closeAllConnections();
        server.close(resolve);
      }),
  );
  return {
    events,
    quota,
    request: (body, options = {}) =>
      fetch(
        `http://127.0.0.1:${server.address().port}${options.path || "/api/ai/triage"}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...options.headers },
          body: JSON.stringify(body),
        },
      ),
  };
}
test("live task route redacts before dispatch, reserves before generation, and returns actual execution metadata", async (t) => {
  const { request, events } = await httpFixture(t);
  const response = await request({
    text: "I was charged twice. Contact ada@example.com.",
  });
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.deepEqual(events, ["reserve", "provider", "settle"]);
  assert.equal(result.execution.inputTokens, 100);
  assert.ok(
    result.execution.elapsedMs >= 0 && result.execution.allowanceCostUsd > 0,
  );
  assert.match(result.execution.requestId, /^[\da-f-]{36}$/);
  assert.ok(result.redactedFields.includes("email"));
  assert.equal(result.actionsExecuted, 0);
});
test("invalid inputs, foreign origins and exhausted shared budgets make no task provider calls", async (t) => {
  const { request, events, quota } = await httpFixture(t);
  assert.equal((await request({ text: "" })).status, 400);
  assert.equal(
    (
      await request(
        { text: "I need help with billing." },
        { headers: { Origin: "https://evil.example" } },
      )
    ).status,
    403,
  );
  assert.equal(events.length, 0);
  quota.reserve = async () => {
    throw new ChatError(429, "monthly_budget", "Usage allowance reached.");
  };
  assert.equal(
    (await request({ text: "I need help with billing." })).status,
    429,
  );
  assert.equal(events.length, 0);
});
test("malformed role comparisons fail safely and never publish invented source URLs", async (t) => {
  const { request, events } = await httpFixture(t, {
    generateTask: async () => ({
      summary: "match",
      requirements: [
        {
          requirement: "Kafka",
          assessment: "supported",
          explanation: "yes",
          evidenceIds: ["https://evil.example"],
        },
      ],
    }),
  });
  const response = await request(
    { text: "We require Kafka expertise." },
    { path: "/api/ai/recruiter" },
  );
  assert.equal(response.status, 502);
  assert.ok(!(await response.text()).includes("https://evil.example"));
  assert.deepEqual(events, ["reserve", "recover"]);
});
