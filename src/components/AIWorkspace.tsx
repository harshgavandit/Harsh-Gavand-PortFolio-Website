import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  FlaskConical,
  GitBranch,
  Play,
  Square,
} from "lucide-react";
import { Tabs } from "./Tabs";
import { CodeEvidence } from "./CodeEvidence";
import { codeSamples, roleSample, ticketSamples } from "../lib/aiWorkspace";
import type {
  Execution,
  GuideResult,
  RecruiterResult,
  TriageResult,
} from "../lib/aiWorkspace";
import sourceSummary from "../data/sourceSummary.json";
import quality from "../data/aiQuality.json";

const indiaDate = (value: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(value));

function useAIRequest<T>(endpoint: string) {
  const request = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const [result, setResult] = useState<T | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const stop = () => {
    generation.current++;
    request.current?.abort();
    request.current = null;
    setBusy(false);
  };
  useEffect(
    () => () => {
      generation.current++;
      request.current?.abort();
    },
    [],
  );
  useEffect(() => {
    const hidden = () => {
      if (document.hidden) {
        generation.current++;
        request.current?.abort();
        request.current = null;
        setBusy(false);
      }
    };
    document.addEventListener("visibilitychange", hidden);
    return () => document.removeEventListener("visibilitychange", hidden);
  }, []);
  async function run(body: unknown) {
    if (request.current) return;
    const id = ++generation.current;
    const controller = new AbortController();
    request.current = controller;
    const timer = window.setTimeout(() => controller.abort(), 32000);
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      if (!response.headers.get("content-type")?.includes("application/json"))
        throw new Error(
          "This tool is temporarily unavailable. Please try again.",
        );
      const data = await response.json();
      if (id !== generation.current) return;
      if (!response.ok)
        throw new Error(data.error || "The request could not be completed.");
      setResult(data as T);
    } catch (failure) {
      if (id === generation.current)
        setError(
          controller.signal.aborted
            ? "Request timed out. You can try again."
            : failure instanceof Error
              ? failure.message
              : "This tool is unavailable.",
        );
    } finally {
      window.clearTimeout(timer);
      if (id === generation.current) {
        request.current = null;
        setBusy(false);
      }
    }
  }
  return { result, busy, error, run, stop };
}

function ExecutionDetails({ data }: { data?: Execution }) {
  if (!data) return null;
  return (
    <details className="ai-execution">
      <summary>Inspect this request</summary>
      <dl>
        <div>
          <dt>Model</dt>
          <dd>{data.model}</dd>
        </div>
        <div>
          <dt>Server time</dt>
          <dd>{(data.elapsedMs / 1000).toFixed(2)}s</dd>
        </div>
        <div>
          <dt>Tokens</dt>
          <dd>
            {data.inputTokens ?? "Unavailable"} in ·{" "}
            {data.outputTokens ?? "Unavailable"} out
          </dd>
        </div>
        <div>
          <dt>Allowance charged</dt>
          <dd>${data.allowanceCostUsd.toFixed(6)}</dd>
        </div>
        <div>
          <dt>Source snapshot</dt>
          <dd>{data.sourceSnapshot}</dd>
        </div>
        <div>
          <dt>Request</dt>
          <dd>{data.requestId}</dd>
        </div>
      </dl>
      <p>
        Measured for this request. Allowance includes a pricing safety margin
        and is not an invoice amount. Inputs are not stored by this site.
      </p>
    </details>
  );
}

function RequestState({ busy, error }: { busy: boolean; error: string }) {
  return (
    <>
      {busy && (
        <p className="ai-request-status" role="status">
          Running the live model request…
        </p>
      )}
      {error && (
        <p className="ai-request-error" role="alert">
          {error}
        </p>
      )}
    </>
  );
}

function TechnicalGuide() {
  const [question, setQuestion] = useState("");
  const api = useAIRequest<GuideResult>("/api/chat");
  return (
    <div className="ai-tool-layout">
      <div className="ai-tool-intro">
        <span className="eyebrow">Read the implementation</span>
        <h2>Ask the code.</h2>
        <p>
          Explore decisions in selected public repositories. Answers can include
          the actual source excerpt, file lines, and immutable commit.
        </p>
        <div className="ai-samples">
          {codeSamples.map((sample) => (
            <button
              type="button"
              key={sample}
              disabled={api.busy}
              onClick={() => setQuestion(sample)}
            >
              {sample}
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="ai-tool-note">
          The index uses local BM25-style lexical retrieval over versioned code
          snapshots. It does not browse your files or execute code.
        </p>
      </div>
      <div className="ai-tool-surface">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void api.run({
              messages: [{ role: "user", content: question.trim() }],
            });
          }}
        >
          <label htmlFor="code-question">Your implementation question</label>
          <textarea
            id="code-question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Where is cancellation handled?"
            required
          />
          <div className="ai-form-actions">
            <button
              className="button button-primary"
              type="submit"
              disabled={api.busy || !question.trim()}
            >
              <BookOpen size={16} aria-hidden="true" /> Ask the guide
            </button>
            {api.busy && (
              <button type="button" className="button" onClick={api.stop}>
                <Square size={15} aria-hidden="true" /> Stop
              </button>
            )}
          </div>
        </form>
        <RequestState busy={api.busy} error={api.error} />
        {api.result && (
          <div className="ai-result" aria-live="polite">
            <h3>Implementation notes</h3>
            <p className="ai-answer">{api.result.answer}</p>
            <CodeEvidence items={api.result.evidence} />
            {!!api.result.sources?.length && (
              <div className="ai-result-links">
                {api.result.sources.map((source) => (
                  <a
                    key={source.href}
                    href={source.href}
                    target={
                      source.href.startsWith("https:") ? "_blank" : undefined
                    }
                    rel="noopener noreferrer"
                  >
                    {source.label} ↗
                  </a>
                ))}
              </div>
            )}
            <ExecutionDetails data={api.result.execution} />
          </div>
        )}
      </div>
    </div>
  );
}

function RecruiterWorkspace() {
  const [text, setText] = useState("");
  const api = useAIRequest<RecruiterResult>("/api/ai/recruiter");
  const labels = {
    supported: "Supported",
    partial: "Partial evidence",
    not_shown: "Not shown",
  };
  return (
    <div className="ai-tool-layout">
      <div className="ai-tool-intro">
        <span className="eyebrow">Requirements → relevant work</span>
        <h2>Compare a role.</h2>
        <p>
          Paste the technical requirements of a role. Get a concise comparison
          against published experience and projects, with direct supporting
          links and explicit gaps.
        </p>
        <p className="ai-tool-note">
          This compares professional evidence; it does not produce a hiring
          score. Use a public job description and omit personal or confidential
          information.
        </p>
        <button
          type="button"
          className="button button-secondary"
          disabled={api.busy}
          onClick={() => setText(roleSample)}
        >
          Use an example role
        </button>
      </div>
      <div className="ai-tool-surface">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void api.run({ text });
          }}
        >
          <label htmlFor="role-description">Role description</label>
          <textarea
            id="role-description"
            rows={8}
            maxLength={6000}
            minLength={12}
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="React, Python, relational databases, AI integration…"
            required
          />
          <div className="ai-form-actions">
            <button
              type="submit"
              className="button button-primary"
              disabled={api.busy || text.trim().length < 12}
            >
              Compare requirements <ArrowUpRight size={16} aria-hidden="true" />
            </button>
            {api.busy && (
              <button type="button" className="button" onClick={api.stop}>
                Stop
              </button>
            )}
            <span>{text.length.toLocaleString()}/6,000</span>
          </div>
        </form>
        <RequestState busy={api.busy} error={api.error} />
        {api.result && (
          <div className="ai-result" aria-live="polite">
            <h3>Role comparison</h3>
            <p>{api.result.summary}</p>
            <div className="ai-requirements">
              {api.result.requirements.map((row, i) => (
                <article key={`${row.requirement}-${i}`}>
                  <span className={`ai-assessment is-${row.assessment}`}>
                    {labels[row.assessment]}
                  </span>
                  <h4>{row.requirement}</h4>
                  <p>{row.explanation}</p>
                  <div className="ai-result-links">
                    {row.evidence.map((source) => (
                      <a href={source.href} key={source.id}>
                        {source.label} ↗
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
            <ExecutionDetails data={api.result.execution} />
          </div>
        )}
      </div>
    </div>
  );
}

function TicketWorkbench() {
  const [text, setText] = useState(ticketSamples[0].text);
  const api = useAIRequest<TriageResult>("/api/ai/triage");
  return (
    <div className="ai-tool-layout">
      <div className="ai-tool-intro">
        <span className="eyebrow">A bounded AI workflow</span>
        <h2>Run ticket triage.</h2>
        <p>
          Turn a fictional support request into a category, priority, and
          routing recommendation. Ambiguous or sensitive requests stay with a
          human.
        </p>
        <div className="ai-samples">
          {ticketSamples.map((sample) => (
            <button
              type="button"
              disabled={api.busy}
              key={sample.label}
              onClick={() => setText(sample.text)}
            >
              {sample.label}
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="ai-tool-note">
          This is a portfolio adaptation of the support-classification workflow
          running on the portfolio’s Node API. The original project uses FastAPI
          and LangGraph. No tickets are created, refunds issued, or account
          changes executed.
        </p>
        <a
          className="text-link"
          href="https://github.com/harshgavandit/support-ticket-classifier"
          target="_blank"
          rel="noopener noreferrer"
        >
          Original classifier source ↗
        </a>
      </div>
      <div className="ai-tool-surface">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void api.run({ text });
          }}
        >
          <label htmlFor="ticket-input">Fictional support ticket</label>
          <textarea
            id="ticket-input"
            rows={6}
            maxLength={1600}
            minLength={12}
            value={text}
            onChange={(event) => setText(event.target.value)}
            required
          />
          <p className="ai-input-note">
            Use sample data only. Common email, phone, payment, and credential
            patterns are redacted before OpenAI receives the text. Redaction
            cannot guarantee removal of every identifier.
          </p>
          <div className="ai-form-actions">
            <button
              type="submit"
              className="button button-primary"
              disabled={api.busy || text.trim().length < 12}
            >
              <Play size={15} aria-hidden="true" /> Run live triage
            </button>
            {api.busy && (
              <button type="button" className="button" onClick={api.stop}>
                Stop
              </button>
            )}
            <span>{text.length}/1,600</span>
          </div>
        </form>
        <RequestState busy={api.busy} error={api.error} />
        {api.result && (
          <div className="ai-result" aria-live="polite">
            <span
              className={`ai-assessment ${api.result.needsReview ? "is-partial" : "is-supported"}`}
            >
              {api.result.needsReview
                ? "Human review recommended"
                : "Classification ready"}
            </span>
            <h3>{api.result.summary}</h3>
            <div className="ai-result-facts">
              <span>
                Category <strong>{api.result.category}</strong>
              </span>
              <span>
                Priority <strong>{api.result.priority}</strong>
              </span>
              <span>
                Actions executed <strong>{api.result.actionsExecuted}</strong>
              </span>
            </div>
            <p>{api.result.rationale}</p>
            <details className="ai-redacted">
              <summary>Inspect the redacted model input</summary>
              <p>{api.result.redactedInput}</p>
              <small>
                {api.result.redactedFields.length
                  ? `Patterns removed: ${api.result.redactedFields.join(", ")}`
                  : "No configured identifier patterns found."}
              </small>
            </details>
            <ExecutionDetails data={api.result.execution} />
          </div>
        )}
      </div>
    </div>
  );
}

export function AIWorkspace() {
  return (
    <main id="main" className="ai-workspace section-container" tabIndex={-1}>
      <div className="ai-page-heading">
        <a className="text-link" href="/#projects">
          ← Back to selected work
        </a>
        <span className="eyebrow">Live AI workspace</span>
        <h1>
          Explore the work.
          <br />
          Inspect the system.
        </h1>
        <p>
          Ask implementation questions, compare a role, or run an AI workflow.
          Every request uses the same bounded backend as the portfolio
          assistant.
        </p>
        <div className="ai-workspace-facts">
          <span>
            <GitBranch size={15} aria-hidden="true" />
            {sourceSummary.repositories.length} public repositories
          </span>
          <span>{sourceSummary.fileCount} selected source files</span>
          <span>Versioned code citations</span>
        </div>
      </div>
      <Tabs
        id="ai-workspace"
        label="AI workspace tools"
        items={[
          { label: "Technical guide", content: <TechnicalGuide /> },
          { label: "Role fit", content: <RecruiterWorkspace /> },
          { label: "Ticket triage", content: <TicketWorkbench /> },
        ]}
      />
      <section className="ai-quality" aria-labelledby="ai-quality-title">
        <div>
          <span className="eyebrow">
            <FlaskConical size={15} aria-hidden="true" /> Quality checks
          </span>
          <h2 id="ai-quality-title">Measured, with limits.</h2>
          <p>
            Controlled checks use real model requests and synthetic inputs.
            These are release checks, not production traffic statistics or a
            comprehensive accuracy guarantee.
          </p>
          {quality.status === "completed" &&
            quality.runtimeDigest !== __AI_RUNTIME_DIGEST__ && (
              <p className="ai-request-error">
                These results describe an earlier backend revision. The current
                revision has not completed this evaluation run.
              </p>
            )}
        </div>
        {quality.status === "completed" ? (
          <>
            <div className="ai-quality-stats">
              <div>
                <strong>
                  {quality.summary.passed}/{quality.summary.total}
                </strong>
                <span>Automated response checks</span>
              </div>
              <div>
                <strong>
                  {quality.retrieval.passed}/{quality.retrieval.total}
                </strong>
                <span>Source-retrieval checks</span>
              </div>
              <div>
                <strong>
                  {(quality.summary.medianLatencyMs / 1000).toFixed(2)}s
                </strong>
                <span>Median test request</span>
              </div>
            </div>
            <p className="ai-quality-meta">
              Model: {quality.model} · Run:{" "}
              {quality.evaluatedAt
                ? `${indiaDate(quality.evaluatedAt)} IST`
                : "Not run"}{" "}
              · Source snapshot: {quality.sourceSnapshot.slice(0, 12)}
            </p>
            <details>
              <summary>Inspect cases and grading boundaries</summary>
              <ul>
                {(
                  quality.cases as {
                    id: string;
                    passed: boolean;
                    checks: string[];
                    elapsedMs: number;
                  }[]
                ).map((item) => (
                  <li key={item.id}>
                    <strong>
                      {item.passed ? "Pass" : "Fail"} · {item.id}
                    </strong>
                    <span>
                      {item.checks.join(" · ")} ·{" "}
                      {(item.elapsedMs / 1000).toFixed(2)}s
                    </span>
                  </li>
                ))}
              </ul>
              <p>
                Automated assertions check expected categories, explicit gaps,
                refusal behavior, and valid source references. They do not
                establish that every sentence is correct. Runtime fingerprint:{" "}
                <code>{quality.runtimeDigest.slice(0, 12)}</code>.
              </p>
            </details>
          </>
        ) : (
          <p>
            Live evaluation results have not been published for this version.
          </p>
        )}
        <details>
          <summary>Indexed repositories and commits</summary>
          <ul>
            {sourceSummary.repositories.map((repo) => (
              <li key={repo.repo}>
                <a
                  href={`${repo.url}/tree/${repo.commit}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.title} ↗
                </a>
                <span>
                  {repo.files} files · {repo.commit.slice(0, 7)}
                </span>
              </li>
            ))}
          </ul>
          <p>
            Selected public files, indexed {indiaDate(sourceSummary.indexedAt)}{" "}
            IST. Answers describe those versions; later repository changes may
            not be reflected.
          </p>
        </details>
      </section>
      <p className="ai-page-privacy">
        Inputs are sent to OpenAI after submission. This site keeps form input
        and results in page memory only; it does not save job descriptions or
        tickets. AI output can be wrong. Shared usage limits may temporarily
        pause live tools.
      </p>
    </main>
  );
}
