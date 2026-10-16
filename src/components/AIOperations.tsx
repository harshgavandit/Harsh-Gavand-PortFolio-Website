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
  const [status, setStatus] = useState("Loading anonymous aggregate counters…");
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
        if (active)
          setStatus(
            "Live counters are temporarily unavailable. The tools remain available under the shared usage allowance.",
          );
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
          <span className="eyebrow">Operating the system</span>
          <h2 id="operations-title">Live service counters.</h2>
        </div>
        <span className="operations-period">Last 7 UTC calendar days</span>
      </div>
      <p>
        Successful requests, failures, and public-answer cache hits share the
        same accounting boundary. These counters retain no questions, job
        descriptions, ticket content, audio, or client identifiers.
      </p>
      {metrics ? (
        <>
          <dl className="operations-stats">
            <div>
              <dt>Requests observed</dt>
              <dd>{metrics.requests.toLocaleString()}</dd>
            </div>
            <div>
              <dt>Completed / failed</dt>
              <dd>
                {metrics.successes} / {metrics.failures}
              </dd>
            </div>
            <div>
              <dt>Public cache hits</dt>
              <dd>{metrics.cacheHits}</dd>
            </div>
            <div>
              <dt>Provider-backed p95</dt>
              <dd>
                {metrics.uncachedP95UpperMs === null
                  ? "Collecting"
                  : `≤ ${(metrics.uncachedP95UpperMs / 1000).toFixed(1)}s`}
              </dd>
            </div>
            <div>
              <dt>Allowance accounted</dt>
              <dd>${metrics.allowanceCostUsd.toFixed(4)}</dd>
            </div>
          </dl>
          <p className="ai-tool-note">
            {metrics.providerCalls} provider-backed requests in this window. The
            p95 value is a latency-bucket upper bound, including failures; small
            samples do not establish an SLA. Allowance includes a conservative
            margin and is not an invoice.
          </p>
        </>
      ) : (
        <p role="status">{status}</p>
      )}
      <details>
        <summary>Collection and recovery</summary>
        <p>
          Collection began with this release. Counters expire after 31 days.
          Only the four public implementation-question samples can reuse cached
          answers, keyed by source snapshot and prompt version; custom inputs
          are never cached. Cache or monitoring failures do not bypass admission
          or spending protection.
        </p>
        <a
          className="text-link"
          href="/api/ai/metrics"
          target="_blank"
          rel="noopener noreferrer"
        >
          Inspect aggregate JSON ↗
        </a>
      </details>
    </section>
  );
}
