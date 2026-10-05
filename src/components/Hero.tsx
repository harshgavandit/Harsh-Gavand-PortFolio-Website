import { m } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { profile, projects } from "../data/portfolio";
import { ActionLink } from "./Primitives";
import { Portrait } from "./Portrait";
import { useMotionEnabled } from "./MotionPreferences";
import "./cinematic.css";

export function Hero() {
  const enabled = useMotionEnabled();
  return (
    <section
      id="hero"
      className="hero section-container cinematic-hero"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <div className="hero-topline">
        <span className="eyebrow">
          Independent thinking. End-to-end engineering.
        </span>
        <span className="location">
          Mumbai, India <span>↗</span>
        </span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <div className="availability">
            <span /> Open to full-stack & AI opportunities
          </div>
          <p className="hero-intro">
            Harsh Gavand <span>/ Full-Stack & AI Engineer</span>
          </p>
          <h1 id="hero-title">
            {["Built with purpose.", "Engineered to work."].map(
              (line, index) => (
                <span className="text-mask" key={line}>
                  <m.span
                    className={index ? "accent-text" : undefined}
                    initial={false}
                    animate={
                      enabled ? { y: [6, 0], opacity: [0.85, 1] } : undefined
                    }
                    transition={{
                      duration: 0.35,
                      delay: index * 0.06,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    {line}
                  </m.span>
                </span>
              ),
            )}
          </h1>
          <p className="hero-description">
            I turn complex ideas into considered digital products — from
            responsive interfaces and reliable APIs to practical AI systems.
          </p>
          <div className="actions">
            <ActionLink href="#projects" primary>
              View projects
            </ActionLink>
            <ActionLink href="#contact">Let’s talk</ActionLink>
            <a
              className="text-link hero-resume"
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <div className="hero-disciplines">
            <span>Interface</span>
            <i />
            <span>Systems</span>
            <i />
            <span>Applied AI</span>
          </div>
        </div>
        <Portrait />
      </div>
      <div className="hero-bottom">
        <a href="#projects">
          <ArrowDown size={17} aria-hidden="true" /> Explore the work
        </a>
        <p>
          <strong>{projects.length}</strong> projects <span>/</span> Full-stack
          · AI · SaaS · Automation
        </p>
        <span className="edition">PORTFOLIO / 2026</span>
      </div>
    </section>
  );
}
