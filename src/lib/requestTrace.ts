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
    label: "Pre-Dispatch Abort (29ms)",
    status:
      "Aborted pre-dispatch: 0 tokens billed, 140 reserved tokens restored immediately.",
  },
  {
    mode: "timeout",
    label: "Upstream Timeout & Recovery (1,240ms)",
    status:
      "Upstream error caught: usage is unknown; the reservation remains held. Known-usage settlement failures enter the idempotent retry worker.",
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
      title: "Abort Signal",
      message: "Client disconnected before provider dispatch",
      timing: "0ms",
      failed: true,
    };
  if (mode === "rollback" && index === 3)
    return {
      title: "Instant Rollback",
      message: "Released full 140-token reservation atomically",
      timing: "0ms",
      failed: false,
    };
  if (mode === "timeout" && index < 2)
    return {
      ...success[index],
      title: traceStages[index],
      timing: index === 0 ? "12ms" : "19ms",
      failed: false,
    };
  if (mode === "timeout" && index === 2)
    return {
      title: "Provider Dispatch",
      message: "Upstream timeout after stream initiation",
      timing: "1,200ms",
      failed: true,
    };
  if (mode === "timeout" && index === 3)
    return {
      message: "Unknown usage · reservation retained for reconciliation",
      title: "Reconciliation Guard",
      timing: "9ms",
      failed: false,
    };
  return { ...success[index], title: traceStages[index], failed: false };
}
