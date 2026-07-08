import { motion, useInView } from "framer-motion";
import { ArrowRight, Briefcase, Code2, Cpu, Download, Layers3 } from "lucide-react";
import { useRef } from "react";

const resumeUrl = "/Harsh_Gavand_Resume.pdf";

const stats = [
  { value: "2+", label: "Years building production apps" },
  { value: "26", label: "Portfolio projects across stacks" },
  { value: "1K+", label: "Concurrent users supported" },
  { value: "30%", label: "Load-time improvement delivered" },
];

const capabilities = [
  {
    icon: Code2,
    title: "Full-Stack Product Engineering",
    description:
      "MERN, PERN, Django, Flask, and FastAPI applications built from data model to deployed UI with clean boundaries and maintainable APIs.",
  },
  {
    icon: Cpu,
    title: "AI & Automation Systems",
    description:
      "LLM integrations, agentic workflows, AI media tools, debugging assistants, and automated content pipelines designed for practical outcomes.",
  },
  {
    icon: Layers3,
    title: "SaaS Interface Design",
    description:
      "Dashboard layouts, auth flows, project cards, financial products, and e-commerce experiences with responsive, conversion-aware UX.",
  },
  {
    icon: Briefcase,
    title: "Startup Execution",
    description:
      "Hands-on delivery across fast-moving teams, third-party integrations, performance improvements, and production support responsibilities.",
  },
];

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="section-shell">
      <div className="section-container" ref={ref}>
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-28"
          >
            <p className="section-kicker mb-3">About</p>
            <h2 className="section-title text-balance mb-5">
              Engineer with product taste, backend depth, and AI momentum.
            </h2>
            <div className="space-y-4 section-copy">
              <p>
                I am Harsh Gavand, a full-stack developer focused on building applications that look polished,
                scale cleanly, and solve real business problems. My work spans SaaS dashboards, fintech-style
                products, real-time apps, AI tools, automation APIs, and data-backed platforms.
              </p>
              <p>
                I care about the details that make software feel professional: fast loading, clear architecture,
                accessible interfaces, predictable APIs, and UI systems that stay consistent as a product grows.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contact"
                className="magnetic-button inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-[#09090B]"
              >
                Start a conversation <ArrowRight size={15} />
              </a>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-button inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white"
              >
                <Download size={15} /> Resume
              </a>
            </div>
          </motion.div>

          <div className="grid gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="grid grid-cols-2 gap-4 md:grid-cols-4"
            >
              {stats.map((stat) => (
                <div key={stat.label} className="premium-card rounded-2xl p-4">
                  <div className="font-heading text-3xl font-black gradient-text">{stat.value}</div>
                  <p className="mt-2 text-xs leading-5 text-[#A1A1AA]">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2">
              {capabilities.map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 22 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.58, delay: 0.16 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="premium-card group rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/30"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-indigo-300/20 bg-indigo-400/10 text-[#A5B4FC] transition-transform duration-300 group-hover:scale-105">
                    <Icon size={19} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#A1A1AA]">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
