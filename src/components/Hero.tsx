import { m } from "framer-motion";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { aboutProfile, profile, projects } from "../data/portfolio";
import { ActionLink } from "./Primitives";
import { StudioScene } from "./StudioScene";
import { useMotionEnabled } from "./MotionPreferences";
import { openPortfolioAssistant } from "../lib/portfolioActions";

export function Hero() {
  const enabled = useMotionEnabled();
  return (
    <section
      id="hero"
      className="hero section-container"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <div className="hero-topline">
        <span>
          <span className="status-dot" /> Open to new opportunities
        </span>
        <span>
          {profile.location}{" "}
          <span className="hero-edition"> / INDEPENDENT MINDSET</span>
        </span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="hero-kicker">
            Harsh Gavand <span> / </span> Full-stack & AI engineer
          </p>
          <m.h1
            id="hero-title"
            initial={false}
            animate={enabled ? { opacity: [0.6, 1], y: [18, 0] } : undefined}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Thoughtful
            <br />
            by design.
            <br />
            <span>Built to work.</span>
          </m.h1>
          <p className="hero-description">
            I connect the interface, the system, and the intelligence behind it.
          </p>
          <p className="hero-detail">
            Full-stack products. Practical AI. Care in every layer.
          </p>
          <div className="actions">
            <ActionLink href="#projects" primary>
              Explore the work
            </ActionLink>
            <ActionLink href="#contact">Let’s talk</ActionLink>
          </div>
          <button
            className="hero-assistant-link"
            onClick={() => openPortfolioAssistant()}
            aria-haspopup="dialog"
          >
            <Sparkles size={14} aria-hidden="true" /> Curious about the details?{" "}
            <strong>Ask my portfolio</strong>
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </div>
        <StudioScene />
      </div>
      <div className="hero-bottom">
        <a href="#projects" className="scroll-cue">
          <ArrowDown size={17} aria-hidden="true" /> A closer look
        </a>
        <div className="hero-index">
          <a href="#all-projects">
            <strong>{projects.length}</strong>
            <span>projects to explore</span>
          </a>
          <a href="#experience">
            <strong>{aboutProfile.experience}</strong>
            <span>of building products</span>
          </a>
        </div>
        <span className="hero-signoff">
          Design meets engineering.
          <br />
          Good things happen.
        </span>
      </div>
      <div className="discipline-strip" aria-label="Areas of work">
        <span>Interface</span>
        <span>Systems</span>
        <span>Applied AI</span>
        <span>One connected perspective.</span>
      </div>
    </section>
  );
}
