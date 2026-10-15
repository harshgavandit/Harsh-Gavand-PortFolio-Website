import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { aboutProfile, profile, projects } from "../data/portfolio";
import { ActionLink } from "./Primitives";
import { StudioScene } from "./StudioScene";
import { useMotionEnabled } from "./MotionPreferences";
import { openPortfolioAssistant } from "../lib/portfolioActions";

export function Hero() {
  const enabled = useMotionEnabled();
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: root,
    offset: ["start start", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [0, -55]);
  return (
    <section
      ref={root}
      id="hero"
      className="hero signal-hero section-container"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <div className="hero-topline">
        <span>
          <span className="status-dot" /> Open to new opportunities
        </span>
        <span>
          {profile.location}{" "}
          <span className="hero-edition"> / AVAILABLE FOR WHAT’S NEXT</span>
        </span>
      </div>
      <div className="hero-layout">
        <m.div className="hero-copy" style={{ y: enabled ? drift : 0 }}>
          <p className="hero-kicker">
            Harsh Gavand <span> / </span> Full-stack & AI engineer
          </p>
          <m.h1
            id="hero-title"
            initial={false}
            animate={enabled ? { opacity: [0.6, 1], y: [18, 0] } : undefined}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            Engineering
            <br />
            <span>what’s next.</span>
          </m.h1>
          <p className="hero-description">
            I’m Harsh. I turn complex ideas into considered digital products —
            connecting the interface, the system, and the intelligence behind
            it.
          </p>
          <p className="hero-detail">
            React & TypeScript <span aria-hidden="true">/</span> Python &
            Node.js <span aria-hidden="true">/</span> Applied AI
          </p>
          <div className="actions">
            <ActionLink href="#projects" primary>
              Discover my work
            </ActionLink>
            <ActionLink href="#contact">Let’s talk</ActionLink>
          </div>
          <button
            className="hero-assistant-link"
            onClick={() => openPortfolioAssistant()}
            aria-haspopup="dialog"
          >
            <Sparkles size={14} aria-hidden="true" />
            <strong>A question in mind? Ask my portfolio</strong>
            <ArrowUpRight size={14} aria-hidden="true" />
          </button>
        </m.div>
        <StudioScene />
      </div>
      <div className="hero-bottom">
        <a href="#projects" className="scroll-cue">
          <ArrowDown size={17} aria-hidden="true" /> Scroll to discover
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
          A little curiosity.
          <br />A lot of possibility.
        </span>
      </div>
    </section>
  );
}
