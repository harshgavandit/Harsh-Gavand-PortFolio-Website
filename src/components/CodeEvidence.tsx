import { ArrowUpRight, FileCode2 } from "lucide-react";
import type { CodeEvidence as Evidence } from "../lib/aiWorkspace";

export function CodeEvidence({ items }: { items?: Evidence[] }) {
  if (!items?.length) return null;
  return (
    <div className="code-evidence" aria-label="Supporting source code">
      {items.map((item) => (
        <details key={item.id}>
          <summary>
            <FileCode2 size={16} aria-hidden="true" />
            <span>
              {item.repo}
              <strong>
                {item.path}:{item.startLine}–{item.endLine}
              </strong>
            </span>
          </summary>
          <pre>
            <code>{item.text}</code>
          </pre>
          <a href={item.href} target="_blank" rel="noopener noreferrer">
            Open exact source · {item.commit.slice(0, 7)}{" "}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </details>
      ))}
    </div>
  );
}
