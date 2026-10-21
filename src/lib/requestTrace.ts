export type TraceMode = "success" | "rollback" | "timeout";

// This describes source control flow, not production timings or usage metrics.
export const traceStages = [
  "Request Admission",
  "Allowance Reservation",
  "Provider Request",
  "Settlement",
];
export const traceScenarios: {
  mode: TraceMode;
  label: string;
  status: string;
}[] = [
  {
    mode: "success",
    label: "Completed Request",
    status:
      "Known provider usage is settled once and unused cost allowance is released. The admitted daily request remains counted.",
  },
  {
    mode: "rollback",
    label: "Pre-Dispatch Cancellation",
    status:
      "The provider was not called. The full reserved cost allowance is released; the admitted daily request remains counted.",
  },
  {
    mode: "timeout",
    label: "Unknown Provider Usage",
    status:
      "After dispatch, unknown provider usage retains its reservation. Only settlement failures with known usage enter the idempotent retry queue.",
  },
];
export function traceStage(mode: TraceMode, index: number) {
  const completed = [
    { message: "Request validation and rate limits checked" },
    { message: "Daily request counted and estimated cost reserved atomically" },
    { message: "Provider request completed with cancellation signal attached" },
    { message: "Known usage settled once; unused cost allowance released" },
  ];
  if (mode === "rollback" && index === 2)
    return {
      title: "Cancellation Before Dispatch",
      message: "Cancellation detected before the provider call",
      failed: true,
    };
  if (mode === "rollback" && index === 3)
    return {
      title: "Reservation Release",
      message:
        "Full reserved cost released through idempotent zero-cost settlement",
      failed: false,
    };
  if (mode === "timeout" && index === 2)
    return {
      title: "Provider Request",
      message: "Request failed after dispatch without confirmed provider usage",
      failed: true,
    };
  if (mode === "timeout" && index === 3)
    return {
      title: "Conservative Accounting",
      message:
        "Usage remains unknown; the estimated cost reservation stays held",
      failed: false,
    };
  return { ...completed[index], title: traceStages[index], failed: false };
}
