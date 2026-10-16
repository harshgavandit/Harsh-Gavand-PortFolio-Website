import { ArrowUpRight } from "lucide-react";
import { ActionLink, Tags } from "./Primitives";
import { profile } from "../data/portfolio";
import { primaryStack } from "../data/workPresentation";

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
          <p className="eyebrow" data-chapter="hero">
            Introduction
          </p>
          <p className="hero-name">
            HARSH GAVAND / FULL-STACK &amp; AI ENGINEER
          </p>
          <h1 id="hero-title">
            From business workflows.
            <br />
            <span>
              To applied AI
              <br />
              systems.
            </span>
          </h1>
          <p className="hero-description">
            Delivered quotation, invoicing, and email-automation tools at
            GlobeTrek. Explore the React interfaces, Python and Node.js APIs,
            and applied AI workflows behind my work.
          </p>
          <p className="hero-tenure">
            <strong>2+ years</strong> building full-stack products, backend
            services, and applied AI workflows.
          </p>
          <div className="actions">
            <ActionLink href="#projects" primary>
              Explore selected work
            </ActionLink>
            <ActionLink href={profile.resume} external>
              View Resume (PDF)
            </ActionLink>
          </div>
          <p className="hero-location">
            <span className="status-dot" aria-hidden="true" />
            Mumbai, India · Remote only
          </p>
          <Tags items={primaryStack} />
        </div>
        <a
          className="hero-project"
          href="/work/ugc-platform/"
          aria-label="Explore UGC Content Studio case study"
        >
          <div className="hero-project-top">
            <span className="eyebrow">Selected build</span>
            <ArrowUpRight size={20} aria-hidden="true" />
          </div>
          <div className="hero-product-image">
            <img
              src="/evidence/ugc-workspace.png"
              width={1280}
              height={900}
              loading="eager"
              fetchPriority="high"
              alt="UGC Content Studio sample workspace with bundled reference images and a saved sample output"
            />
          </div>
          <div className="hero-project-caption">
            <h2>UGC Content Studio</h2>
            <p>Authenticated references → AI generation → persisted media</p>
            <span>Read-only sample workspace · Explore the workflow ↗</span>
          </div>
        </a>
      </div>
      <div className="hero-employment">
        <span>Previously</span>
        <a href="#experience">GlobeTrek · AI-Native Full-Stack Developer</a>
        <span aria-hidden="true">/</span>
        <a href="#experience">HRP Enterprises · Full-Stack Developer</a>
      </div>
    </section>
  );
}
