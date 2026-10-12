import { useRef } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { Braces, Layers3, Sparkles, ArrowDownRight } from "lucide-react";
import { useMotionEnabled } from "./MotionPreferences";

export function EngineeringBridge() {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rotation = useTransform(scrollYProgress, [0, 0.5, 1], [-12, 0, 12]);
  const lift = useTransform(scrollYProgress, [0, 0.5, 1], [20, 0, -20]);
  return (
    <div className="engineering-bridge section-container" ref={ref}>
      <div className="bridge-intro">
        <span className="eyebrow">From the first interaction</span>
        <p>
          to the intelligence
          <br />
          behind it.
        </p>
        <ArrowDownRight size={25} aria-hidden="true" />
      </div>
      <m.div
        className="bridge-layers"
        style={{ rotateY: enabled ? rotation : 0, y: enabled ? lift : 0 }}
      >
        <div>
          <Layers3 size={22} aria-hidden="true" />
          <span>01 / EXPERIENCE</span>
          <strong>Interfaces</strong>
        </div>
        <div>
          <Braces size={22} aria-hidden="true" />
          <span>02 / ENGINEERING</span>
          <strong>Systems</strong>
        </div>
        <div>
          <Sparkles size={22} aria-hidden="true" />
          <span>03 / INTELLIGENCE</span>
          <strong>Applied AI</strong>
        </div>
      </m.div>
    </div>
  );
}
