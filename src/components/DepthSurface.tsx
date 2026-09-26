import { useEffect, type ReactNode, type PointerEvent } from "react";
import { m, useMotionValue, useSpring, useMotionTemplate } from "framer-motion";
import { useMotionEnabled } from "./MotionPreferences";

export function DepthSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const enabled = useMotionEnabled();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 160, damping: 24 });
  const rotateY = useSpring(y, { stiffness: 160, damping: 24 });
  const lightX = useMotionValue(50),
    lightY = useMotionValue(30);
  const light = useMotionTemplate`radial-gradient(ellipse at ${lightX}% ${lightY}%, rgba(216,206,245,.12), transparent 65%)`;
  useEffect(() => {
    if (!enabled) {
      x.set(0);
      y.set(0);
    }
  }, [enabled, x, y]);
  function move(event: PointerEvent<HTMLDivElement>) {
    if (
      !enabled ||
      event.pointerType !== "mouse" ||
      !matchMedia("(pointer: fine)").matches
    )
      return;
    const rect = event.currentTarget.getBoundingClientRect();
    const horizontal = (event.clientX - rect.left) / rect.width;
    const vertical = (event.clientY - rect.top) / rect.height;
    x.set((0.5 - vertical) * 5);
    y.set((horizontal - 0.5) * 7);
    lightX.set(horizontal * 100);
    lightY.set(vertical * 100);
  }
  return (
    <m.div
      className={`depth-surface ${className}`}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX: enabled ? rotateX : 0,
        rotateY: enabled ? rotateY : 0,
        transformPerspective: 1200,
      }}
    >
      {children}
      <m.div
        className="depth-light"
        aria-hidden="true"
        style={{ backgroundImage: light }}
      />
    </m.div>
  );
}
