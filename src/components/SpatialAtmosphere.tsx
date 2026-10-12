import { useEffect, useRef, useState } from "react";
import { m, useScroll, useTransform } from "framer-motion";
import { useMotionEnabled } from "./MotionPreferences";

const chapters = [
  { id: "hero", label: "Introduction" },
  { id: "projects", label: "Selected work" },
  { id: "about", label: "About Harsh" },
  { id: "experience", label: "Experience" },
  { id: "all-projects", label: "Project archive" },
  { id: "skills", label: "Skills" },
  { id: "workflow", label: "Process" },
  { id: "contact", label: "Contact" },
];

export function SpatialAtmosphere() {
  const enabled = useMotionEnabled();
  const { scrollYProgress } = useScroll();
  const drift = useTransform(scrollYProgress, [0, 1], [0, -240]);
  const rotation = useTransform(scrollYProgress, [0, 1], [-22, 28]);
  const [active, setActive] = useState("hero");
  const regions = useRef(new Map<string, number>());
  useEffect(() => {
    const positions = regions.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            positions.set(entry.target.id, entry.boundingClientRect.top);
          else positions.delete(entry.target.id);
        });
        // The narrow viewport band identifies the section the visitor is reading.
        const first = chapters.find((chapter) => positions.has(chapter.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-18% 0px -55% 0px", threshold: 0 },
    );
    chapters.forEach((chapter) => {
      const section = document.getElementById(chapter.id);
      if (section) observer.observe(section);
    });
    return () => {
      observer.disconnect();
      positions.clear();
    };
  }, []);
  return (
    <>
      <div
        className="spatial-atmosphere"
        aria-hidden="true"
        data-chapter={active}
      >
        <m.div
          className="atmosphere-orbit"
          style={{ y: enabled ? drift : 0, rotate: enabled ? rotation : -22 }}
        />
        <div className="atmosphere-wash" />
        <div className="atmosphere-grain" />
      </div>
      <nav className="chapter-rail" aria-label="Page chapters">
        {chapters.map((chapter, index) => (
          <a
            key={chapter.id}
            href={`#${chapter.id}`}
            aria-label={chapter.label}
            aria-current={active === chapter.id ? "location" : undefined}
          >
            <span className="chapter-dot" />
            <span className="chapter-tooltip">
              0{index + 1} / {chapter.label}
            </span>
          </a>
        ))}
      </nav>
    </>
  );
}
