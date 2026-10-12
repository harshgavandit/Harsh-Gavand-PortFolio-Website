import { useRef, type ReactNode, type PointerEvent } from "react";
import { m, useScroll, useTransform, type MotionStyle } from "framer-motion";
import { useMotionEnabled } from "./MotionPreferences";

export function DepthCard({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const enabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const rise = useTransform(scrollYProgress, [0, 0.45, 1], [24, 0, -16]);
  const inclination = useTransform(
    scrollYProgress,
    [0, 0.45, 1],
    [2.5, 0, -1.5],
  );
  function move(event: PointerEvent<HTMLElement>) {
    if (!enabled || event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    event.currentTarget.style.setProperty("--tilt-x", `${-y * 5}deg`);
    event.currentTarget.style.setProperty("--tilt-y", `${x * 5}deg`);
  }
  function reset() {
    ref.current?.style.setProperty("--tilt-x", "0deg");
    ref.current?.style.setProperty("--tilt-y", "0deg");
  }
  return (
    <m.article
      ref={ref}
      className={`${className} depth-card`}
      style={
        {
          "--scroll-rise": enabled ? rise : 0,
          "--scroll-inclination": enabled ? inclination : 0,
        } as MotionStyle
      }
      onPointerMove={move}
      onPointerLeave={reset}
    >
      {children}
    </m.article>
  );
}
