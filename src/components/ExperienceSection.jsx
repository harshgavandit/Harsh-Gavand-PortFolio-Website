import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";

const experiences = [
  {
    company: "Globetrek Engineering Corporation",
    role: "Full-Stack Developer",
    period: "2023 – 2024",
    type: "Full-time",
    location: "Mumbai, India",
    description:
      "Worked as a full-stack developer building and maintaining scalable web applications used by thousands of concurrent users.",
    achievements: [
      "Reduced average page load time by 30% through frontend bundle optimization and lazy loading",
      "Supported application infrastructure serving 1,000+ concurrent users in production",
      "Delivered full-stack features across the MERN stack — from MongoDB schema design to React UI",
      "Collaborated closely with product and design to ship features on tight deadlines",
    ],
    tech: ["React", "Node.js", "MongoDB", "Express", "REST API"],
  },
  {
    company: "HRP Enterprises",
    role: "Software Developer",
    period: "2022 – 2023",
    type: "Contract",
    location: "Remote",
    description:
      "Built web applications and automation tools that streamlined internal business workflows and data processing.",
    achievements: [
      "Designed and implemented RESTful APIs consumed by web and mobile clients",
      "Built automated data pipelines using Python, reducing manual data processing overhead",
      "Developed relational database schemas and optimized queries for improved performance",
      "Integrated third-party services and built reusable backend components",
    ],
    tech: ["Python", "Django", "PostgreSQL", "React", "REST API"],
  },
];

export const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="py-28 px-6 relative">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 80% 50%, rgba(139,92,246,0.04) 0%, transparent 70%)",
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
          Experience
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-bold text-white mb-12"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}
        >
          Where I've worked
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-0 top-0 bottom-0 hidden md:block"
            style={{
              width: "1px",
              marginLeft: "11px",
              background:
                "linear-gradient(to bottom, transparent, #27272A 15%, #27272A 85%, transparent)",
            }}
          />

          <div className="space-y-10">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="relative md:pl-14"
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-0 top-5 hidden md:block w-[22px] h-[22px] rounded-full"
                  style={{
                    border: "2px solid #27272A",
                    backgroundColor: "#09090B",
                    transform: "translateY(-50%)",
                  }}
                >
                  <div
                    className="absolute inset-[4px] rounded-full"
                    style={{ backgroundColor: "#6366F1" }}
                  />
                </div>

                {/* Card */}
                <div
                  className="p-6 rounded-xl transition-all duration-200"
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
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <div>
                      <h3
                        className="font-heading font-semibold text-white text-lg leading-tight"
                        style={{ letterSpacing: "-0.015em" }}
                      >
                        {exp.role}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-sm" style={{ color: "#818CF8" }}>
                          {exp.company}
                        </span>
                        <span style={{ color: "#3F3F46" }}>·</span>
                        <span className="text-xs" style={{ color: "#71717A" }}>
                          {exp.location}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: "rgba(99,102,241,0.08)",
                          border: "1px solid rgba(99,102,241,0.15)",
                          color: "#818CF8",
                        }}
                      >
                        {exp.type}
                      </span>
                      <span
                        className="text-xs font-mono"
                        style={{ color: "#52525B" }}
                      >
                        {exp.period}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm leading-relaxed mb-4" style={{ color: "#71717A" }}>
                    {exp.description}
                  </p>

                  {/* Achievements */}
                  <ul className="space-y-2 mb-5">
                    {exp.achievements.map((achievement, ai) => (
                      <li key={ai} className="flex items-start gap-2.5 text-sm" style={{ color: "#A1A1AA" }}>
                        <span
                          className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: "#27272A" }}
                        />
                        {achievement}
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5">
                    {exp.tech.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded text-xs font-mono"
                        style={{
                          backgroundColor: "#18181B",
                          border: "1px solid #27272A",
                          color: "#71717A",
                        }}
                      >
                        {t}
                      </span>
                    ))}
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
