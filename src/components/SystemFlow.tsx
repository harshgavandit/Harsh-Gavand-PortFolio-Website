import { useState } from "react";
import { ArrowDown } from "lucide-react";
import type { CaseStudy } from "../data/portfolio";

export function SystemFlow({
  study,
  slug,
}: {
  study: CaseStudy;
  slug: string;
}) {
  const [active, setActive] = useState(0);
  const diagram = study.diagram!;
  const detailId = `${slug}-contract`;
  return (
    <figure className="case-flow">
      <ol aria-label={`${study.shortName} architecture stages`}>
        {diagram.nodes.map((node, index) => (
          <li key={node}>
            <button
              type="button"
              aria-pressed={active === index}
              aria-controls={detailId}
              onClick={() => setActive(index)}
              onPointerEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
            >
              <strong>{node}</strong>
            </button>
            {index < diagram.nodes.length - 1 && (
              <ArrowDown size={15} aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>
      <div
        className="flow-contract"
        id={detailId}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <p>
          <span>Data flow</span> {diagram.contracts[active]}
        </p>
        <p>
          <span>Implementation</span> {diagram.details[active]}
        </p>
      </div>
      <figcaption>{diagram.caption}</figcaption>
    </figure>
  );
}
