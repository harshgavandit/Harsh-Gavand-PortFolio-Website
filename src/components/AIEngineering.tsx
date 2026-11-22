import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { aiFlows, aiFoundations, type AIFlow } from "../data/aiEngineering";
import { projects } from "../data/portfolio";
import { displayProject } from "../data/informaPresentation";
import { nextTabIndex } from "../lib/interaction";
import { useMotionEnabled } from "./MotionPreferences";

function FlowProjects({ flow }: { flow: AIFlow }) {
  return (
    <ul className="flow-projects" aria-label="Built in">
      {flow.projects.map((slug) => {
        const record = projects.find((project) => project.slug === slug);
        if (!record) return null;
        const project = displayProject(record);
        return (
          <li key={slug}>
            <a href={`/work/${slug}/`} className="flow-project">
              <span>{project.title.split(" — ")[0]}</span>
              <span className="flow-project-meta">
                Case study <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function FlowPanel({
  flow,
  active,
  hidden,
}: {
  flow: AIFlow;
  active: boolean;
  hidden: boolean;
}) {
  const motion = useMotionEnabled();
  const [stage, setStage] = useState(0);
  const [pinned, setPinned] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = panel.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Walk through the pipeline automatically until the visitor picks a stage.
  useEffect(() => {
    if (!motion || pinned || !active || !inView) return;
    const timer = window.setInterval(
      () => setStage((value) => (value + 1) % flow.stages.length),
      2600,
    );
    return () => window.clearInterval(timer);
  }, [motion, pinned, active, inView, flow.stages.length]);

  const current = flow.stages[stage];
  return (
    <div
      ref={panel}
      className="flow-panel"
      role="tabpanel"
      id={`flow-panel-${flow.id}`}
      aria-labelledby={`flow-tab-${flow.id}`}
      hidden={hidden}
      tabIndex={0}
    >
      <div className="flow-header">
        <h4>{flow.title}</h4>
        <p>{flow.summary}</p>
      </div>
      <ol
        className="flow-pipeline"
        style={{ ["--stages" as string]: flow.stages.length }}
      >
        {flow.stages.map((item, index) => (
          <li
            key={item.title}
            className={`flow-stage${index === stage ? " is-active" : ""}${index < stage ? " is-done" : ""}`}
          >
            <button
              type="button"
              aria-pressed={index === stage}
              onClick={() => {
                setStage(index);
                setPinned(true);
              }}
            >
              <span className="flow-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flow-stage-title">{item.title}</span>
              <span className="flow-stage-tech">{item.tech.join(" · ")}</span>
            </button>
            <p className="flow-stage-detail">{item.detail}</p>
            {index < flow.stages.length - 1 && (
              <span className="flow-link" aria-hidden="true">
                <span className="flow-packet" />
              </span>
            )}
          </li>
        ))}
      </ol>
      <div className="flow-inspector" aria-live={pinned ? "polite" : "off"}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={current.title}
            className="flow-inspector-body"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <span className="eyebrow">
              Stage {stage + 1} of {flow.stages.length}
            </span>
            <h5>{current.title}</h5>
            <p>{current.detail}</p>
          </m.div>
        </AnimatePresence>
        <div className="flow-built-in">
          <span className="eyebrow">Running in</span>
          <FlowProjects flow={flow} />
        </div>
      </div>
    </div>
  );
}

export function AIEngineering() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="ai-engineering" id="ai-engineering" data-reveal>
      <div className="ai-engineering-head">
        <div>
          <span className="eyebrow">AI engineering</span>
          <h3>LLM systems, wired like production software.</h3>
        </div>
        <ul className="ai-foundations" aria-label="Shared foundations">
          {aiFoundations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="flow-tabs" role="tablist" aria-label="AI system types">
        {aiFlows.map((flow, index) => (
          <button
            key={flow.id}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            id={`flow-tab-${flow.id}`}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={`flow-panel-${flow.id}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const next = nextTabIndex(event.key, index, aiFlows.length);
              if (next === null) return;
              event.preventDefault();
              setActive(next);
              tabs.current[next]?.focus();
            }}
          >
            {active === index && (
              <m.span
                layoutId="flow-tab-indicator"
                className="flow-tab-indicator"
                transition={{ type: "spring", stiffness: 420, damping: 36 }}
              />
            )}
            <span className="flow-tab-label">{flow.tab}</span>
          </button>
        ))}
      </div>
      {aiFlows.map((flow, index) => (
        <FlowPanel
          key={flow.id}
          flow={flow}
          active={active === index}
          hidden={active !== index}
        />
      ))}
    </div>
  );
}
