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
      className="hero section-container cinematic-hero atelier-hero"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <div className="hero-environment" aria-hidden="true">
        <div className="hero-horizon" />
        <div className="hero-orbit-line" />
      </div>
      <div className="hero-topline">
        <span className="eyebrow">INDEPENDENT MIND. FULL-STACK THINKING.</span>
        <span className="location">
          {profile.location} <span>↗</span>
        </span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <div className="availability">
            <span /> Open to new opportunities
          </div>
          <p className="atelier-kicker">FULL-STACK & AI DEVELOPER</p>
          <h1 id="hero-title">
            {["Engineering", "with", "imagination."].map((line, i) => (
              <span className={`text-mask hero-line-${i}`} key={line}>
                <m.span
                  initial={false}
                  animate={
                    enabled ? { y: [28, 0], opacity: [0.3, 1] } : undefined
                  }
                  transition={{
                    duration: 0.9,
                    delay: i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={i === 2 ? "accent-text" : undefined}
                >
                  {line}
                </m.span>
              </span>
            ))}
          </h1>
          <p className="hero-description">
            I’m Harsh. I connect thoughtful interfaces, reliable systems, and
            applied AI to turn ambitious ideas into useful products.
          </p>
          <div className="actions">
            <ActionLink href="#projects" primary>
              Explore my work
            </ActionLink>
            <ActionLink href="#contact">Let’s talk</ActionLink>
          </div>
          <button
            className="hero-assistant-link"
            onClick={() =>
              window.dispatchEvent(new Event("open-portfolio-assistant"))
            }
            aria-haspopup="dialog"
          >
            <Sparkles size={16} aria-hidden="true" />
            <span>
              Meet the work. <strong>Ask my AI assistant</strong>
            </span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>
        </div>
        <StudioScene />
      </div>
      <div className="hero-bottom">
        <a href="#projects">
          <span className="scroll-disc">
            <ArrowDown size={17} aria-hidden="true" />
          </span>{" "}
          Explore selected work
        </a>
        <p>
          <strong>{projects.length}</strong> projects <span>/</span> Code, demos &
          walkthroughs
        </p>
        <span className="edition">SELECTED WORK / 2026</span>
      </div>
    </section>
  );
}
