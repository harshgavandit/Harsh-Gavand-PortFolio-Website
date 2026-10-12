import { useRef, useState } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Braces, Layers3, Sparkles, ArrowUpRight } from "lucide-react";
import { useMotionEnabled } from "./MotionPreferences";

const layers = [
  {
    name: "The experience.",
    tag: "01 / INTERFACE",
    icon: Layers3,
    text: "Interfaces that make complex products feel simple. Responsive, accessible, and considered down to the last interaction.",
    stack: "React · Next.js · TypeScript",
  },
  {
    name: "The foundation.",
    tag: "02 / SYSTEMS",
    icon: Braces,
    text: "The structure behind the experience. Clear APIs, deliberate data models, and connected services that make the product work.",
    stack: "Python · Django · Node.js · SQL",
  },
  {
    name: "The intelligence.",
    tag: "03 / APPLIED AI",
    icon: Sparkles,
    text: "AI with a useful role. From agent workflows and content generation to automations that connect information with action.",
    stack: "LLMs · FastAPI · LangChain",
  },
];

export function EngineeringBridge() {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const enabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotation = useTransform(scrollYProgress, [0, 1], [-12, 12]);
  const lift = useTransform(scrollYProgress, [0, 0.5, 1], [25, 0, -25]);
  return (
    <section
      id="engineering"
      ref={ref}
      className="engineering-bridge section-container"
      aria-labelledby="engineering-title"
    >
      <div className="bridge-intro">
        <span className="eyebrow">ONE MINDSET. EVERY LAYER.</span>
        <h2 id="engineering-title">
          Beautiful outside.
          <br />
          <span>Thoughtful inside.</span>
        </h2>
        <p>
          Good software happens where design, engineering, and intelligence
          meet.
        </p>
        <a href="#projects" className="text-link">
          See it in the work <ArrowUpRight size={17} aria-hidden="true" />
        </a>
      </div>
      <div className="anatomy-exhibit">
        <m.div
          className="anatomy-stack"
          style={{ rotateY: enabled ? rotation : 0, y: enabled ? lift : 0 }}
          aria-hidden="true"
        >
          {[2, 1, 0].map((i) => {
            const Icon = layers[i].icon;
            return (
              <div
                key={i}
                className={`anatomy-plate plate-${i} ${active === i ? "is-active" : ""}`}
              >
                <span>HG / {layers[i].tag}</span>
                <Icon size={40} />
                <div className="plate-traces">
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            );
          })}
        </m.div>
        <div
          className="anatomy-controls"
          role="group"
          aria-label="Explore the product layers"
        >
          {layers.map((layer, i) => (
            <button
              key={layer.tag}
              aria-pressed={active === i}
              onClick={() => setActive(i)}
            >
              <span aria-hidden="true">0{i + 1}</span>
              {["Interface", "Systems", "Applied AI"][i]}
            </button>
          ))}
        </div>
        <div className="anatomy-caption" aria-live="polite">
          <h3>{layers[active].name}</h3>
          <p>{layers[active].text}</p>
          <span>{layers[active].stack}</span>
        </div>
      </div>
    </section>
  );
}
