import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Check,
  GitBranch,
} from "lucide-react";
import { heroArchitecture, productionCode } from "../data/recruiter";
import { projectSlug } from "../data/portfolio";
import { RequestTrace } from "./RequestTrace";
import { Tabs } from "./Tabs";
function HighlightedLine({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/(const|await|if|return|try|catch|"(?:[^"]*)")/g)
        .map((part, index) => (
          <span
            key={index}
            className={
              /^(const|await|if|return|try|catch)$/.test(part)
                ? "code-keyword"
                : part.startsWith('"')
                  ? "code-string"
                  : undefined
            }
          >
            {part}
          </span>
        ))}
    </>
  );
}
function Architecture() {
  const [active, setActive] = useState(0);
  return (
    <div className="hero-system">
      <p className="technical-note">Interfaces → APIs → workflows → data</p>
      <ol className="system-pipeline">
        {heroArchitecture.map((node, index) => (
          <li key={node.title}>
            <button
              type="button"
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span className="node-index">0{index + 1}</span>
              <span>
                <small>{node.tag}</small>
                <strong>{node.title}</strong>
              </span>
              {active === index ? (
                <Check size={16} aria-hidden="true" />
              ) : (
                <ArrowDown size={16} aria-hidden="true" />
              )}
            </button>
          </li>
        ))}
      </ol>
      <div className="node-detail" role="status">
        <p>{heroArchitecture[active].detail}</p>
        <span>{heroArchitecture[active].stack}</span>
        <a
          href={
            heroArchitecture[active].projectId === 14
              ? "#ugc-platform"
              : `/archive#${projectSlug(heroArchitecture[active].projectId)}`
          }
        >
          See the implementation <ArrowUpRight size={13} aria-hidden="true" />
        </a>
      </div>
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
          { label: "System Architecture", content: <Architecture /> },
          {
            label: "Production Code",
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
                  Atomic quota reservation, pre-dispatch abort rollback, and
                  durable settlement retries with dead-letter handling.
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
          { label: "Request Trace", content: <RequestTrace /> },
        ]}
      />
    </div>
  );
}
