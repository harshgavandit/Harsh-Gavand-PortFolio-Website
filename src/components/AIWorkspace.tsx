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
import {
  codeSampleGroups,
  roleSample,
  ticketSamples,
} from "../lib/aiWorkspace";
import type {
  Execution,
  GuideResult,
  RecruiterResult,
  TriageResult,
} from "../lib/aiWorkspace";
import sourceSummary from "../data/sourceSummary.json";
import quality from "../data/aiQuality.json";
import { Operations } from "./AIOperations";

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
      <summary>Request details</summary>
      <dl>
        <div>
          <dt>Model</dt>
          <dd>{data.model}</dd>
        </div>
        {data.cache && (
          <div>
            <dt>Execution</dt>
            <dd>
              {data.cache === "hit" ? "Cached answer" : "Live model request"}
            </dd>
          </div>
        )}
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
          <dt>Budget used</dt>
          <dd>${data.allowanceCostUsd.toFixed(6)}</dd>
        </div>
        <div>
          <dt>Code revision</dt>
          <dd>{data.sourceSnapshot}</dd>
        </div>
        <div>
          <dt>Request ID</dt>
          <dd>{data.requestId}</dd>
        </div>
      </dl>
      <p>Budget usage includes the service’s pricing margin.</p>
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
  const [sampleGroup, setSampleGroup] = useState(0);
  const questionInput = useRef<HTMLTextAreaElement>(null);
  const api = useAIRequest<GuideResult>("/api/chat");
  const group = codeSampleGroups[sampleGroup];
  return (
    <div className="ai-tool-layout">
      <div className="ai-tool-intro">
        <span className="eyebrow">Read the implementation</span>
        <h2>Ask the code.</h2>
        <p>
          Explore my experience and how my projects work, with links to the
          relevant work and code.
        </p>
        <p className="ai-tool-note">
          Pick a topic, then click a question to ask it. You can also write your
          own.
        </p>
        <div
          className="ai-question-topics"
          role="group"
          aria-label="Question topics"
        >
          {codeSampleGroups.map((topic, index) => (
            <button
              type="button"
              key={topic.label}
              aria-pressed={sampleGroup === index}
              aria-controls="code-suggested-questions"
              onClick={() => setSampleGroup(index)}
            >
              {topic.label}
            </button>
          ))}
        </div>
        <div
          id="code-suggested-questions"
          className="ai-samples"
          role="group"
          aria-label={`${group.label} questions`}
        >
          {group.questions.map((sample) => (
            <button
              type="button"
              key={sample.label}
              disabled={api.busy}
              onClick={() => {
                setQuestion(sample.prompt);
                void api.run({
                  messages: [{ role: "user", content: sample.prompt }],
                });
                questionInput.current?.focus();
              }}
            >
              {sample.label}
              <ArrowUpRight size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
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
            ref={questionInput}
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            maxLength={2000}
            rows={4}
            placeholder="Ask about my experience, a project, or an engineering decision…"
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
    supported: "Experience match",
    partial: "Related experience",
    not_shown: "No direct match",
  };
  return (
    <div className="ai-tool-layout">
      <div className="ai-tool-intro">
        <span className="eyebrow">Requirements → relevant work</span>
        <h2>Compare a role.</h2>
        <p>
          Compare a role’s technical requirements with my experience and
          projects, with links to the relevant work.
        </p>
        <p className="ai-tool-note">Use a public job description.</p>
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
        <span className="eyebrow">Support automation</span>
        <h2>Run ticket triage.</h2>
        <p>
          Classify a support ticket by topic and priority, with a review flag
          for sensitive or ambiguous requests.
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
          Node.js API · PII redaction · Structured topic and priority routing.
        </p>
        <a
          className="text-link"
          href="https://github.com/harshgavandit/Harsh-Gavand-PortFolio-Website/blob/c0414c9cc4c7e98466efcb42b8a28f7cac4c351c/server/ai-tools.mjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Portfolio triage source ↗
        </a>
      </div>
      <div className="ai-tool-surface">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void api.run({ text });
          }}
        >
          <label htmlFor="ticket-input">Support ticket</label>
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
            Use an example ticket without personal details.
          </p>
          <div className="ai-form-actions">
            <button
              type="submit"
              className="button button-primary"
              disabled={api.busy || text.trim().length < 12}
            >
              <Play size={15} aria-hidden="true" /> Classify ticket
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
                : "Triage result"}
            </span>
            <h3>{api.result.summary}</h3>
            <div className="ai-result-facts">
              <span>
                Category <strong>{api.result.category}</strong>
              </span>
              <span>
                Priority <strong>{api.result.priority}</strong>
              </span>
            </div>
            <p>{api.result.rationale}</p>
            <details className="ai-redacted">
              <summary>Redacted input</summary>
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
        <span className="eyebrow">AI workspace</span>
        <h1>
          Explore the code.
          <br />
          Try the tools.
        </h1>
        <p>
          Ask about a project, match a role to my experience, or classify a
          support ticket.
        </p>
        <div className="ai-workspace-facts">
          <span>
            <GitBranch size={15} aria-hidden="true" />
            {sourceSummary.repositories.length} repositories
          </span>
          <span>{sourceSummary.fileCount} source files</span>
          <span>File &amp; line references</span>
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
      <Operations />
      <section className="ai-quality" aria-labelledby="ai-quality-title">
        <div>
          <span className="eyebrow">
            <FlaskConical size={15} aria-hidden="true" /> Evaluation
          </span>
          <h2 id="ai-quality-title">Evaluation results.</h2>
          <p>
            Code answers, role comparisons, and ticket routing tested against a
            fixed set of example requests.
          </p>
          {quality.status === "completed" &&
            quality.runtimeDigest !== __AI_RUNTIME_DIGEST__ && (
              <p className="ai-request-error">
                Evaluation update pending for this release.
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
                <span>Response checks passed</span>
              </div>
              <div>
                <strong>
                  {quality.retrieval.passed}/{quality.retrieval.total}
                </strong>
                <span>Retrieval checks passed</span>
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
            </p>
            {"dataset" in quality && (
              <p className="ai-tool-note">
                {
                  (
                    quality.dataset as {
                      uniqueCases: number;
                      repetitions: number;
                    }
                  ).uniqueCases
                }{" "}
                test cases ·{" "}
                {(quality.dataset as { repetitions: number }).repetitions} runs
                per case
              </p>
            )}
            <details>
              <summary>Test cases and methodology</summary>
              <ul>
                {(
                  quality.cases as {
                    id: string;
                    passed: boolean;
                    checks: string[];
                    elapsedMs: number;
                  }[]
                ).map((item, index) => (
                  <li key={`${item.id}-${index}`}>
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
                Controlled evaluation cases covering source references, expected
                facts, ticket categories, refusals, and unsupported
                requirements. Build revision:{" "}
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
          <summary>Source repositories</summary>
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
        </details>
      </section>
      <details className="ai-page-privacy">
        <summary>Privacy</summary>
        <p>
          Requests are processed by OpenAI. This site doesn’t save your
          questions, job descriptions, or tickets.
        </p>
      </details>
    </main>
  );
}
