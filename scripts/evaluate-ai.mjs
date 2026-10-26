import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { aiEvalCases, gradeCase } from "./ai-eval-cases.mjs";
import { runtimeDigest } from "./ai-runtime-digest.mjs";
import { loadConfig } from "../server/config.mjs";
import { createServer } from "../server/app.mjs";
import { retrieveCode, sourceSnapshot } from "../server/grounding.mjs";
import { RedisQuota } from "../server/quota.mjs";
import { randomUUID } from "node:crypto";
import { buildRequest } from "../server/openai.mjs";
import { buildTask } from "../server/ai-tools.mjs";
import { EvaluationBudget } from "./evaluation-budget.mjs";

if (!process.argv.includes("--live"))
  throw new Error(
    "Use --live for an explicitly paid evaluation with synthetic public inputs.",
  );
const remote = process.argv.find((arg) => arg.startsWith("--url="))?.slice(6);
const repeats = remote
  ? 1
  : Number(
      process.argv.find((arg) => arg.startsWith("--repeat="))?.slice(9) || 2,
    );
if (!Number.isInteger(repeats) || repeats < 1 || repeats > 3)
  throw new Error("Use one to three explicit benchmark repetitions.");
if (remote && remote !== "https://harshgavand.dev")
  throw new Error(
    "Remote smoke checks are restricted to the canonical portfolio.",
  );
const evaluatedRevision = await runtimeDigest();
const cases = remote
  ? [aiEvalCases[0], aiEvalCases[6], aiEvalCases[8]]
  : aiEvalCases;
const budgetPath = process.argv
  .find((arg) => arg.startsWith("--request-budget-file="))
  ?.slice("--request-budget-file=".length);
if (!budgetPath)
  throw new Error(
    "Explicit paid evaluations require a new --request-budget-file=PATH.",
  );
for (const item of cases) {
  const request =
    item.kind === "guide"
      ? buildRequest([{ role: "user", content: item.text }], "gpt-6-luna")
      : buildTask(item.kind, { text: item.text }, "gpt-6-luna").request;
  assert.equal(
    request.max_output_tokens,
    1000,
    "Request exceeds the approved output cap.",
  );
}
const budget = await EvaluationBudget.create(budgetPath, {
  maxAttempts: cases.length * repeats,
  maxOutputTokens: 1000,
  runtimeDigest: evaluatedRevision,
  sourceSnapshot: sourceSnapshot.digest,
});
// Preserve previous published measurements before any new request. Their
// timestamps, source fingerprints, successes and failures must never be rebound.
const archiveDirectory = new URL(
  "../verification/release-evaluations/",
  import.meta.url,
);
await mkdir(archiveDirectory, { recursive: true });
const priorReport = await readFile(
  new URL("../src/data/aiQuality.json", import.meta.url),
  "utf8",
);
const prior = JSON.parse(priorReport);
const priorArchive = new URL(
  `${prior.evaluatedAt.replace(/[:.]/g, "-")}-${prior.runtimeDigest.slice(0, 12)}.json`,
  archiveDirectory,
);
try {
  await writeFile(priorArchive, priorReport, { flag: "wx" });
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  assert.equal(
    await readFile(priorArchive, "utf8"),
    priorReport,
    "Historical evaluation archive changed.",
  );
}
let server;
let origin = remote;
if (!origin) {
  const config = loadConfig();
  // Keep the explicitly paid fixed dataset separate from visitors' allowance.
  // Every run still uses atomic reservations, settlement, and a bounded budget.
  server = createServer({
    ...config,
    quota: new RedisQuota({
      url: config.quotaUrl,
      token: config.quotaToken,
      namespace: `portfolio-ai:eval:${randomUUID()}`,
      dailyLimit: aiEvalCases.length * repeats + 5,
      monthlyBudgetMicros: Math.min(config.monthlyBudgetMicros, 100000),
    }),
    clientLimit: aiEvalCases.length * repeats + 5,
    globalLimit: aiEvalCases.length * repeats + 5,
    // Repetitions measure fresh provider output, never a previous sample answer.
    guideCache: { get: async () => null, put: async () => {} },
    metrics: { record: async () => {} },
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
}
const results = [];
try {
  for (let repetition = 1; repetition <= repeats; repetition++)
    for (const item of cases) {
      const path = item.kind === "guide" ? "/api/chat" : `/api/ai/${item.kind}`;
      const body =
        item.kind === "guide"
          ? { messages: [{ role: "user", content: item.text }] }
          : { text: item.text };
      const started = performance.now();
      let response, data, grading;
      const transientAttempts = [];
      await budget.reserve({ id: item.id, repetition, maxOutputTokens: 1000 });
      {
        response = undefined;
        data = undefined;
        try {
          response = await fetch(origin + path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
            signal: AbortSignal.timeout(35000),
          });
          data = await response.json();
          grading = response.ok
            ? gradeCase(item, data)
            : {
                passed: false,
                checks: [
                  {
                    name: `HTTP ${response.status} (${data.code || "unavailable"})`,
                    passed: false,
                  },
                ],
              };
        } catch {
          grading = {
            passed: false,
            checks: [
              { name: "request completed within time budget", passed: false },
            ],
          };
        }
      }
      const result = {
        id: item.id,
        kind: item.kind,
        repetition,
        passed: grading.passed,
        checks: grading.checks
          .filter((check) => check.passed)
          .map((check) => check.name),
        failedChecks: grading.checks
          .filter((check) => !check.passed)
          .map((check) => check.name),
        elapsedMs: Math.round(performance.now() - started),
        transientAttempts,
        allowanceCostUsd: data?.execution?.allowanceCostUsd || 0,
        output: data,
      };
      results.push(result);
      console.log(
        `${result.passed ? "PASS" : "FAIL"} ${result.id}${result.failedChecks.length ? ": " + result.failedChecks.join(", ") : ""}`,
      );
    }
} finally {
  if (server) {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
const retrievalCases = aiEvalCases.filter((item) => item.source);
const retrievalPassed = retrievalCases.filter((item) =>
  retrieveCode(item.text).some((source) => source.slug === item.source),
).length;
const latencies = results
  .map((result) => result.elapsedMs)
  .sort((a, b) => a - b);
const report = {
  status: "completed",
  model: "gpt-6-luna",
  evaluatedAt: new Date().toISOString(),
  sourceSnapshot: sourceSnapshot.digest,
  runtimeDigest: evaluatedRevision,
  environment: remote ? "production-http-smoke" : "local-http-real-provider",
  requestAllowance: {
    maxAttempts: cases.length * repeats,
    maxOutputTokens: 1000,
    reservedAttempts: results.length,
    automaticRetries: false,
    isolatedQuotaBudgetCapUsd: remote ? null : 0.1,
  },
  dataset: {
    uniqueCases: cases.length,
    repetitions: repeats,
    labelSource:
      "Source-derived expectations and synthetic fixtures; not independently human-labelled",
    graderVersion: 3,
  },
  cases: results.map(({ output: _output, ...result }) => result),
  retrieval: { passed: retrievalPassed, total: retrievalCases.length },
  summary: {
    passed: results.filter((result) => result.passed).length,
    total: results.length,
    transientRetries: results.reduce(
      (sum, result) => sum + result.transientAttempts.length,
      0,
    ),
    medianLatencyMs: latencies[Math.floor(latencies.length / 2)],
    p95LatencyMs:
      latencies[
        Math.min(latencies.length - 1, Math.ceil(latencies.length * 0.95) - 1)
      ],
    inputTokens: results.reduce(
      (sum, row) => sum + (row.output?.execution?.inputTokens || 0),
      0,
    ),
    outputTokens: results.reduce(
      (sum, row) => sum + (row.output?.execution?.outputTokens || 0),
      0,
    ),
    allowanceCostUsd:
      Math.round(
        results.reduce((sum, result) => sum + result.allowanceCostUsd, 0) *
          1000000,
      ) / 1000000,
  },
  classification: {
    matrix: Object.fromEntries(
      ["billing", "access", "bug", "feature", "other"].map((expected) => [
        expected,
        Object.fromEntries(
          ["billing", "access", "bug", "feature", "other"].map((actual) => [
            actual,
            results.filter(
              (row) =>
                cases.find((item) => item.id === row.id)?.category ===
                  expected && row.output?.category === actual,
            ).length,
          ]),
        ),
      ]),
    ),
  },
};
assert.equal(
  await runtimeDigest(),
  evaluatedRevision,
  "AI runtime changed during evaluation; rerun against a stable revision.",
);
await mkdir(new URL("../tmp/ai-evaluation/", import.meta.url), {
  recursive: true,
});
await writeFile(
  new URL(
    `../tmp/ai-evaluation/${remote ? "production" : "local"}-${report.evaluatedAt.replace(/[:.]/g, "-")}-outputs.json`,
    import.meta.url,
  ),
  JSON.stringify(results, null, 2) + "\n",
);
if (!remote) {
  await writeFile(
    new URL("../src/data/aiQuality.json", import.meta.url),
    JSON.stringify(report, null, 2) + "\n",
  );
  await writeFile(
    new URL(
      `${report.evaluatedAt.replace(/[:.]/g, "-")}-${report.runtimeDigest.slice(0, 12)}.json`,
      archiveDirectory,
    ),
    JSON.stringify(report, null, 2) + "\n",
  );
}
console.log(
  JSON.stringify(
    {
      environment: report.environment,
      ...report.summary,
      retrieval: report.retrieval,
      runtimeDigest: report.runtimeDigest.slice(0, 12),
    },
    null,
    2,
  ),
);
assert.equal(
  report.summary.passed,
  report.summary.total,
  "Inspect failed evaluation cases; do not publish a fabricated success rate.",
);
