import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { useEffect, useState } from "react";

const roles = [
  "Full-Stack Engineer",
  "MERN Stack Developer",
  "AI Systems Builder",
  "Product Engineer",
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
});

export const HeroSection = () => {
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20"
    >
      <div className="max-w-4xl mx-auto w-full text-center">

        {/* Availability badge */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
          <span
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide"
            style={{
              border: "1px solid #27272A",
              backgroundColor: "rgba(17,17,19,0.8)",
              color: "#A1A1AA",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: "#22C55E",
                boxShadow: "0 0 6px #22C55E",
                animation: "glow 3s ease-in-out infinite",
              }}
            />
            Available for opportunities
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1
          {...fadeUp(0.1)}
          className="font-heading font-bold text-white mb-4 leading-none"
          style={{ fontSize: "clamp(3rem, 8vw, 6.5rem)", letterSpacing: "-0.03em" }}
        >
          Harsh Gavand
        </motion.h1>

        {/* Animated role */}
        <motion.div
          {...fadeUp(0.2)}
          className="flex items-center justify-center mb-6 overflow-hidden"
          style={{ height: "2.5rem" }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={roleIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-semibold"
              style={{
                fontSize: "clamp(1.1rem, 2.5vw, 1.6rem)",
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.div>

        {/* Description */}
        <motion.p
          {...fadeUp(0.3)}
          className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ color: "#A1A1AA" }}
        >
          Building production-grade web systems — from REST APIs to real-time
          interfaces. Specializing in MERN stack, Python backends, and
          AI-powered applications shipped across two startups.
        </motion.p>

        {/* Code snippet detail */}
        <motion.div {...fadeUp(0.35)} className="flex justify-center mb-10">
          <span
            className="font-mono text-sm px-4 py-2 rounded-lg"
            style={{
              backgroundColor: "#111113",
              border: "1px solid #1F1F23",
              color: "#71717A",
            }}
          >
            <span style={{ color: "#818CF8" }}>const</span>{" "}
            <span style={{ color: "#22C55E" }}>engineer</span>{" "}
            <span style={{ color: "#A1A1AA" }}>=</span>{" "}
            <span style={{ color: "#A1A1AA" }}>{"{ "}</span>
            <span style={{ color: "#F59E0B" }}>stack</span>
            <span style={{ color: "#A1A1AA" }}>: </span>
            <span style={{ color: "#6EE7B7" }}>"MERN + Python + AI"</span>
            <span style={{ color: "#A1A1AA" }}>{" }"}</span>
          </span>
        </motion.div>

        {/* CTAs */}
        <motion.div
          {...fadeUp(0.45)}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
              boxShadow: "0 0 0 1px rgba(99,102,241,0.3), 0 8px 20px rgba(99,102,241,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 0 0 1px rgba(99,102,241,0.5), 0 12px 32px rgba(99,102,241,0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0 0 0 1px rgba(99,102,241,0.3), 0 8px 20px rgba(99,102,241,0.25)";
            }}
          >
            View Projects <ArrowRight size={15} />
          </a>
          <a
            href=""
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200"
            style={{
              border: "1px solid #27272A",
              backgroundColor: "transparent",
              color: "#A1A1AA",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = "#6366F1";
              e.currentTarget.style.color = "#FAFAFA";
              e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#27272A";
              e.currentTarget.style.color = "#A1A1AA";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Download size={15} /> Resume
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 flex flex-col items-center gap-2"
        style={{ transform: "translateX(-50%)" }}
      >
        <span
          className="text-[10px] font-medium tracking-[0.2em] uppercase"
          style={{ color: "#52525B" }}
        >
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} style={{ color: "#52525B" }} />
        </motion.div>
      </motion.div>
    </section>
  );
};
