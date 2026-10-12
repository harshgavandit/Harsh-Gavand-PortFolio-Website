import { useRef, type ReactNode, type PointerEvent } from "react";
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
    <article
      ref={ref}
      className={`${className} depth-card`}
      onPointerMove={move}
      onPointerLeave={reset}
    >
      {children}
    </article>
  );
}
