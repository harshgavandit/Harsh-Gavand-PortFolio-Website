export type TraceMode = "success" | "timeout";
export const traceStages = [
  "Auth & Admission",
  "Credit Lock",
  "Model Stream",
  "Settlement",
];
export function traceStage(mode: TraceMode, index: number) {
  const success = [
    { message: "Rate-limit & quota pre-check passed", timing: "11ms" },
    { message: "Reserved 140 tokens in state store", timing: "18ms" },
    { message: "Gemini generation completed", timing: "580ms" },
    { message: "Settled 112 actual tokens; refunded 28 tokens", timing: "9ms" },
  ];
  if (mode === "timeout" && index === 2)
    return {
      message: "Upstream timeout · generation incomplete",
      timing: "580ms",
      failed: true,
    };
  if (mode === "timeout" && index === 3)
    return {
      message: "Rollback: 140 tokens restored to user balance",
      timing: "6ms",
      failed: false,
    };
  return { ...success[index], failed: false };
}
