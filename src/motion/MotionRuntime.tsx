import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useMotionEnabled } from "../components/MotionPreferences";
import { loadMotionKit, type MotionKit } from "./kit";

/*
 * One client-only runtime owns every scroll- and pointer-driven effect:
 *  - Lenis smooth scrolling, driven by the GSAP ticker so ScrollTrigger and
 *    Lenis share a single animation frame.
 *  - Scroll reveals ([data-reveal], [data-reveal-group]), parallax
 *    ([data-parallax]) and the experience timeline progress rail.
 *  - Magnetic buttons, tilt surfaces ([data-tilt]) and the custom cursor.
 *
 * Nothing here runs during pre-rendering, and nothing runs at all when the
 * visitor prefers reduced motion: content is always fully visible in the
 * server HTML and is only hidden just before it is animated back in.
 */
export function MotionRuntime() {
  const enabled = useMotionEnabled();
  const { pathname } = useLocation();
  const kitRef = useRef<MotionKit | null>(null);
  const firstRoute = useRef(true);

  // Smooth scrolling + shared ticker for the lifetime of the page.
  useEffect(() => {
    if (!enabled) return;
    let disposed = false;
    let teardown = () => {};
    void loadMotionKit().then((kit) => {
      if (disposed) return;
      kitRef.current = kit;
      teardown = kit.startSmoothScroll();
    });
    return () => {
      disposed = true;
      teardown();
    };
  }, [enabled]);

  // Pointer effects: cursor, magnetic buttons, tilt surfaces.
  useEffect(() => {
    if (!enabled) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    let disposed = false;
    let teardown = () => {};
    void loadMotionKit().then((kit) => {
      if (!disposed) teardown = kit.startPointerEffects();
    });
    return () => {
      disposed = true;
      teardown();
    };
  }, [enabled]);

  // Route-scoped scroll choreography.
  useEffect(() => {
    if (!enabled) return;
    const main = document.getElementById("main");
    if (!firstRoute.current && main?.animate)
      main.animate(
        [
          { opacity: 0, transform: "translateY(14px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 520, easing: "cubic-bezier(.2,.75,.2,1)" },
      );
    firstRoute.current = false;
    let disposed = false;
    let teardown = () => {};
    void loadMotionKit().then((kit) => {
      if (disposed) return;
      // Wait one frame so lazily rendered routes have committed their DOM.
      requestAnimationFrame(() => {
        if (!disposed) teardown = kit.startScrollScenes();
      });
    });
    return () => {
      disposed = true;
      teardown();
    };
  }, [enabled, pathname]);

  return null;
}
