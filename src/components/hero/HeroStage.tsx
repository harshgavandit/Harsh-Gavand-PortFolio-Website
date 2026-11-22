import { useEffect, useState, type ComponentType } from "react";
import { useMotionEnabled } from "../MotionPreferences";
import { heroNodes } from "./heroNodes";

type SceneProps = { onReady: () => void };

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// The interactive scene is a separate chunk (three.js + React Three Fiber).
// It only loads on tablet/desktop screens with WebGL, when the visitor has not
// asked for reduced motion or reduced data. Everyone else keeps the
// lightweight CSS composition below, which is also what pre-rendering emits.
export function HeroStage() {
  const motion = useMotionEnabled();
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!motion) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (connection?.saveData) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    if (!supportsWebGL()) return;
    let cancelled = false;
    const load = () =>
      import("./HeroScene")
        .then((module) => {
          if (!cancelled) setScene(() => module.HeroScene);
        })
        .catch(() => {
          /* Keep the static composition. */
        });
    const hasIdle = "requestIdleCallback" in window;
    const handle = hasIdle
      ? window.requestIdleCallback(load, { timeout: 1200 })
      : window.setTimeout(load, 250);
    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
    };
  }, [motion]);

  return (
    <div className={`hero-stage${ready ? " is-live" : ""}`} aria-hidden="true">
      <div className="hero-backdrop">
        <span className="hero-glow hero-glow-a" />
        <span className="hero-glow hero-glow-b" />
        <span className="hero-grid" />
      </div>
      <div className="hero-fallback">
        <svg className="hero-orbits" viewBox="0 0 600 600" focusable="false">
          <defs>
            <linearGradient id="hero-orbit-stroke" x1="0" x2="1">
              <stop offset="0" stopColor="#1d5bd8" stopOpacity="0.05" />
              <stop offset="0.5" stopColor="#1d5bd8" stopOpacity="0.45" />
              <stop offset="1" stopColor="#38bdf8" stopOpacity="0.05" />
            </linearGradient>
          </defs>
          <ellipse cx="300" cy="300" rx="150" ry="58" />
          <ellipse cx="300" cy="300" rx="215" ry="92" />
          <ellipse cx="300" cy="300" rx="278" ry="122" />
        </svg>
        <span className="hero-core">
          <span className="hero-core-inner" />
        </span>
        {heroNodes.map((node, index) => (
          <span
            className="orbit-chip"
            key={node.label}
            style={{ ["--n" as string]: index }}
          >
            {node.brand ? (
              <svg viewBox="0 0 24 24" width={16} height={16} focusable="false">
                <use href={`/stack/technology-logos.svg#${node.brand}`} />
              </svg>
            ) : (
              <b>{node.glyph}</b>
            )}
            {node.label}
          </span>
        ))}
      </div>
      {Scene && (
        <div className="hero-canvas">
          <Scene onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
