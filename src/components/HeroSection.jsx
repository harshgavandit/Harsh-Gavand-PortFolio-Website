import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { useEffect, useState } from "react";

const resumeUrl = "/Harsh_Gavand_Resume.pdf";

const roles = [
  "Full-Stack Engineer",
  "AI Systems Builder",
  "MERN + Python Developer",
  "SaaS Product Engineer",
];

const metrics = [
  { value: "26", label: "Projects shipped" },
  { value: "1K+", label: "Concurrent users supported" },
  { value: "30%", label: "Performance improvement" },
];

const highlights = ["MERN", "Python", "Django", "FastAPI", "AI Agents", "WebRTC"];

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
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden px-6 pb-20 pt-32">
      <div className="soft-grid absolute inset-0 opacity-60" aria-hidden="true" />
      <motion.div
        className="absolute right-[-8rem] top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl"
        animate={{ y: [0, 24, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-24 left-[-9rem] h-80 w-80 rounded-full bg-indigo-500/15 blur-3xl"
        animate={{ y: [0, -22, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-5xl text-center">
        <div>
          <motion.div {...fadeUp(0)} className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold text-[#D4D4D8] backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            Available for full-stack, AI, and SaaS roles
          </motion.div>

          <motion.h1
            {...fadeUp(0.08)}
            className="font-heading text-balance text-5xl font-black leading-[0.95] text-white sm:text-6xl lg:text-7xl"
          >
            I build premium web products with <span className="gradient-text">full-stack depth.</span>
          </motion.h1>

          <motion.div {...fadeUp(0.18)} className="mt-5 flex min-h-9 items-center overflow-hidden">
            <span className="mr-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#71717A]">Harsh Gavand</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={roleIndex}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading text-xl font-bold text-[#A5B4FC]"
              >
                {roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.p {...fadeUp(0.28)} className="mt-6 max-w-2xl text-lg leading-8 text-[#A1A1AA]">
            Full-stack developer building scalable MERN, Python, SaaS, and AI systems with clean APIs,
            polished interfaces, deployment discipline, and measurable product outcomes.
          </motion.p>

          <motion.div {...fadeUp(0.36)} className="mt-7 flex flex-wrap justify-center gap-2">
            {highlights.map((item) => (
              <span key={item} className="chip rounded-full px-3 py-1 text-xs font-semibold">
                {item}
              </span>
            ))}
          </motion.div>

          <motion.div {...fadeUp(0.46)} className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#projects"
              className="magnetic-button inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-[#09090B] shadow-[0_16px_40px_rgba(255,255,255,0.13)]"
            >
              Explore Projects <ArrowRight size={16} />
            </a>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-button inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white backdrop-blur-xl hover:border-indigo-400/50"
            >
              <Download size={16} /> View Resume
            </a>
          </motion.div>

          <motion.div {...fadeUp(0.56)} className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="premium-card rounded-2xl p-4">
                <div className="font-heading text-3xl font-black text-white">{metric.value}</div>
                <div className="mt-1 text-xs leading-5 text-[#A1A1AA]">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

      </div>

      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[#71717A] md:flex"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">Scroll</span>
        <motion.span animate={{ y: [0, 7, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown size={15} />
        </motion.span>
      </motion.a>
    </section>
  );
};
