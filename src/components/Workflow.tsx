import { m, useMotionValueEvent, useScroll } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Check,
  CloudUpload,
  Database,
  Layers3,
  Lightbulb,
  MousePointer2,
  Pause,
  Play,
  ShieldCheck,
} from "lucide-react";
import { useRef, useState, type KeyboardEvent } from "react";
import { workflow } from "../data/portfolio";
import { SectionHeading } from "./Primitives";
import { useMotionEnabled } from "./MotionPreferences";
import "./workflow.css";

const stages = [
  { name: "Idea", label: "Find the useful outcome", icon: Lightbulb },
  { name: "Design", label: "Give the idea a structure", icon: Layers3 },
  { name: "Development", label: "Make the interface tangible", icon: Braces },
  { name: "Backend / APIs", label: "Connect the moving parts", icon: Database },
  { name: "Testing", label: "Explore the paths between", icon: ShieldCheck },
  { name: "Deployment", label: "Deliver. Then verify.", icon: CloudUpload },
];

function ProductScene({ stage, reduce }: { stage: number; reduce: boolean }) {
  return (
    <div
      className="build-scene"
      data-stage={stage}
      data-reduced={reduce}
      aria-hidden="true"
    >
      <div className="build-scene-grid" />
      <div className="build-scene-axis build-scene-axis-x" />
      <div className="build-scene-axis build-scene-axis-y" />
      <span className="build-scene-origin">PRODUCT / SYSTEM VIEW</span>
      <div className="build-system">
        <m.div
          className={`build-data-layer ${stage >= 3 ? "is-connected" : ""}`}
          animate={{
            y: reduce ? 0 : stage >= 3 ? 22 : 4,
            opacity: stage >= 3 ? 1 : 0.38,
          }}
          transition={{ duration: reduce ? 0 : 0.65 }}
        >
          <span>
            <Database size={17} /> Data model
          </span>
          <span className="build-layer-lines">
            <i />
            <i />
            <i />
          </span>
        </m.div>
        <m.div
          className={`build-api-layer ${stage >= 3 ? "is-connected" : ""}`}
          animate={{
            y: reduce ? 0 : stage >= 3 ? -3 : 9,
            opacity: stage >= 3 ? 1 : 0.42,
          }}
          transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.05 }}
        >
          <span>
            <Braces size={17} /> API contract
          </span>
          <span className="build-contract">
            request <ArrowUpRight size={13} /> response
          </span>
        </m.div>
        <m.div
          className="build-interface-layer"
          animate={{ y: reduce ? 0 : stage >= 3 ? -26 : 0 }}
          transition={{ duration: reduce ? 0 : 0.65 }}
        >
          <div className="build-browser-bar">
            <span>
              <i />
              <i />
              <i />
            </span>
            <span>Product interface</span>
            <Layers3 size={12} />
          </div>
          <div className={`build-wireframe ${stage >= 2 ? "is-built" : ""}`}>
            <div className="build-wireframe-nav">
              <span />
              <span />
              <span />
            </div>
            <div className="build-wireframe-main">
              <span className="build-wireframe-heading" />
              <span className="build-wireframe-copy" />
              <div className="build-wireframe-cards">
                <i />
                <i />
                <i />
              </div>
              <span className="build-wireframe-action">
                <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
          {stage === 0 && (
            <m.div
              className="build-idea-note"
              initial={reduce ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.4 }}
            >
              <Lightbulb size={22} />
              <strong>Start with why.</strong>
              <span>User → problem → outcome</span>
            </m.div>
          )}
          {stage === 2 && <MousePointer2 className="build-pointer" size={24} />}
          {stage >= 4 && (
            <m.div
              className="build-quality-note"
              initial={reduce ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: reduce ? 0 : 0.4 }}
            >
              {stage === 4 ? (
                <ShieldCheck size={19} />
              ) : (
                <CloudUpload size={19} />
              )}
              <span>
                {stage === 4
                  ? "Journeys · edge cases · errors"
                  : "Environment → release → verify"}
              </span>
            </m.div>
          )}
        </m.div>
      </div>
      <div className="build-scene-caption">
        <span className="build-scene-dot" />
        <span>Conceptual build sequence</span>
        <span>0{stage + 1} / 06</span>
      </div>
    </div>
  );
}

export function Workflow() {
  const storyRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const manualRef = useRef(false);
  const [active, setActive] = useState(0);
  const [following, setFollowing] = useState(true);
  const enabled = useMotionEnabled();
  const reduce = !enabled;
  const followsScroll = following && enabled;
  const { scrollYProgress } = useScroll({
    target: storyRef,
    offset: ["start center", "end center"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (enabled && !manualRef.current) {
      setActive(
        Math.min(stages.length - 1, Math.floor(progress * stages.length)),
      );
    }
  });

  function chooseStage(index: number, focusPreview = false) {
    manualRef.current = true;
    setFollowing(false);
    setActive(index);
    if (focusPreview) {
      buttonRefs.current[index]?.focus({ preventScroll: true });
      buttonRefs.current[index]?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "center",
      });
    }
  }

  function handleStageKey(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next: number | undefined;
    if (event.key === "ArrowRight" || event.key === "ArrowDown")
      next = (index + 1) % stages.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp")
      next = (index - 1 + stages.length) % stages.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = stages.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      chooseStage(next);
      buttonRefs.current[next]?.focus();
    }
  }

  function toggleScroll() {
    const shouldFollow = !following;
    manualRef.current = !shouldFollow;
    setFollowing(shouldFollow);
    if (shouldFollow) {
      setActive(
        Math.min(
          stages.length - 1,
          Math.floor(scrollYProgress.get() * stages.length),
        ),
      );
    }
  }

  return (
    <section
      id="workflow"
      className="section craft-workflow"
      aria-labelledby="workflow-title"
      tabIndex={-1}
    >
      <div className="section-container">
        <SectionHeading
          number="06"
          label="How I work"
          title={
            <span id="workflow-title">
              Thoughtful at every step.
              <br />
              <span className="muted-heading">
                From idea to something real.
              </span>
            </span>
          }
          description="A deliberate path from understanding a problem to delivering a working product."
        />
        <div className="build-story" ref={storyRef}>
          <div className="build-stage">
            <div className="build-stage-topline">
              <span className="eyebrow">The making of a product</span>
              <button
                type="button"
                className="build-scroll-control"
                onClick={toggleScroll}
                disabled={!enabled}
                aria-pressed={!followsScroll}
              >
                {followsScroll ? (
                  <Pause size={12} aria-hidden="true" />
                ) : (
                  <Play size={12} aria-hidden="true" />
                )}
                {!enabled
                  ? "Scroll motion paused"
                  : followsScroll
                    ? "Pause scroll story"
                    : "Resume scroll story"}
              </button>
            </div>
            <ProductScene stage={active} reduce={reduce} />
            <div
              className="build-stage-navigation"
              role="group"
              aria-label="Explore the six workflow stages"
            >
              {stages.map((stage, index) => (
                <button
                  key={stage.name}
                  ref={(element) => {
                    buttonRefs.current[index] = element;
                  }}
                  type="button"
                  className={active === index ? "is-active" : ""}
                  aria-pressed={active === index}
                  aria-label={`Explore ${stage.name}, stage ${index + 1} of 6`}
                  onClick={() => chooseStage(index)}
                  onKeyDown={(event) => handleStageKey(event, index)}
                >
                  <stage.icon size={16} aria-hidden="true" />
                  <span>{stage.name}</span>
                </button>
              ))}
            </div>
            <div className="build-active-caption">
              <span className="eyebrow">
                0{active + 1} / {stages[active].name}
              </span>
              <p>{stages[active].label}</p>
              <span className="build-story-hint">
                {followsScroll ? (
                  <>
                    <ArrowDown size={12} aria-hidden="true" /> Scroll through
                    the process or choose a stage.
                  </>
                ) : (
                  <>
                    <Check size={12} aria-hidden="true" /> You’re exploring.
                    Scroll story is paused.
                  </>
                )}
              </span>
            </div>
            <p className="sr-only" role="status">
              {followsScroll
                ? "Workflow follows scroll position."
                : `Exploring ${stages[active].name}. Scroll control paused.`}
            </p>
          </div>
          <ol className="build-story-steps">
            {workflow.map(([title, detail], index) => {
              const Icon = stages[index].icon;
              return (
                <li key={title} className={active === index ? "is-active" : ""}>
                  <span className="build-step-marker" aria-hidden="true">
                    <Icon size={17} />
                  </span>
                  <div>
                    <span className="eyebrow">
                      0{index + 1} /{" "}
                      {index === 1 ? "Design / Architecture" : title}
                    </span>
                    <h3>{stages[index].label}</h3>
                    <p>{detail}</p>
                    <button
                      type="button"
                      className="build-step-explore"
                      onClick={() => chooseStage(index, true)}
                      aria-label={`Show ${stages[index].name} in the build sequence`}
                    >
                      Explore this step{" "}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
