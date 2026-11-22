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
import { useSyncExternalStore } from "react";
import { m } from "motion/react";
import { LazyScene } from "../three/LazyScene";
import { stackFocus } from "../three/stackFocus";
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

const short: Record<string, string> = {
  frontend: "Frontend",
  backend: "Backend",
  data: "Data",
  ai: "AI / ML",
  cloud: "Cloud & DevOps",
  tools: "Workflow",
};

const total = resumeStackGroups.reduce(
  (sum, group) => sum + group.items.length,
  0,
);
const max = Math.max(...resumeStackGroups.map((group) => group.items.length));
const loadConstellation = () =>
  import("../three/TechConstellation").then(
    (module) => module.TechConstellation,
  );

function ConstellationFallback() {
  return (
    <div className="constellation-fallback">
      <span className="constellation-core" />
      {resumeStackGroups.map((group, index) => (
        <span
          key={group.id}
          className="constellation-node"
          style={{ ["--n" as string]: index }}
        >
          {short[group.id] ?? group.title}
        </span>
      ))}
    </div>
  );
}

export function HeroStack() {
  const focus = useSyncExternalStore(
    stackFocus.subscribe,
    stackFocus.get,
    () => null,
  );
  const setFocus = stackFocus.set;
  return (
    <div
      className="hero-stack"
      aria-labelledby="hero-stack-title"
      data-focus={focus ?? undefined}
    >
      <div className="hero-stack-heading">
        <h2 id="hero-stack-title">Stack</h2>
        <p>From interfaces and APIs to AI, data, and cloud delivery.</p>
        <div
          className="stack-filter"
          role="group"
          aria-label="Highlight a category"
        >
          {[
            { id: null, label: "All" },
            ...resumeStackGroups.map((group) => ({
              id: group.id as string | null,
              label: short[group.id] ?? group.title,
            })),
          ].map((option) => (
            <button
              type="button"
              key={option.label}
              aria-pressed={focus === option.id}
              onClick={() => setFocus(option.id)}
            >
              {focus === option.id && (
                <m.span
                  layoutId="stack-filter-indicator"
                  className="stack-filter-indicator"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="stack-ecosystem">
        <LazyScene
          className="stack-constellation"
          load={loadConstellation}
          fallback={<ConstellationFallback />}
        />
        <div className="stack-meter" data-reveal>
          <p className="stack-total">
            <strong>{total}</strong> technologies across six areas
          </p>
          <ul aria-label="Technologies per category">
            {resumeStackGroups.map((group) => (
              <li key={group.id}>
                <button
                  type="button"
                  aria-pressed={focus === group.id}
                  onClick={() => setFocus(focus === group.id ? null : group.id)}
                >
                  <span className="stack-meter-label">{group.title}</span>
                  <span className="stack-meter-count">
                    {group.items.length}
                  </span>
                  <span className="stack-meter-track" aria-hidden="true">
                    <span
                      className="stack-meter-fill"
                      style={{
                        ["--fill" as string]: group.items.length / max,
                      }}
                    />
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="stack-hint">
            Drag the sphere to explore; select a technology or area to highlight
            it.
          </p>
        </div>
      </div>
      <div className="hero-stack-grid" data-reveal-group>
        {resumeStackGroups.map((group) => (
          <article
            className="stack-category"
            key={group.id}
            aria-labelledby={`stack-${group.id}`}
            data-group={group.id}
            data-dimmed={focus && focus !== group.id ? "true" : undefined}
          >
            <header>
              <h3 id={`stack-${group.id}`}>{group.title}</h3>
              <span className="stack-count">{group.items.length}</span>
            </header>
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
