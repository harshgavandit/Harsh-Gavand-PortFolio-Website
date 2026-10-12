import { useEffect, useRef, useState } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Braces, Layers3, Sparkles, RotateCcw } from "lucide-react";
import { useMotionEnabled } from "./MotionPreferences";
import type { StudioRenderer } from "./studioRenderer";

const disciplines = [
  {
    name: "Interface",
    icon: Layers3,
    detail: "Thoughtful interfaces. Human experiences.",
    stack: "React / TypeScript / Responsive UI",
  },
  {
    name: "Systems",
    icon: Braces,
    detail: "Reliable APIs. Connected systems.",
    stack: "Python / Node.js / Databases",
  },
  {
    name: "Applied AI",
    icon: Sparkles,
    detail: "Intelligent workflows. Practical outcomes.",
    stack: "LLMs / Automation / AI integrations",
  },
];

export function StudioScene() {
  const host = useRef<HTMLDivElement>(null);
  const composition = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: composition,
    offset: ["start start", "end start"],
  });
  const parallax = useTransform(scrollYProgress, [0, 1], [0, 45]);
  const renderer = useRef<StudioRenderer>();
  const enabled = useMotionEnabled();
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const current = useRef({ enabled, active });
  useEffect(() => {
    current.current = { enabled, active };
    renderer.current?.update(enabled, active);
  }, [enabled, active]);
  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;
    let timer: number | undefined;
    // Load only near the viewport; deep links need not download the 3D engine.
    const load = () => {
      timer = window.setTimeout(() => {
        void import("./studioRenderer")
          .then(({ createStudio }) => {
            if (cancelled || !host.current) return;
            try {
              const instance = createStudio(host.current, () =>
                setReady(false),
              );
              renderer.current = instance;
              cleanup = instance.dispose;
              instance.update(current.current.enabled, current.current.active);
              setReady(true);
            } catch {
              setReady(false);
            }
          })
          .catch(() => {
            if (!cancelled) setReady(false);
          });
      }, 150);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "180px" },
    );
    if (host.current) observer.observe(host.current);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      observer.disconnect();
      cleanup?.();
      renderer.current = undefined;
    };
  }, []);
  return (
    <m.div
      ref={composition}
      className="studio"
      style={{ y: enabled ? parallax : 0 }}
      data-scene={ready ? "webgl" : "fallback"}
    >
      <div className="studio-topline">
        <span>
          <i /> THE ENGINEERING STUDIO
        </span>
        <span>HG / 01</span>
      </div>
      <div className="studio-visual">
        <div className="studio-grid" aria-hidden="true" />
        <div className="studio-fallback" aria-hidden="true">
          <div className="fallback-orbit" />
          <div className="fallback-core">
            hg<span>.</span>
          </div>
          <div className="fallback-slab slab-one" />
          <div className="fallback-slab slab-two" />
        </div>
        <div className="studio-canvas" ref={host} aria-hidden="true" />
        <span className="studio-label label-top" aria-hidden="true">
          <Layers3 size={15} /> Interface
        </span>
        <span className="studio-label label-bottom" aria-hidden="true">
          <Braces size={15} /> Systems
        </span>
        <span className="studio-label label-right" aria-hidden="true">
          <Sparkles size={15} /> Intelligence
        </span>
        <div className="studio-coordinate" aria-hidden="true">
          IDEA → SYSTEM → EXPERIENCE
        </div>
        <button
          className="studio-reset"
          onClick={() => renderer.current?.reset()}
          aria-label="Reset 3D view"
          disabled={!ready}
        >
          <RotateCcw size={15} />
        </button>
      </div>
      <div
        className="studio-controls"
        role="group"
        aria-label="Explore engineering disciplines"
      >
        {disciplines.map(({ name, icon: Icon }, index) => (
          <button
            key={name}
            aria-pressed={active === index}
            onClick={() => setActive(index)}
          >
            <Icon size={15} aria-hidden="true" />
            <span>{name}</span>
          </button>
        ))}
      </div>
      <div className="studio-caption" aria-live="polite">
        <strong>{disciplines[active].detail}</strong>
        <span>{disciplines[active].stack}</span>
      </div>
      <p className="studio-hint">
        {ready && enabled
          ? "Move your pointer to explore · Select a layer above"
          : "Explore the layers of my work"}
      </p>
    </m.div>
  );
}
