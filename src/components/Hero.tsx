import { ArrowDown } from "lucide-react";
import { profile } from "../data/portfolio";
import { chapterNumber } from "../data/recruiter";
import { ActionLink } from "./Primitives";
import { EngineeringShowcase } from "./EngineeringShowcase";
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
            <ActionLink href={profile.resume} external>
              View résumé
            </ActionLink>
          </div>
          <p className="hero-location">
            <span className="status-dot" aria-hidden="true" /> Mumbai, India ·
            Open to Full-Stack, Backend &amp; AI Engineering Roles (Remote /
            Relocation)
          </p>
        </div>
        <EngineeringShowcase />
      </div>
      <div className="hero-credibility">
        <a href="#projects">
          <strong>4</strong>
          <span>End-to-end systems</span>
        </a>
        <a href="#experience">
          <strong>2+ yrs</strong>
          <span>Full-stack & backend engineering</span>
        </a>
        <div>
          <strong>Stack</strong>
          <span>TypeScript · Node.js · Python · React · AI</span>
        </div>
        <a
          className="hero-scroll"
          href="#projects"
          aria-label="Continue to selected work"
        >
          <ArrowDown size={20} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
