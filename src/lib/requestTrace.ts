export type TraceMode = "success" | "rollback" | "timeout";
export const traceStages = [
  "Auth & Admission",
  "Credit Lock",
  "Model Stream",
  "Settlement",
];
export const traceScenarios: {
  mode: TraceMode;
  label: string;
  status: string;
}[] = [
  {
    mode: "success",
    label: "Happy Path (618ms)",
    status:
      "Trace complete: 112 tokens billed, 28 unused tokens released (618ms total).",
  },
  {
    mode: "rollback",
    label: "Pre-dispatch Abort (Rollback)",
    status:
      "Failure handled: reservation released via releaseOrEnqueueRetry before dispatch — 0 provider tokens billed.",
  },
  {
    mode: "timeout",
    label: "Upstream Timeout (Retained)",
    status:
      "Timeout handled: usage is unknown; the reservation stays held for reconciliation.",
  },
];
export function traceStage(mode: TraceMode, index: number) {
  const success = [
    { message: "Rate-limit & session quota verified", timing: "11ms" },
    { message: "Reserved 140 estimated tokens in store", timing: "18ms" },
    { message: "Generation completed (signal attached)", timing: "580ms" },
    { message: "Settled 112 actual tokens · refunded 28", timing: "9ms" },
  ];
  if (mode === "rollback" && index === 2)
    return {
      message: "Client aborted before provider dispatch",
      timing: "0ms (ABORT)",
      failed: true,
    };
  if (mode === "rollback" && index === 3)
    return {
      message: "Rollback executed · 140 tokens restored",
      timing: "7ms",
      failed: false,
    };
  if (mode === "timeout" && index === 2)
    return {
      message: "Provider timeout / stream aborted",
      timing: "5000ms (ERR)",
      failed: true,
    };
  if (mode === "timeout" && index === 3)
    return {
      message: "Unknown usage · reservation retained for reconciliation",
      timing: "Conservative hold",
      failed: false,
    };
  return { ...success[index], failed: false };
}
