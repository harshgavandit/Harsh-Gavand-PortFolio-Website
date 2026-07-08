import { motion, useInView } from "framer-motion";
import { BriefcaseBusiness } from "lucide-react";
import { useRef } from "react";

const experiences = [
  {
    company: "Globetrek Engineering Corporation",
    role: "Full-Stack Developer",
    period: "Jan 2026 – June 2026",
    achievements: [
      "Building and maintaining full-stack web applications using Django and React, handling database design through to deployment.",
      "Writing clean, production-ready code across Python and JavaScript — REST APIs, async tasks, and third-party service integrations.",
      "Designing and optimizing relational database schemas; writing efficient, reusable SQL queries to support features and reporting pipelines.",
      "Collaborating with product and design to ship features fast while keeping codebases maintainable and scalable.",
      "Conducting code reviews and enforcing coding standards across shared repositories.",
    ],
    tech: ["Django", "React", "Python", "JavaScript", "REST APIs", "SQL"],
  },
  {
    company: "HRP Enterprises",
    role: "Frontend Developer",
    period: "Jan 2024 – Nov 2025",
    achievements: [
      "Built and maintained responsive UI components using HTML, CSS, and JavaScript — supporting 1,000+ concurrent users with zero reported cross-browser compatibility issues.",
      "Collaborated with the backend team to integrate REST APIs into frontend views, handling async data flows and dynamic rendering across 10+ pages and reducing average page load time by 30%.",
      "Identified and resolved 20+ UI bugs across devices and screen sizes, improving load performance and ensuring a consistent user experience across the entire product.",
    ],
    tech: ["HTML", "CSS", "JavaScript", "React", "REST APIs"],
  },
];

export const ExperienceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="experience" className="section-shell">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(34,211,238,0.1),transparent_52%)]" aria-hidden="true" />
      <div className="section-container relative" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 max-w-3xl"
        >
          <p className="section-kicker mb-3">Experience</p>
          <h2 className="section-title text-balance mb-4">Professional experience from my resume.</h2>
          <p className="section-copy">
            The roles, dates, and responsibility points below match the full-stack resume included in this project folder.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute bottom-8 left-5 top-8 hidden w-px bg-gradient-to-b from-transparent via-indigo-300/30 to-transparent md:block" />

          <div className="grid gap-6">
            {experiences.map((exp, index) => (
              <motion.article
                key={`${exp.company}-${exp.period}`}
                initial={{ opacity: 0, y: 26 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.62, delay: 0.12 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative md:pl-16"
              >
                <div className="absolute left-0 top-7 hidden h-10 w-10 items-center justify-center rounded-full border border-indigo-300/25 bg-[#09090B] text-[#A5B4FC] shadow-[0_0_28px_rgba(99,102,241,0.22)] md:flex">
                  <BriefcaseBusiness size={17} />
                </div>

                <div className="premium-card rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/30">
                  <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h3 className="font-heading text-2xl font-bold text-white">{exp.role}</h3>
                      <p className="mt-1 text-sm font-medium text-[#A5B4FC]">{exp.company}</p>
                    </div>
                    <span className="w-fit rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-[#A5B4FC]">
                      {exp.period}
                    </span>
                  </div>

                  {exp.achievements.length > 0 ? (
                    <ul className="grid gap-3 md:grid-cols-2">
                      {exp.achievements.map((achievement) => (
                        <li key={achievement} className="flex gap-3 text-sm leading-7 text-[#A1A1AA]">
                          <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8B5CF6]" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {exp.tech.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {exp.tech.map((item) => (
                        <span key={item} className="chip rounded-full px-3 py-1.5 text-xs font-semibold">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
