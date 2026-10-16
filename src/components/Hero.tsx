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
          <h1 id="hero-title" data-chapter="hero">
            I Help Founder's
            <br />
            <span>Build Reliable And Scalable Products.</span>
          </h1>
          <p className="hero-tenure">
            <strong>2+ years</strong>{" "}
            <span>
              building full-stack products, backend services, and applied AI
              workflows.
            </span>
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
        <figure className="hero-portrait">
          <img
            src="/portrait/harsh-studio.jpg"
            width={335}
            height={745}
            loading="eager"
            fetchPriority="high"
            alt="Harsh Gavand"
          />
        </figure>
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
