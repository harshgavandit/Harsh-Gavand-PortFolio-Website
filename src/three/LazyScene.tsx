import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { useMotionEnabled } from "../components/MotionPreferences";

export type SceneProps = { active: boolean; onReady: () => void };

let webgl: boolean | undefined;
function supportsWebGL() {
  if (webgl !== undefined) return webgl;
  try {
    const canvas = document.createElement("canvas");
    webgl = !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    webgl = false;
  }
  return webgl;
}

function canRunScenes(minWidth: number) {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection;
  return (
    !connection?.saveData &&
    window.matchMedia(`(min-width: ${minWidth}px)`).matches &&
    supportsWebGL()
  );
}

/*
 * Mounts a WebGL scene only when its slot approaches the viewport, on capable
 * screens, with motion allowed. The `fallback` (static HTML/CSS) is what the
 * pre-renderer emits and what phones, reduced-motion visitors and browsers
 * without WebGL keep. Once loaded, the scene receives `active` so it can stop
 * rendering whenever it scrolls out of view.
 */
export function LazyScene({
  load,
  fallback,
  className,
  minWidth = 1024,
  label,
}: {
  load: () => Promise<ComponentType<SceneProps>>;
  fallback?: ReactNode;
  className: string;
  minWidth?: number;
  label?: string;
}) {
  const motion = useMotionEnabled();
  const slot = useRef<HTMLDivElement>(null);
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = slot.current;
    if (!element || !motion || !canRunScenes(minWidth)) return;
    let loading = false;
    let cancelled = false;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || loading) return;
        loading = true;
        near.disconnect();
        load()
          .then((component) => {
            if (!cancelled) setScene(() => component);
          })
          .catch(() => {
            /* The fallback stays in place. */
          });
      },
      { rootMargin: "400px 0px" },
    );
    const visible = new IntersectionObserver(([entry]) =>
      setActive(entry.isIntersecting),
    );
    near.observe(element);
    visible.observe(element);
    return () => {
      cancelled = true;
      near.disconnect();
      visible.disconnect();
    };
  }, [motion, minWidth, load]);

  return (
    <div
      ref={slot}
      className={`${className} lazy-scene${ready ? " is-live" : ""}`}
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {fallback && <div className="lazy-scene-fallback">{fallback}</div>}
      {Scene && (
        <div className="lazy-scene-canvas">
          <Scene active={active} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  );
}
