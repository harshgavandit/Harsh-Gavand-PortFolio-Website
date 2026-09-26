import { useEffect, useRef, useState } from "react";
import { m } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Check,
  Code2,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import type { CaseStudy, Project } from "../data/portfolio";
import { DepthSurface } from "./DepthSurface";
import { useMotionEnabled } from "./MotionPreferences";
import "./project-walkthrough.css";

const CHAPTER_DURATION = 4800;

export function ProjectWalkthrough({
  study,
  project,
}: {
  study: CaseStudy;
  project: Project;
}) {
  const enabled = useMotionEnabled();
  const [chapter, setChapter] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [finished, setFinished] = useState(false);
  const figureRef = useRef<HTMLElement>(null);
  const current = study.contributions[chapter];
  const panelId = `walkthrough-panel-${project.id}`;
  const count = study.contributions.length;

  useEffect(() => {
    if (!enabled) setPlaying(false);
  }, [enabled]);

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.2)
          setPlaying(false);
      },
      { threshold: [0, 0.2] },
    );
    const pauseHidden = () => {
      if (document.hidden) setPlaying(false);
    };
    observer.observe(figure);
    document.addEventListener("visibilitychange", pauseHidden);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", pauseHidden);
    };
  }, []);

  useEffect(() => {
    if (!playing || !enabled) return;
    const timer = window.setTimeout(() => {
      if (chapter < count - 1) setChapter((value) => value + 1);
      else {
        setPlaying(false);
        setFinished(true);
      }
    }, CHAPTER_DURATION);
    return () => window.clearTimeout(timer);
  }, [chapter, count, enabled, playing]);

  function selectChapter(index: number) {
    setPlaying(false);
    setFinished(false);
    setChapter(index);
  }

  function togglePlayback() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (finished || chapter === count - 1) setChapter(0);
    setFinished(false);
    setPlaying(true);
  }

  return (
    <figure
      ref={figureRef}
      className={`project-visual project-walkthrough ${study.image ? "has-screenshot" : "has-diagram"}`}
    >
      <div className="walkthrough-heading">
        <span>
          <span className="walkthrough-indicator" aria-hidden="true" /> Inside
          the build
        </span>
        <span>
          0{chapter + 1} / 0{count}
        </span>
      </div>
      <DepthSurface className="walkthrough-depth">
        <div className="browser-frame walkthrough-frame">
          <div className="browser-chrome">
            <span className="window-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>
              {study.image && project.demoUrl
                ? new URL(project.demoUrl).hostname
                : "ENGINEERING / SYSTEM OVERVIEW"}
            </span>
            <ArrowUpRight size={13} aria-hidden="true" />
          </div>
          {study.image ? (
            <div className="walkthrough-screen">
              <m.img
                src={`/projects/${study.image}-1280.webp`}
                srcSet={`/projects/${study.image}-640.webp 640w, /projects/${study.image}-1280.webp 1280w`}
                sizes="(min-width: 1000px) 55vw, 100vw"
                width="1280"
                height="722"
                alt={study.imageAlt}
                loading="lazy"
                decoding="async"
                animate={{ scale: enabled ? 1 + chapter * 0.016 : 1 }}
                transition={{
                  duration: enabled ? 1 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
              <span className="walkthrough-capture-label">
                ACTUAL PROJECT CAPTURE
              </span>
            </div>
          ) : (
            <div className="pipeline-visual walkthrough-pipeline">
              <div className="pipeline-heading">
                <Code2 size={22} aria-hidden="true" />
                <span>{study.diagram?.title}</span>
              </div>
              <ol>
                {study.diagram?.nodes.map((node, index, nodes) => {
                  const active =
                    study.diagram?.chapterNodes[chapter]?.includes(index);
                  return (
                    <li key={node} className={active ? "pipeline-active" : ""}>
                      <span className="pipeline-step">0{index + 1}</span>
                      <span>{node}</span>
                      {index < nodes.length - 1 ? (
                        <ArrowDown size={14} aria-hidden="true" />
                      ) : (
                        <Check size={15} aria-hidden="true" />
                      )}
                    </li>
                  );
                })}
              </ol>
              <span className="pipeline-note">IMPLEMENTATION MAP</span>
            </div>
          )}
        </div>
      </DepthSurface>
      <div
        className="walkthrough-chapters"
        role="group"
        aria-label={`${study.shortName} contribution chapters`}
      >
        {study.contributions.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={chapter === index}
            aria-controls={panelId}
            onClick={() => selectChapter(index)}
          >
            <span className="walkthrough-chapter-number">0{index + 1}</span>
            <span>{item.label}</span>
            {playing && chapter === index && (
              <m.span
                className="walkthrough-progress"
                aria-hidden="true"
                key={`${chapter}-progress`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: CHAPTER_DURATION / 1000,
                  ease: "linear",
                }}
              />
            )}
          </button>
        ))}
      </div>
      <div
        id={panelId}
        className="walkthrough-detail"
        aria-live={playing ? "off" : "polite"}
        aria-atomic="true"
      >
        <m.div
          key={chapter}
          initial={enabled ? { opacity: 0.4, y: 7 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: enabled ? 0.4 : 0 }}
        >
          <span className="walkthrough-detail-label">
            MY CONTRIBUTION / {current.label}
          </span>
          <p>{current.description}</p>
        </m.div>
      </div>
      <div className="walkthrough-playback">
        <button
          type="button"
          onClick={togglePlayback}
          disabled={!enabled}
          aria-label={`${playing ? "Pause" : finished ? "Replay" : "Play"} walkthrough for ${study.shortName}`}
          aria-controls={panelId}
        >
          {playing ? (
            <Pause size={13} aria-hidden="true" />
          ) : finished ? (
            <RotateCcw size={13} aria-hidden="true" />
          ) : (
            <Play size={13} aria-hidden="true" />
          )}
          {playing
            ? "Pause walkthrough"
            : finished
              ? "Replay walkthrough"
              : "Play walkthrough"}
        </button>
        <span>
          {!enabled
            ? "Select a chapter to explore"
            : playing
              ? "Playing · 3 chapters"
              : finished
                ? "Walkthrough complete"
                : "Explore how I built it"}
        </span>
      </div>
      <figcaption>
        {study.image
          ? `Actual project screenshot${project.id === 1 ? " · sign-in required" : " · public landing page"}. Chapters describe my contribution.`
          : study.diagram?.caption}
      </figcaption>
    </figure>
  );
}
