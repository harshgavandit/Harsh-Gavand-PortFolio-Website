import { useEffect, useState, type CSSProperties } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { ArrowDown, ArrowUpRight, Layers3, Minus, Plus } from "lucide-react";
import { caseStudies } from "../data/portfolio";
import { useMotionEnabled } from "./MotionPreferences";
import "./system-artifact.css";

const builds = [17, 14].map((id) =>
  caseStudies.find((s) => s.projectId === id)!,
);

/** A physical-looking diagram of published project notes, not simulated telemetry. */
export function SystemArtifact() {
  const [build, setBuild] = useState(0);
  const [selected, setSelected] = useState(2);
  const [exploded, setExploded] = useState(true);
  const motion = useMotionEnabled();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 90, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 90, damping: 24 });
  const study = builds[build];
  const diagram = study.diagram!;
  const contribution = study.contributions.find((_, i) =>
    diagram.chapterNodes[i].includes(selected),
  );
  useEffect(() => {
    if (!motion) {
      x.set(0);
      y.set(0);
    }
  }, [motion, x, y]);

  return (
    <div className="system-artifact" data-expanded={exploded}>
      <div className="artifact-heading">
        <span>
          <Layers3 size={14} aria-hidden="true" /> ANATOMY OF A BUILD
        </span>
        <span>FIG. {String(build + 1).padStart(2, "0")}</span>
      </div>
      <div
        className="artifact-builds"
        role="group"
        aria-label="Choose a system to inspect"
      >
        {builds.map((item, index) => (
          <button
            key={item.projectId}
            aria-pressed={build === index}
            onClick={() => {
              setBuild(index);
              setSelected(2);
            }}
          >
            {index === 0 ? "AI news digest" : "Creator platform"}
          </button>
        ))}
      </div>
      <div
        className="artifact-stage"
        onPointerMove={(event) => {
          if (!motion || event.pointerType !== "mouse") return;
          const rect = event.currentTarget.getBoundingClientRect();
          x.set(((event.clientY - rect.top) / rect.height - 0.5) * -3);
          y.set(((event.clientX - rect.left) / rect.width - 0.5) * 4);
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <span className="artifact-measure" aria-hidden="true">
          INPUT → TRANSFORM → DELIVERY
        </span>
        <m.div
          className="artifact-parallax"
          style={{
            rotateX: motion ? rotateX : 0,
            rotateY: motion ? rotateY : 0,
          }}
        >
          <div className="artifact-stack" aria-hidden="true">
            <div className="artifact-ground" />
            {diagram.nodes.map((node, i) => (
              <div
                key={i}
                className={`artifact-layer ${selected === i ? "is-selected" : ""}`}
                style={{ "--layer": i } as CSSProperties}
              >
                <div className="artifact-layer-face">
                  <span className="artifact-layer-index">0{i + 1}</span>
                  <strong>{node}</strong>
                  <span className="artifact-trace">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="artifact-layer-port" />
                </div>
              </div>
            ))}
          </div>
        </m.div>
        <div className="artifact-stage-footer">
          <span>Conceptual implementation model</span>
          <button
            onClick={() => setExploded(!exploded)}
            aria-pressed={exploded}
          >
            {exploded ? <Minus size={14} /> : <Plus size={14} />}
            {exploded ? "Assemble layers" : "Separate layers"}
          </button>
        </div>
      </div>
      <div
        className="artifact-node-picker"
        role="group"
        aria-label="Inspect implementation layers"
      >
        {diagram.nodes.map((node, i) => (
          <button
            key={node}
            aria-label={`Inspect ${node}`}
            title={node}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
            onKeyDown={(event) => {
              const next =
                event.key === "ArrowRight"
                  ? (i + 1) % diagram.nodes.length
                  : event.key === "ArrowLeft"
                    ? (i + diagram.nodes.length - 1) % diagram.nodes.length
                    : event.key === "Home"
                      ? 0
                      : event.key === "End"
                        ? diagram.nodes.length - 1
                        : -1;
              if (next >= 0) {
                event.preventDefault();
                setSelected(next);
                const buttons =
                  event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
                    "button",
                  );
                buttons?.item(next).focus();
              }
            }}
          >
            <span>0{i + 1}</span>
            <i aria-hidden="true" />
          </button>
        ))}
        <ArrowDown size={15} aria-hidden="true" />
      </div>
      <div className="artifact-note" aria-live="polite" aria-atomic="true">
        <span className="artifact-note-number">0{selected + 1}</span>
        <div>
          <h3>{diagram.nodes[selected]}</h3>
          <p>{contribution?.description}</p>
        </div>
      </div>
      <a className="artifact-case-link" href={`#project-${study.projectId}`}>
        <span>Inside {study.shortName}</span>
        <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </div>
  );
}
