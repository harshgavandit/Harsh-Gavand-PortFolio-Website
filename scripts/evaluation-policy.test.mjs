import assert from "node:assert/strict";
import test from "node:test";
import { evaluationBudgetCap, shouldStopEvaluation } from "./evaluation-policy.mjs";

test("evaluation quota never exceeds the documented ten-cent cap", () => {
  assert.equal(evaluationBudgetCap(4_000_000), 100_000);
  assert.equal(evaluationBudgetCap(500_000), 100_000);
  assert.equal(evaluationBudgetCap(50_000), 50_000);
});

test("a provider configuration failure stops before another paid attempt", () => {
  assert.equal(shouldStopEvaluation({ output: { code: "configuration" } }), true);
  assert.equal(shouldStopEvaluation({ output: { code: "unavailable" } }), false);
  assert.equal(shouldStopEvaluation({ output: { answer: "ok" } }), false);
});
