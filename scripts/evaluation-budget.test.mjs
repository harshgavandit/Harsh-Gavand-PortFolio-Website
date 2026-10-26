import assert from "node:assert/strict";
import { test } from "node:test";
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { EvaluationBudget } from "./evaluation-budget.mjs";

async function fixture(t, maxAttempts = 2) {
  const directory = await mkdtemp(join(tmpdir(), "portfolio-evaluation-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const path = join(directory, "allowance.jsonl");
  const limits = {
    maxAttempts,
    maxOutputTokens: 1000,
    runtimeDigest: "a".repeat(64),
    sourceSnapshot: "b".repeat(64),
  };
  return { path, limits, budget: await EvaluationBudget.create(path, limits) };
}

test("paid attempts are persisted once and failed calls cannot restore their allowance", async (t) => {
  const { path, budget } = await fixture(t);
  const row = { id: "guide-test", repetition: 1, maxOutputTokens: 1000 };
  await budget.reserve(row);
  assert.equal((await readFile(path, "utf8")).trimEnd().split("\n").length, 2);
  await assert.rejects(budget.reserve(row), /retries require/);
  await budget.reserve({ ...row, repetition: 2 });
  await assert.rejects(
    budget.reserve({ ...row, id: "guide-other" }),
    /exhausted/,
  );
});

test("an existing approval ledger cannot be reset or silently expanded", async (t) => {
  const { path, budget, limits } = await fixture(t);
  await assert.rejects(EvaluationBudget.create(path, limits), {
    code: "EEXIST",
  });
  await writeFile(
    path,
    JSON.stringify({ version: 1, ...limits, maxAttempts: 48 }) + "\n",
  );
  await assert.rejects(
    budget.reserve({ id: "guide-test", repetition: 1, maxOutputTokens: 1000 }),
    /allowance changed/,
  );
});

test("invalid limits, oversized requests, corrupt files and concurrent locks fail before requests", async (t) => {
  const { path, budget, limits } = await fixture(t);
  await assert.rejects(
    EvaluationBudget.create(path + ".invalid", { ...limits, maxAttempts: 49 }),
    /Invalid/,
  );
  await assert.rejects(
    budget.reserve({ id: "guide-test", repetition: 1, maxOutputTokens: 1001 }),
    /does not match/,
  );
  await writeFile(path + ".lock", "in progress");
  await assert.rejects(
    budget.reserve({ id: "guide-test", repetition: 1, maxOutputTokens: 1000 }),
    { code: "EEXIST" },
  );
  await rm(path + ".lock");
  await writeFile(path, '{"version":1}');
  await assert.rejects(
    budget.reserve({ id: "guide-test", repetition: 1, maxOutputTokens: 1000 }),
    /Incomplete/,
  );
});
