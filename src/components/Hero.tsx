import { m } from "framer-motion";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { profile, projects } from "../data/portfolio";
import { ActionLink } from "./Primitives";
import { StudioScene } from "./StudioScene";
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
      <div className="hero-environment" aria-hidden="true">
        <div className="hero-horizon" />
        <div className="hero-orbit-line" />
      </div>
      <div className="hero-topline">
        <span className="eyebrow">
          DIGITAL CRAFT / FULL-STACK ENGINEERING / APPLIED AI
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
            <span className="hero-name">Harsh Gavand</span>
            <span className="hero-role">Full-Stack & AI Developer</span>
          </p>
          <h1 id="hero-title">
            {["Ideas into", "intelligent", "experiences."].map(
              (line, index) => (
                <span className="text-mask" key={line}>
                  <m.span
                    className={index === 1 ? "accent-text" : undefined}
                    initial={false}
                    animate={
                      enabled ? { y: [24, 0], opacity: [0.4, 1] } : undefined
                    }
                    transition={{
                      duration: 0.85,
                      delay: index * 0.1,
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
            Full-Stack & AI Developer turning complex ideas into considered
            digital products — from responsive interfaces and reliable APIs to
            practical AI systems.
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
          <button
            className="hero-assistant-link"
            onClick={() =>
              window.dispatchEvent(new Event("open-portfolio-assistant"))
            }
            aria-haspopup="dialog"
          >
            <Sparkles size={17} aria-hidden="true" />
            <span>
              Curious about my work? <strong>Ask my AI assistant</strong>
            </span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
          <div className="hero-disciplines">
            <span>Interface</span>
            <i />
            <span>Systems</span>
            <i />
            <span>Applied AI</span>
          </div>
        </div>
        <StudioScene />
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
