const approvedEvaluationCapMicros = 100_000;

export function evaluationBudgetCap(configuredBudgetMicros) {
  if (!Number.isSafeInteger(configuredBudgetMicros) || configuredBudgetMicros < 1)
    throw new Error("Invalid evaluation quota configuration.");
  return Math.min(configuredBudgetMicros, approvedEvaluationCapMicros);
}

export function shouldStopEvaluation(result) {
  return result?.output?.code === "configuration";
}
