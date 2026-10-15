import { ArrowUpRight, Braces, GitBranch } from "lucide-react";
import { useState } from "react";
import { productionCode, pythonQuotaCode } from "../data/recruiter";
import { RequestTrace } from "./RequestTrace";
import { Tabs } from "./Tabs";
import { codeTokens } from "../lib/codeTokens";
function HighlightedLine({ text }: { text: string }) {
  return (
    <>
      {codeTokens(text).map((part, index) => (
        <span
          key={index}
          className={
            part.kind === "keyword"
              ? "code-keyword"
              : part.kind === "string"
                ? "code-string"
                : undefined
          }
        >
          {part.text}
        </span>
      ))}
    </>
  );
}

function CodeImplementation() {
  const [python, setPython] = useState(false);
  const filename = python
    ? "examples/quota_lifecycle.py"
    : "server/quota-lifecycle.mjs";
  return (
    <div className="code-preview">
      <div
        className="code-languages"
        role="group"
        aria-label="Implementation language"
      >
        <button
          type="button"
          aria-pressed={!python}
          aria-controls="quota-code-preview"
          onClick={() => setPython(false)}
        >
          Node.js / TypeScript
        </button>
        <button
          type="button"
          aria-pressed={python}
          aria-controls="quota-code-preview"
          onClick={() => setPython(true)}
        >
          Python / FastAPI
        </button>
      </div>
      <div className="code-file">
        <Braces size={14} aria-hidden="true" />
        {filename}
      </div>
      <pre
        id="quota-code-preview"
        aria-label={
          python
            ? "Python async context-manager quota pattern"
            : "Server request admission and quota settlement"
        }
      >
        <code>
          {(python ? pythonQuotaCode : productionCode).map((line, index) => (
            <span className="code-line" key={index}>
              <span className="line-number" aria-hidden="true">
                {index + 1}
              </span>
              <span>
                <HighlightedLine text={line} />
              </span>
            </span>
          ))}
        </code>
      </pre>
      <p>
        {python
          ? "Equivalent async context-manager pattern with injected provider and disconnect checks. The live portfolio API runs Node.js."
          : "Production pattern for atomic credit reservation, abort rollback, and idempotent settlement."}
      </p>
      <a
        className="text-link"
        href={`https://github.com/harshgavandit/Harsh-Gavand-PortFolio-Website/blob/main/${filename}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {python ? "Read the Python port" : "Read the quota lifecycle"}
        <ArrowUpRight size={14} aria-hidden="true" />
      </a>
    </div>
  );
}
export function EngineeringShowcase() {
  return (
    <div className="engineering-showcase">
      <div className="window-bar">
        <span>
          <i />
          <i />
          <i />
        </span>
        <span>engineering / field notes</span>
        <GitBranch size={14} aria-hidden="true" />
      </div>
      <Tabs
        id="hero-proof"
        label="Explore engineering work"
        items={[
          { label: "Request Lifecycle Trace", content: <RequestTrace /> },
          {
            label: "Implementation",
            content: <CodeImplementation />,
          },
        ]}
      />
    </div>
  );
}
