import { useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Check,
  Database,
  GitBranch,
} from "lucide-react";
import { heroArchitecture, productionCode } from "../data/recruiter";
import { profile } from "../data/portfolio";
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
              ? "#project-14"
              : `/archive#archive-project-${heroArchitecture[active].projectId}`
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
                  <Braces size={14} aria-hidden="true" /> server/app.mjs
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
                  Reserve the usage allowance before generation. Retain the
                  reservation when settlement fails.
                </p>
                <a
                  className="text-link"
                  href="https://github.com/harshgavandit/Harsh-Gavand-PortFolio-Website/blob/main/server/app.mjs"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Read the request handler{" "}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            ),
          },
          {
            label: "Live Telemetry",
            content: (
              <div className="engineering-profile">
                <div className="profile-symbol">
                  <Database size={30} aria-hidden="true" />
                </div>
                <p className="eyebrow">Engineering profile</p>
                <h3>
                  Backend APIs.
                  <br />
                  Applied AI.
                  <br />
                  Full-stack delivery.
                </h3>
                <p>Mumbai · Open to relocation / remote</p>
                <dl>
                  <div>
                    <dt>Specialization</dt>
                    <dd>Backend APIs, AI workflows & data integration</dd>
                  </div>
                  <div>
                    <dt>Languages</dt>
                    <dd>TypeScript · JavaScript · Python · SQL</dd>
                  </div>
                </dl>
                <div className="profile-links">
                  {[
                    { label: "Résumé PDF", href: profile.resume },
                    { label: "GitHub", href: profile.github },
                    { label: "LinkedIn", href: profile.linkedin },
                  ].map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
