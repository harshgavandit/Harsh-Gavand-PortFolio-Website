import { useEffect, useRef, useState } from "react";
import { m, useScroll } from "framer-motion";
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react";
import { experience } from "../data/portfolio";
import { Reveal, Tags } from "./Primitives";
import { useMotionEnabled } from "./MotionPreferences";

export function ExperienceJourney() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const enabled = useMotionEnabled();
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start center", "end center"],
  });
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActive(Number((entry.target as HTMLElement).dataset.chapter));
        });
      },
      { rootMargin: "-20% 0px -45% 0px" },
    );
    root.current
      ?.querySelectorAll("[data-chapter]")
      .forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);
  return (
    <div className="experience-journey" ref={root}>
      <aside className="journey-index" aria-label="Experience chapters">
        <div className="journey-emblem" aria-hidden="true">
          <BriefcaseBusiness size={32} />
          <span>EXPERIENCE / FIELD NOTES</span>
        </div>
        <p>
          Ideas meet
          <br />
          <strong>the real world.</strong>
        </p>
        <nav aria-label="Choose an experience">
          {experience.map((item, index) => (
            <a
              key={item.company}
              href={`#experience-${index}`}
              aria-current={active === index ? "location" : undefined}
            >
              <span>0{index + 1}</span>
              <span>
                {item.company}
                <small>{item.period}</small>
              </span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          ))}
        </nav>
        <div className="journey-progress" aria-hidden="true">
          <m.span style={{ scaleX: enabled ? scrollYProgress : 1 }} />
        </div>
      </aside>
      <div className="journey-chapters">
        {experience.map((item, index) => (
          <Reveal key={item.company}>
            <article
              id={`experience-${index}`}
              tabIndex={-1}
              data-chapter={index}
              className={`journey-chapter ${active === index ? "is-current" : ""}`}
            >
              <div className="journey-chapter-top">
                <span className="eyebrow">CHAPTER 0{index + 1}</span>
                <span>{item.period}</span>
              </div>
              <p className="journey-company">{item.company}</p>
              <h3>{item.role}</h3>
              <ul>
                {item.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <Tags items={item.tech} />
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
