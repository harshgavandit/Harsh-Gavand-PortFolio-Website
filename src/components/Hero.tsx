import { ArrowDown } from "lucide-react";
import { chapterNumber } from "../data/recruiter";
import { ActionLink } from "./Primitives";
import { EngineeringShowcase } from "./EngineeringShowcase";
import { profile } from "../data/portfolio";
import { HeroStack } from "./HeroStack";
export function Hero() {
  return (
    <section
      id="hero"
      className="hero section-container"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <div className="hero-layout">
        <div className="hero-copy">
          <p className="eyebrow" data-chapter-number={chapterNumber("hero")}>
            {chapterNumber("hero")} / Introduction
          </p>
          <p className="hero-name">HARSH GAVAND / FULL-STACK & AI ENGINEER</p>
          <h1 id="hero-title">
            I build the interface.
            <br />
            <span>
              And the system
              <br />
              behind it.
            </span>
          </h1>
          <p className="hero-description">
            Full-stack applications, backend APIs, and applied AI workflows —
            from the data model and provider integration to the interface people
            use.
          </p>
          <div className="actions">
            <ActionLink href="#projects" primary>
              Explore selected work
            </ActionLink>
            <ActionLink href="#contact">Get in touch</ActionLink>
            <ActionLink href={profile.resume} external className="hero-resume">
              View Resume (PDF)
            </ActionLink>
          </div>
          <p className="hero-location">
            <span className="status-dot" aria-hidden="true" />
            {profile.availability}
          </p>
        </div>
        <EngineeringShowcase />
      </div>
      <div className="hero-credibility">
        <a href="#projects" className="role-proof">
          <strong>Full-Stack AI Engineer</strong>
          <span>Async AI pipelines · RBAC · Distributed state</span>
        </a>
        <a href="#experience" className="experience-proof">
          <strong>2+ Years</strong>
          <span>of building full-stack, backend and AI engineering</span>
        </a>
        <a
          className="hero-scroll"
          href="#projects"
          aria-label="Continue to selected work"
        >
          <ArrowDown size={20} aria-hidden="true" />
        </a>
      </div>
      <HeroStack />
    </section>
  );
}
