import type { ReactNode } from "react";
import { LazyMotion, MotionConfig } from "motion/react";

const loadFeatures = () =>
  import("./features").then((module) => module.default);

/*
 * Motion (Framer Motion) handles state-driven component animation: shared
 * layout indicators, tab and panel transitions, and filter changes. Scroll and
 * pointer choreography lives in GSAP (see MotionRuntime) so the two systems
 * never animate the same property.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  );
}
