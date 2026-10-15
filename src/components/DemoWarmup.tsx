import { useEffect } from "react";
import { projects } from "../data/portfolio";
import { renderDemoOrigins, warmDemoRequests } from "../lib/demoWarmup";

export function DemoWarmup() {
  useEffect(() => {
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;
    const controller = new AbortController();
    const run = () => {
      void warmDemoRequests(
        renderDemoOrigins(projects),
        fetch,
        controller.signal,
      );
    };
    const idle = typeof window.requestIdleCallback === "function";
    const handle = idle
      ? window.requestIdleCallback(run, { timeout: 2000 })
      : window.setTimeout(run, 500);
    return () => {
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      controller.abort();
    };
  }, []);
  return null;
}
