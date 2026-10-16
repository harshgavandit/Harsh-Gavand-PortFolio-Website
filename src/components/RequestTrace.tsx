import { useEffect, useRef, useState } from "react";
import { Check, Circle, LoaderCircle, Play, TriangleAlert } from "lucide-react";
import { useMotionEnabled } from "./MotionPreferences";
import { startTraceReplay } from "../lib/traceReplay";
import {
  traceStage,
  traceStages,
  traceScenarios,
  type TraceMode,
} from "../lib/requestTrace";

export function RequestTrace() {
  const [mode, setMode] = useState<TraceMode>("success");
  const [step, setStep] = useState<number | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const stop = useRef<(() => void) | null>(null);
  const motionEnabled = useMotionEnabled();
  const scenario = traceScenarios.find((item) => item.mode === mode)!;
  useEffect(
    () => () => {
      stop.current?.();
    },
    [],
  );
  useEffect(() => {
    if (!motionEnabled) {
      stop.current?.();
      setStep(null);
      setAnnouncement(null);
    }
  }, [motionEnabled]);
  const running = motionEnabled && step !== null;
  function select(mode: TraceMode) {
    stop.current?.();
    setStep(null);
    setAnnouncement(null);
    setMode(mode);
  }
  function replay() {
    stop.current?.();
    if (!motionEnabled) {
      setStep(null);
      setAnnouncement(`Replay complete. ${scenario.status}`);
      return;
    }
    setAnnouncement(`Replaying ${scenario.label}.`);
    stop.current = startTraceReplay({
      onStep: setStep,
      onComplete: () => {
        setStep(null);
        setAnnouncement(`Replay complete. ${scenario.status}`);
      },
    });
  }
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
            onClick={() => select(item.mode)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="trace-replay"
        onClick={replay}
        aria-controls="trace-stage-list"
      >
        <Play size={13} aria-hidden="true" />
        {running ? "Restart Trace" : "Replay Trace"}
      </button>
      <ol
        id="trace-stage-list"
        className="trace-stages"
        aria-label={scenario.label}
        aria-busy={running}
      >
        {traceStages.map((stage, index) => {
          const detail = traceStage(mode, index);
          return (
            <li
              key={stage}
              aria-current={running && index === step ? "step" : undefined}
              data-state={
                running
                  ? index === step
                    ? "running"
                    : index > step!
                      ? "idle"
                      : detail.failed
                        ? "failed"
                        : "done"
                  : detail.failed
                    ? "failed"
                    : "done"
              }
            >
              <div className="trace-stage-label">
                <span>{detail.title}</span>
                {running && index === step ? (
                  <LoaderCircle
                    className="trace-spinner"
                    size={14}
                    aria-hidden="true"
                  />
                ) : running && index > step! ? (
                  <Circle size={12} aria-hidden="true" />
                ) : detail.failed ? (
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
        {running
          ? announcement
          : step !== null
            ? scenario.status
            : (announcement ?? scenario.status)}
      </p>
      <p className="trace-disclosure">
        Quota lifecycle simulation: settle completed usage, release pre-dispatch
        reservations, and retain estimates for uncertain upstream usage.
      </p>
    </div>
  );
}
