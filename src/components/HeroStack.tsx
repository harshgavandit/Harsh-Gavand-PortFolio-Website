import {
  BrainCircuit,
  ChartNoAxesCombined,
  Code2,
  Database,
  Eye,
  Network,
  Orbit,
  Terminal,
  Workflow,
} from "lucide-react";
import { resumeStackGroups, type StackItem } from "../data/heroStack";

const motifs = {
  api: Network,
  ai: BrainCircuit,
  data: Database,
  workflow: Workflow,
  terminal: Terminal,
  analysis: ChartNoAxesCombined,
  vision: Eye,
  code: Code2,
  orbit: Orbit,
};

function StackLogo({ item }: { item: StackItem }) {
  if (item.brand)
    return (
      <svg
        viewBox="0 0 24 24"
        width={18}
        height={18}
        aria-hidden="true"
        focusable="false"
      >
        <use
          href={`/stack/technology-logos.svg#${item.brand}`}
          width={24}
          height={24}
        />
      </svg>
    );
  const Icon = motifs[item.motif!];
  return <Icon size={18} aria-hidden="true" focusable="false" />;
}

export function HeroStack() {
  return (
    <div className="hero-stack" aria-labelledby="hero-stack-title">
      <div className="hero-stack-heading">
        <h2 id="hero-stack-title">Stack</h2>
        <p>From interfaces and APIs to AI, data, and cloud delivery.</p>
      </div>
      <div className="hero-stack-grid">
        {resumeStackGroups.map((group, index) => (
          <article
            className="stack-category"
            key={group.id}
            aria-labelledby={`stack-${group.id}`}
          >
            <h3 id={`stack-${group.id}`}>
              <span aria-hidden="true">0{index + 1}</span>
              {group.title}
            </h3>
            <ul className="stack-items" aria-label={group.title}>
              {group.items.map((item) => (
                <li key={item.name} className="stack-chip">
                  <span className="stack-mark">
                    <StackLogo item={item} />
                  </span>
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
