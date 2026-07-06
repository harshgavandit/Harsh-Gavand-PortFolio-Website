import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const skillGroups = [
  {
    category: "Frontend",
    skills: ["React.js", "Next.js", "JavaScript (ES6+)", "TypeScript", "HTML5 / CSS3", "Tailwind CSS"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Express.js", "Python", "Django", "FastAPI", "Flask"],
  },
  {
    category: "Database",
    skills: ["MongoDB", "PostgreSQL", "MySQL", "SQLAlchemy", "Prisma"],
  },
  {
    category: "AI & ML",
    skills: ["TensorFlow / Keras", "LSTM Models", "Pandas / NumPy", "LLM APIs", "n8n / Zapier", "Agentic AI"],
  },
  {
    category: "Infrastructure",
    skills: ["Docker", "Git / GitHub", "REST API Design", "WebRTC", "Socket.io", "Cloudinary"],
  },
];

const categoryColors = {
  Frontend: { bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.15)", dot: "#3B82F6" },
  Backend: { bg: "rgba(34,197,94,0.06)", border: "rgba(34,197,94,0.15)", dot: "#22C55E" },
  Database: { bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.15)", dot: "#F59E0B" },
  "AI & ML": { bg: "rgba(139,92,246,0.06)", border: "rgba(139,92,246,0.15)", dot: "#8B5CF6" },
  Infrastructure: { bg: "rgba(236,72,153,0.06)", border: "rgba(236,72,153,0.15)", dot: "#EC4899" },
};

export const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...skillGroups.map((g) => g.category)];
  const filtered =
    activeCategory === "All"
      ? skillGroups
      : skillGroups.filter((g) => g.category === activeCategory);

  return (
    <section id="skills" className="py-28 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(99,102,241,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold tracking-[0.12em] uppercase mb-3"
          style={{ color: "#6366F1" }}
        >
          Skills
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-bold text-white mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}
        >
          Technology & Tools
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base mb-10 max-w-lg"
          style={{ color: "#71717A" }}
        >
          The stack I reach for when building production systems.
        </motion.p>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: isActive ? "rgba(99,102,241,0.15)" : "transparent",
                  border: isActive ? "1px solid rgba(99,102,241,0.4)" : "1px solid #1F1F23",
                  color: isActive ? "#818CF8" : "#71717A",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "#3F3F46";
                    e.currentTarget.style.color = "#A1A1AA";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "#1F1F23";
                    e.currentTarget.style.color = "#71717A";
                  }
                }}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Skill groups */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((group, gi) => {
            const colors = categoryColors[group.category] || categoryColors["Frontend"];
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + gi * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="p-5 rounded-xl"
                style={{
                  backgroundColor: "#111113",
                  border: "1px solid #1F1F23",
                }}
              >
                {/* Category header */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: colors.dot }}
                  />
                  <span
                    className="text-xs font-semibold tracking-wide uppercase"
                    style={{ color: colors.dot }}
                  >
                    {group.category}
                  </span>
                </div>

                {/* Skill badges */}
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-200 cursor-default"
                      style={{
                        backgroundColor: colors.bg,
                        border: `1px solid ${colors.border}`,
                        color: "#A1A1AA",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "#FAFAFA";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "#A1A1AA";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
