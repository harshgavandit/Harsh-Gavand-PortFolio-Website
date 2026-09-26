import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Braces, Layers3 } from "lucide-react";
import { DepthSurface } from "./DepthSurface";
import { useMotionEnabled } from "./MotionPreferences";

export function Portrait() {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 45]);
  return (
    <div ref={ref} className="portrait-composition">
      <span className="portrait-coordinate" aria-hidden="true">
        THE PERSON / BEHIND THE PRODUCTS
      </span>
      <div className="portrait-outline" aria-hidden="true" />
      <DepthSurface className="portrait-depth">
        <m.figure
          className="portrait-frame"
          initial={false}
          animate={
            enabled
              ? {
                  clipPath: [
                    "inset(0 0 100% 0 round 160px 160px 12px 12px)",
                    "inset(0 0 0% 0 round 160px 160px 12px 12px)",
                  ],
                }
              : undefined
          }
          transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <m.img
            src="/portrait/harsh.jpeg"
            width="522"
            height="1160"
            alt="Harsh Gavand"
            fetchPriority="high"
            style={{ y: enabled ? y : 0 }}
          />
          <div className="portrait-shade" aria-hidden="true" />
          <figcaption>
            <span>Harsh Gavand</span>
            <span>
              Mumbai, India <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </figcaption>
        </m.figure>
        <div className="portrait-note portrait-note-front">
          <Layers3 size={16} aria-hidden="true" />
          <span>
            <small>01 / THE EXPERIENCE</small>Thoughtful interfaces
          </span>
        </div>
        <div className="portrait-note portrait-note-back">
          <Braces size={16} aria-hidden="true" />
          <span>
            <small>02 / THE ENGINEERING</small>Reliable systems
          </span>
        </div>
      </DepthSurface>
      <div className="portrait-signature">
        <span className="tiny-dot" /> Full-stack thinking. Human perspective.
      </div>
    </div>
  );
}
