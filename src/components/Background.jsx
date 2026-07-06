import { useEffect, useRef, useState } from "react";

export const Background = () => {
  const [mouse, setMouse] = useState({ x: 50, y: 50 });
  const rafRef = useRef(null);
  const currentRef = useRef({ x: 50, y: 50 });
  const targetRef = useRef({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      targetRef.current = {
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      };
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    function animate() {
      currentRef.current.x = lerp(currentRef.current.x, targetRef.current.x, 0.05);
      currentRef.current.y = lerp(currentRef.current.y, targetRef.current.y, 0.05);
      setMouse({ x: currentRef.current.x, y: currentRef.current.y });
      rafRef.current = requestAnimationFrame(animate);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{ zIndex: -1, pointerEvents: "none" }}
      aria-hidden="true"
    >
      {/* Base */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "#09090B" }}
      />

      {/* Aurora layer 1 — animated */}
      <div
        className="absolute"
        style={{
          width: "70%",
          height: "70%",
          top: "5%",
          left: "15%",
          background:
            "radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 65%)",
          animation: "aurora 14s ease-in-out infinite",
          filter: "blur(40px)",
        }}
      />

      {/* Aurora layer 2 */}
      <div
        className="absolute"
        style={{
          width: "50%",
          height: "60%",
          bottom: "0%",
          right: "5%",
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.08) 0%, transparent 60%)",
          animation: "aurora 18s ease-in-out infinite reverse",
          filter: "blur(50px)",
        }}
      />

      {/* Aurora layer 3 */}
      <div
        className="absolute"
        style={{
          width: "40%",
          height: "50%",
          top: "40%",
          left: "0%",
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 60%)",
          animation: "aurora 20s ease-in-out infinite",
          animationDelay: "-5s",
          filter: "blur(60px)",
        }}
      />

      {/* Cursor-reactive spotlight */}
      <div
        style={{
          position: "absolute",
          width: "700px",
          height: "700px",
          left: `${mouse.x}%`,
          top: `${mouse.y}%`,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 60%)",
          pointerEvents: "none",
          filter: "blur(20px)",
        }}
      />

      {/* Noise texture */}
      <svg
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.025, mixBlendMode: "screen" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      {/* Subtle dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.4,
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        }}
      />
    </div>
  );
};
