import { motion, useInView } from "framer-motion";
import { Award, Gauge, Rocket, Users } from "lucide-react";
import { useRef } from "react";

const achievements = [
  {
    icon: Award,
    value: "Top 5",
    label: "Hackathon placement",
    detail: "Built AutoPilot AI Command Centre under 48 hours against 500+ participating teams.",
  },
  {
    icon: Users,
    value: "1K+",
    label: "Concurrent users",
    detail: "Supported production-facing web application workloads with scalable full-stack delivery.",
  },
  {
    icon: Gauge,
    value: "30%",
    label: "Performance gain",
    detail: "Improved page load performance through optimization, lazy loading, and frontend refinement.",
  },
  {
    icon: Rocket,
    value: "26",
    label: "Projects shipped",
    detail: "Delivered full-stack, AI, SaaS, automation, ML, and real-time applications across multiple stacks.",
  },
];

export const AchievementsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-shell pt-0">
      <div className="section-container" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="gradient-border glass-card rounded-[2rem] p-6 md:p-8"
        >
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="section-kicker mb-3">Achievements</p>
              <h2 className="font-heading text-3xl font-black text-white md:text-4xl">Proof of execution</h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#A1A1AA]">
              Metrics and milestones that show product ownership, performance thinking, and the ability
              to ship under real constraints.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {achievements.map(({ icon: Icon, value, label, detail }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.1 + index * 0.08 }}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/30"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-400/10 text-cyan-200">
                  <Icon size={19} />
                </div>
                <div className="font-heading text-4xl font-black gradient-text">{value}</div>
                <p className="mt-1 text-sm font-semibold text-white">{label}</p>
                <p className="mt-3 text-sm leading-6 text-[#A1A1AA]">{detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
