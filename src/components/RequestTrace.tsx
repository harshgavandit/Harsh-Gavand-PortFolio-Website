import { useState } from "react";
import { Check, TriangleAlert } from "lucide-react";
import {
  traceStage,
  traceStages,
  traceScenarios,
  type TraceMode,
} from "../lib/requestTrace";

export function RequestTrace() {
  const [mode, setMode] = useState<TraceMode>("success");
  const scenario = traceScenarios.find((item) => item.mode === mode)!;
  return (
    <div className="request-trace">
      <div className="trace-top">
        <span className="eyebrow">Request Lifecycle Trace</span>
        <span className="trace-source">quota-lifecycle.mjs</span>
      </div>
      <div
        className="trace-scenarios"
        role="group"
        aria-label="Request lifecycle scenario"
      >
        {traceScenarios.map((item) => (
          <button
            type="button"
            key={item.mode}
            aria-pressed={mode === item.mode}
            onClick={() => setMode(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ol className="trace-stages" aria-label={scenario.label}>
        {traceStages.map((stage, index) => {
          const detail = traceStage(mode, index);
          return (
            <li key={stage} data-state={detail.failed ? "failed" : "done"}>
              <div className="trace-stage-label">
                <span>
                  0{index + 1} / {detail.title}
                </span>
                {detail.failed ? (
                  <TriangleAlert size={14} aria-hidden="true" />
                ) : (
                  <Check size={14} aria-hidden="true" />
                )}
              </div>
              <p>{detail.message}</p>
              <span className="trace-time">{detail.timing}</span>
            </li>
          );
        })}
      </ol>
      <p
        className="trace-status"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {scenario.status}
      </p>
      <p className="trace-disclosure">
        Deterministic state-machine trace with illustrative token values:
        completion settles actual usage, pre-dispatch failures roll back, and
        uncertain upstream usage remains reserved. Known-usage settlement
        failures use durable retries with dead-letter handling.
      </p>
    </div>
  );
}
