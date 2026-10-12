import { useRef, useState, type KeyboardEvent } from "react";
import { m } from "framer-motion";
import {
  Braces,
  Cloud,
  Database,
  Layers3,
  Sparkles,
  Terminal,
  ArrowUpRight,
} from "lucide-react";
import { skills } from "../data/portfolio";
import { useMotionEnabled } from "./MotionPreferences";
import { Tags } from "./Primitives";

const icons = [Layers3, Braces, Database, Sparkles, Cloud, Terminal];
const descriptions = [
  "The experience layer",
  "The application layer",
  "The persistence layer",
  "The intelligence layer",
  "The delivery layer",
  "The developer workspace",
];

export function SkillExplorer() {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const enabled = useMotionEnabled();
  const Icon = icons[active];
  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % skills.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index + skills.length - 1) % skills.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = skills.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    buttons.current[next]?.focus();
  }
  return (
    <div className="skill-explorer">
      <div className="skill-explorer-top">
        <span className="eyebrow">A connected toolkit</span>
        <span>Choose a layer to explore ↗</span>
      </div>
      <div className="skill-explorer-layout">
        <div className="skill-map">
          <div className="skill-map-art" aria-hidden="true">
            <div className="skill-orbit orbit-one" />
            <div className="skill-orbit orbit-two" />
            <m.div
              className="skill-core"
              animate={{
                rotateY: enabled ? active * 8 - 20 : -20,
                rotateX: enabled ? 15 : 0,
              }}
              transition={{ duration: enabled ? 0.7 : 0 }}
            >
              <span>hg.</span>
              <i />
              <b />
            </m.div>
            <span className="skill-map-caption">ONE PRODUCT. EVERY LAYER.</span>
          </div>
          <div
            className="skill-nodes"
            role="tablist"
            aria-label="Engineering skill categories"
          >
            {skills.map((skill, index) => {
              const NodeIcon = icons[index];
              return (
                <button
                  key={skill.title}
                  ref={(el) => {
                    buttons.current[index] = el;
                  }}
                  role="tab"
                  id={`skill-tab-${index}`}
                  aria-controls={`skill-panel-${index}`}
                  aria-selected={active === index}
                  tabIndex={active === index ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => navigate(event, index)}
                  className={`skill-node node-${index}`}
                >
                  <NodeIcon size={20} aria-hidden="true" />
                  <span>{skill.title}</span>
                  <small>0{index + 1}</small>
                </button>
              );
            })}
          </div>
        </div>
        <div className="skill-panel-space">
          {skills.map((skill, index) => (
            <m.div
              key={skill.title}
              id={`skill-panel-${index}`}
              role="tabpanel"
              aria-labelledby={`skill-tab-${index}`}
              hidden={active !== index}
              tabIndex={0}
              className="skill-panel"
              initial={false}
              animate={
                active === index && enabled
                  ? { opacity: [0.6, 1], x: [14, 0] }
                  : { opacity: 1, x: 0 }
              }
              transition={{ duration: 0.4 }}
            >
              <div className="skill-panel-icon">
                <Icon size={30} aria-hidden="true" />
                <span>0{index + 1} / 06</span>
              </div>
              <p className="eyebrow">{descriptions[index]}</p>
              <h3>{skill.title}</h3>
              <p className="skill-panel-description">{skill.description}</p>
              <Tags items={skill.items} />
              <a className="text-link" href="#projects">
                See the tools in practice{" "}
                <ArrowUpRight size={16} aria-hidden="true" />
              </a>
            </m.div>
          ))}
        </div>
      </div>
      <details className="skill-inventory">
        <summary>
          Browse the complete toolkit <span aria-hidden="true">+</span>
        </summary>
        <div>
          {skills.map((skill) => (
            <div key={skill.title}>
              <h4>{skill.title}</h4>
              <Tags items={skill.items} />
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
