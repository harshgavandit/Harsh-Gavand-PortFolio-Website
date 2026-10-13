import { m } from "framer-motion";
import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  GitBranch,
  Sparkles,
} from "lucide-react";
import {
  aboutProfile,
  caseStudies,
  experience,
  profile,
  projects,
} from "../data/portfolio";
import { ActionLink } from "./Primitives";
import { StudioScene } from "./StudioScene";
import { useMotionEnabled } from "./MotionPreferences";
import { openPortfolioAssistant } from "../lib/portfolioActions";
import "./cinematic.css";

export function Hero() {
  const enabled = useMotionEnabled();
  return (
    <section
      id="hero"
      className="hero section-container cinematic-hero atelier-hero lab-hero"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <div className="hero-topline">
        <span className="eyebrow">
          <Code2 size={14} aria-hidden="true" /> HARSH GAVAND / ENGINEERING
          PORTFOLIO
        </span>
        <span className="location">
          {profile.location} <span>↗</span>
        </span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <div className="lab-role-badge">
            <span /> FULL-STACK & AI DEVELOPER
          </div>
          <m.h1
            id="hero-title"
            initial={false}
            animate={enabled ? { opacity: [0.4, 1], y: [16, 0] } : undefined}
            transition={{ duration: 0.65 }}
          >
            From complex ideas
            <br />
            to <span>working systems.</span>
          </m.h1>
          <p className="hero-description">
            I build full-stack products and applied AI workflows. Explore the
            interfaces, architecture, and engineering decisions behind the work.
          </p>
          <div className="actions">
            <ActionLink href="#projects" primary>
              Enter the engineering lab
            </ActionLink>
            <ActionLink href={profile.github} external>
              GitHub
            </ActionLink>
          </div>
          <button
            className="hero-assistant-link"
            onClick={() => openPortfolioAssistant()}
            aria-haspopup="dialog"
          >
            <Sparkles size={16} aria-hidden="true" />
            <span>
              Have a question? <strong>Ask my portfolio</strong>
            </span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </button>
          <div className="hero-evidence">
            <span>
              <GitBranch size={14} /> Public source code
            </span>
            <span>
              <Code2 size={14} /> Architecture & implementation
            </span>
          </div>
        </div>
        <div className="hero-system-window">
          <div className="system-window-title">
            <span>
              <i /> SYSTEMS IN MOTION
            </span>
            <span>INTERACTIVE / 3D</span>
          </div>
          <StudioScene />
          <div className="system-window-footer">
            <span>interface</span>
            <i />
            <span>logic</span>
            <i />
            <span>intelligence</span>
          </div>
        </div>
      </div>
      <div
        className="lab-facts"
        role="group"
        aria-label="Portfolio at a glance"
      >
        <a href="#projects">
          <strong>{projects.length.toString().padStart(2, "0")}</strong>
          <span>
            Projects to explore<small>Source, stack & decisions</small>
          </span>
          <ArrowUpRight size={17} />
        </a>
        <a href="#projects">
          <strong>{caseStudies.length.toString().padStart(2, "0")}</strong>
          <span>
            Featured case studies<small>Inside the implementation</small>
          </span>
          <ArrowUpRight size={17} />
        </a>
        <a href="#experience">
          <strong>{aboutProfile.experience.replace(" years", "")}</strong>
          <span>
            Years of experience
            <small>{experience.length} professional roles</small>
          </span>
          <ArrowUpRight size={17} />
        </a>
      </div>
      <div className="hero-bottom">
        <a href="#projects">
          <ArrowDown size={15} /> Inspect the work
        </a>
        <span className="lab-micro">BUILT WITH INTENT. OPEN TO EXPLORE.</span>
        <a href="#contact">
          Let’s build something <ArrowUpRight size={14} />
        </a>
      </div>
    </section>
  );
}
