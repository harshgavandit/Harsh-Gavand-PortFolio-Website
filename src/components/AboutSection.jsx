import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Cpu, Briefcase, ArrowRight, Download } from "lucide-react";

const stats = [
  { value: "2+", label: "Years building" },
  { value: "6+", label: "Products shipped" },
  { value: "1K+", label: "Concurrent users" },
  { value: "30%", label: "Perf improvement" },
];

const capabilities = [
  {
    icon: Code2,
    title: "Full-Stack Systems",
    description:
      "End-to-end MERN stack applications and Python backends — from database schema to production deployment. I own the full delivery cycle.",
  },
  {
    icon: Cpu,
    title: "AI & Agentic Pipelines",
    description:
      "Multi-agent orchestration, LLM integration, automated data pipelines, and ML-powered REST APIs that run reliably in production.",
  },
  {
    icon: Briefcase,
    title: "Startup-Tested",
    description:
      "Shipped features at Globetrek Engineering and HRP Enterprises. Comfortable with ambiguity, fast iteration, and owning outcomes.",
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
});

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-28 px-6 relative">
      <div className="max-w-5xl mx-auto" ref={ref}>

        {/* Section label */}
        <motion.p
          {...fadeUp(0)}
          animate={isInView ? fadeUp(0).animate : fadeUp(0).initial}
          className="text-xs font-semibold tracking-[0.12em] uppercase mb-3"
          style={{ color: "#6366F1" }}
        >
          About
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left — Story */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-bold text-white mb-6"
              style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}
            >
              I build software that solves real problems.
            </motion.h2>

            <div className="space-y-4" style={{ color: "#A1A1AA" }}>
              {[
                "B.Tech graduate with hands-on experience across two startups. I've shipped production features supporting 1,000+ concurrent users, reduced page load times by 30%, and built systems from the ground up — database design through deployment.",
                "My work spans the MERN stack and Python backends, with a growing focus on agentic AI systems and automated data pipelines. I'm drawn to problems where the engineering decisions actually matter.",
                "Outside of work, I compete in hackathons. My team's AutoPilot AI Command Centre placed Top 5 of 500+ teams — a multi-agent orchestration system built under 48 hours.",
              ].map((text, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base leading-relaxed"
                >
                  {text}
                </motion.p>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-3 mt-8"
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                  boxShadow: "0 0 0 1px rgba(99,102,241,0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 0 0 1px rgba(99,102,241,0.5), 0 8px 24px rgba(99,102,241,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 0 0 1px rgba(99,102,241,0.3)";
                }}
              >
                Get in touch <ArrowRight size={14} />
              </a>
              <a
                href=""
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  border: "1px solid #27272A",
                  color: "#A1A1AA",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#6366F1";
                  e.currentTarget.style.color = "#FAFAFA";
                  e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#27272A";
                  e.currentTarget.style.color = "#A1A1AA";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Download size={14} /> Resume
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 pt-8"
              style={{ borderTop: "1px solid #1F1F23" }}
            >
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div
                    className="font-heading font-bold text-2xl"
                    style={{
                      background: "linear-gradient(135deg, #FAFAFA 0%, #A1A1AA 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {value}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "#71717A" }}>
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Capability cards */}
          <div className="space-y-3">
            {capabilities.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 rounded-xl transition-all duration-200"
                style={{
                  backgroundColor: "#111113",
                  border: "1px solid #1F1F23",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#27272A";
                  e.currentTarget.style.backgroundColor = "#18181B";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#1F1F23";
                  e.currentTarget.style.backgroundColor = "#111113";
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="p-2 rounded-lg shrink-0"
                    style={{
                      backgroundColor: "rgba(99,102,241,0.1)",
                      border: "1px solid rgba(99,102,241,0.15)",
                    }}
                  >
                    <Icon size={16} style={{ color: "#818CF8" }} />
                  </div>
                  <div>
                    <h4
                      className="font-heading font-semibold text-sm mb-1.5"
                      style={{ color: "#FAFAFA" }}
                    >
                      {title}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: "#71717A" }}>
                      {description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
