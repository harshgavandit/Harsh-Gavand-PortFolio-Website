import { AnimatePresence, motion, useInView } from "framer-motion";
import { BrainCircuit, Cloud, Code2, Database, Server, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

const skillGroups = [
  {
    category: "Frontend",
    icon: Code2,
    summary: "Accessible, responsive interfaces with modern component systems.",
    skills: ["React.js", "Next.js", "JavaScript ES6+", "TypeScript", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    category: "Backend",
    icon: Server,
    summary: "APIs, auth, business logic, and scalable service boundaries.",
    skills: ["Node.js", "Express.js", "Python", "Django", "FastAPI", "Flask", "REST APIs"],
  },
  {
    category: "Database",
    icon: Database,
    summary: "Relational and document data models designed for product workflows.",
    skills: ["MongoDB", "PostgreSQL", "MySQL", "SQLite", "SQLAlchemy", "Prisma"],
  },
  {
    category: "AI & ML",
    icon: BrainCircuit,
    summary: "Applied LLMs, ML models, agent workflows, and automation pipelines.",
    skills: ["OpenAI API", "LangChain", "TensorFlow", "Keras", "Pandas", "NumPy", "Agentic AI"],
  },
  {
    category: "Infrastructure",
    icon: Cloud,
    summary: "Deployment-ready workflows, integrations, and real-time systems.",
    skills: ["Docker", "Git", "GitHub", "Cloudinary", "Socket.io", "WebRTC", "Webhooks"],
  },
];

const categories = ["All", ...skillGroups.map((group) => group.category)];

export const SkillsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered =
    activeCategory === "All"
      ? skillGroups
      : skillGroups.filter((group) => group.category === activeCategory);

  return (
    <section id="skills" className="section-shell overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,rgba(99,102,241,0.13),transparent_55%)]" aria-hidden="true" />
      <div className="section-container relative" ref={ref}>
        <div className="mb-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <p className="section-kicker mb-3">Skills</p>
            <h2 className="section-title text-balance">A practical stack for modern product teams.</h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-copy max-w-2xl lg:justify-self-end"
          >
            I combine frontend polish, backend reliability, database modeling, AI workflows, and deployment
            awareness to build applications that are usable, extensible, and easy to reason about.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-8 flex flex-wrap gap-2"
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`magnetic-button rounded-full px-4 py-2 text-sm font-semibold ${
                  isActive ? "bg-white text-[#09090B]" : "border border-white/10 bg-white/[0.035] text-[#A1A1AA] hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </motion.div>

        <motion.div layout className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((group, index) => {
              const Icon = group.icon;
              return (
                <motion.article
                  layout
                  key={group.category}
                  initial={{ opacity: 0, scale: 0.96, y: 18 }}
                  animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                  exit={{ opacity: 0, scale: 0.96, y: 10 }}
                  transition={{ duration: 0.45, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
                  className="premium-card group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/30"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-400/10 text-[#A5B4FC]">
                      <Icon size={20} />
                    </div>
                    <Sparkles size={17} className="text-[#52525B] transition-colors group-hover:text-cyan-300" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-white">{group.category}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#A1A1AA]">{group.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span key={skill} className="chip rounded-full px-3 py-1.5 text-xs font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
