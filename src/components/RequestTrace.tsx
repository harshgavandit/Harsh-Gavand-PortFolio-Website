import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Check,
  Circle,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { traceStage, traceStages, type TraceMode } from "../lib/requestTrace";
import { useMotionEnabled } from "./MotionPreferences";

export function RequestTrace() {
  const [timeout, setTimeoutMode] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<TraceMode>("success");
  const [announcement, setAnnouncement] = useState(
    "Ready to simulate an API lifecycle.",
  );
  const enabled = useMotionEnabled();
  const timers = useRef<number[]>([]);
  const clear = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);
  useEffect(() => clear, [clear]);
  function run() {
    clear();
    const selected = timeout ? "timeout" : "success";
    setMode(selected);
    setCompleted(0);
    setRunning(true);
    setAnnouncement("Simulated request started.");
    if (!enabled) {
      setCompleted(4);
      setRunning(false);
      setAnnouncement(
        selected === "timeout"
          ? "Simulation complete: upstream timeout followed by full rollback."
          : "Simulation complete: 112 tokens settled and 28 refunded.",
      );
      return;
    }
    [140, 330, 950, 1140].forEach((delay, index) =>
      timers.current.push(
        window.setTimeout(() => {
          setCompleted(index + 1);
          if (index === 3) {
            setRunning(false);
            setAnnouncement(
              selected === "timeout"
                ? "Simulation complete: upstream timeout followed by full rollback."
                : "Simulation complete: 112 tokens settled and 28 refunded.",
            );
          }
        }, delay),
      ),
    );
  }
  return (
    <div className="request-trace">
      <div className="trace-top">
        <span className="eyebrow">Deterministic simulation</span>
        <span className="trace-simulation-badge">No API call</span>
      </div>
      <p className="trace-intro">
        Follow admission, a credit lock, model work, and settlement.
      </p>
      <ol className="trace-stages">
        {traceStages.map((stage, index) => {
          const detail = traceStage(mode, index);
          const done = index < completed;
          const active = running && index === completed;
          return (
            <li
              key={stage}
              data-state={
                done
                  ? detail.failed
                    ? "failed"
                    : "done"
                  : active
                    ? "running"
                    : "idle"
              }
            >
              <div className="trace-stage-label">
                <span>
                  0{index + 1} / {stage}
                </span>
                {done ? (
                  detail.failed ? (
                    <TriangleAlert size={14} aria-hidden="true" />
                  ) : (
                    <Check size={14} aria-hidden="true" />
                  )
                ) : active ? (
                  <LoaderCircle size={14} aria-hidden="true" />
                ) : (
                  <Circle size={12} aria-hidden="true" />
                )}
              </div>
              <p>
                {done
                  ? detail.message
                  : active
                    ? "Processing…"
                    : "Waiting for trace"}
              </p>
              <span className="trace-time">{done ? detail.timing : "—"}</span>
            </li>
          );
        })}
      </ol>
      <label className="trace-toggle">
        <input
          type="checkbox"
          checked={timeout}
          disabled={running}
          onChange={(event) => {
            setTimeoutMode(event.target.checked);
            setCompleted(0);
            setAnnouncement("Ready to run the selected scenario.");
          }}
        />
        Simulate Upstream Timeout
      </label>
      <button
        className="button button-primary trace-run"
        type="button"
        onClick={run}
        disabled={running}
      >
        {running ? "Tracing request…" : "Run Trace"}
        <ArrowUpRight size={15} aria-hidden="true" />
      </button>
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
      <p className="trace-disclosure">
        Illustrative timings and token balance. This Gemini scenario assumes a
        failed operation is refundable. The live OpenAI assistant refunds before
        dispatch and retains uncertain provider charges.
      </p>
    </div>
  );
}
