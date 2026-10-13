import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { ArrowRight, Box, Pause, Play, RotateCcw } from "lucide-react";
import { caseStudies, type Project } from "../data/portfolio";
import { useMotionEnabled } from "./MotionPreferences";

export function ProjectArchitecture({ project }: { project: Project }) {
  const study = caseStudies.find((item) => item.projectId === project.id);
  const nodes =
    study?.diagram?.nodes ??
    study?.contributions.map((item) => item.label) ??
    project.technologies;
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const host = useRef<HTMLDivElement>(null);
  const visible = useInView(host);
  const motion = useMotionEnabled();
  useEffect(() => {
    if (!playing || !motion || !visible) return;
    let timer: number | undefined;
    const sync = () => {
      window.clearInterval(timer);
      if (!document.hidden)
        timer = window.setInterval(
          () => setActive((n) => (n + 1) % nodes.length),
          1800,
        );
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [playing, motion, visible, nodes.length]);
  const contribution = study?.diagram
    ? study.contributions.find((_, i) =>
        study.diagram!.chapterNodes[i]?.includes(active),
      )
    : study?.contributions[active];
  return (
    <div className="architecture-explorer" ref={host}>
      <div className="architecture-toolbar">
        <div>
          <span className="lab-micro">
            {study ? "IMPLEMENTATION MAP" : "TECHNOLOGY MAP"}
          </span>
          <h4>
            {study?.diagram?.title ??
              (study ? "Inside the build" : "The project stack")}
          </h4>
        </div>
        <div className="architecture-actions">
          <button
            onClick={() => {
              setPlaying(false);
              setActive(0);
            }}
            aria-label="Reset architecture exploration"
          >
            <RotateCcw size={15} />
          </button>
          <button
            aria-pressed={playing && motion}
            disabled={!motion}
            onClick={() => setPlaying(!playing)}
          >
            {playing && motion ? <Pause size={14} /> : <Play size={14} />}
            {playing && motion ? "Pause tour" : "Tour map"}
          </button>
        </div>
      </div>
      <div
        className="architecture-canvas"
        role="group"
        aria-label={`${project.title} implementation nodes`}
      >
        <div className="architecture-path" aria-hidden="true" />
        {nodes.map((node, index) => (
          <button
            key={node}
            className={`architecture-node ${index === active ? "is-active" : ""}`}
            aria-pressed={index === active}
            onClick={() => {
              setPlaying(false);
              setActive(index);
            }}
          >
            <span className="node-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <Box size={23} aria-hidden="true" />
            <strong>{node}</strong>
            <ArrowRight size={14} className="node-arrow" aria-hidden="true" />
          </button>
        ))}
      </div>
      <div
        className="architecture-inspector"
        aria-live={playing ? "off" : "polite"}
      >
        <span className="node-inspector-icon">
          <Box size={20} aria-hidden="true" />
        </span>
        <div>
          <span className="lab-micro">
            SELECTED / {String(active + 1).padStart(2, "0")}
          </span>
          <h4>{nodes[active]}</h4>
          <p>
            {contribution?.description ??
              `${nodes[active]} is listed in this project's published technology stack. Explore the source for its implementation.`}
          </p>
        </div>
      </div>
      <p className="architecture-caption">
        {study
          ? "Conceptual map from published project notes. Select a node to inspect the work."
          : "Technologies from the project record; connections group the stack, not a verified request sequence."}
      </p>
    </div>
  );
}
