import { useEffect, useState } from "react";
type Metrics = {
  requests: number;
  successes: number;
  failures: number;
  cacheHits: number;
  providerCalls: number;
  uncachedP95UpperMs: number | null;
  allowanceCostUsd: number;
  from: string;
  through: string;
  updatedAt: string;
};
export function Operations() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [status, setStatus] = useState("Loading metrics…");
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 8000);
    void fetch("/api/ai/metrics", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unavailable");
        const data = await response.json();
        if (
          !Number.isSafeInteger(data.requests) ||
          data.requests < 0 ||
          !Number.isSafeInteger(data.successes) ||
          !Number.isSafeInteger(data.failures) ||
          !Number.isSafeInteger(data.providerCalls) ||
          !Number.isSafeInteger(data.cacheHits) ||
          !Number.isFinite(data.allowanceCostUsd)
        )
          throw new Error("Invalid counters");
        if (!controller.signal.aborted) setMetrics(data as Metrics);
      })
      .catch(() => {
        if (active) setStatus("Metrics are temporarily unavailable.");
      })
      .finally(() => window.clearTimeout(timer));
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, []);
  return (
    <section className="ai-operations" aria-labelledby="operations-title">
      <div className="ai-operations-heading">
        <div>
          <span className="eyebrow">Service metrics</span>
          <h2 id="operations-title">Live performance.</h2>
        </div>
        <span className="operations-period">Last 7 days · UTC</span>
      </div>
      <p>
        Request volume, cache usage, and response times across the AI tools.
      </p>
      {metrics ? (
        <>
          <dl className="operations-stats">
            <div>
              <dt>Requests</dt>
              <dd>{metrics.requests.toLocaleString()}</dd>
            </div>
            <div>
              <dt>Completed / failed</dt>
              <dd>
                {metrics.successes} / {metrics.failures}
              </dd>
            </div>
            <div>
              <dt>Cache hits</dt>
              <dd>{metrics.cacheHits}</dd>
            </div>
            <div>
              <dt>Response p95</dt>
              <dd>
                {metrics.uncachedP95UpperMs === null
                  ? "Collecting"
                  : `≤ ${(metrics.uncachedP95UpperMs / 1000).toFixed(1)}s`}
              </dd>
            </div>
            <div>
              <dt>Budget used</dt>
              <dd>${metrics.allowanceCostUsd.toFixed(4)}</dd>
            </div>
          </dl>
          <p className="ai-tool-note">
            {metrics.providerCalls} model requests this week.
          </p>
        </>
      ) : (
        <p role="status">{status}</p>
      )}
      <details>
        <summary>Metric definitions</summary>
        <p>
          P95 shows the upper latency bucket for model requests, including
          failures. Budget usage includes a pricing margin. Redis counters
          expire after 31 days; answers to the four preset code questions are
          cached for six hours. Custom inputs stay out of the cache.
        </p>
        <a
          className="text-link"
          href="/api/ai/metrics"
          target="_blank"
          rel="noopener noreferrer"
        >
          Metrics API ↗
        </a>
      </details>
    </section>
  );
}
