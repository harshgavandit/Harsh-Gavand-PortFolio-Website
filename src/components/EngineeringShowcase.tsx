import { ArrowUpRight, Braces, GitBranch } from "lucide-react";
import { productionCode } from "../data/recruiter";
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
            content: (
              <div className="code-preview">
                <div className="code-file">
                  <Braces size={14} aria-hidden="true" />{" "}
                  server/quota-lifecycle.mjs
                </div>
                <pre aria-label="Server request admission and quota settlement">
                  <code>
                    {productionCode.map((line, index) => (
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
                  Production pattern for atomic credit reservation, abort
                  rollback, and idempotent settlement.
                </p>
                <a
                  className="text-link"
                  href="https://github.com/harshgavandit/Harsh-Gavand-PortFolio-Website/blob/main/server/quota-lifecycle.mjs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the quota lifecycle{" "}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
