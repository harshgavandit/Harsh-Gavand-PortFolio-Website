import { ActionLink } from "./Primitives";
import { profile } from "../data/portfolio";

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
            Building Reliable Full-Stack Applications,
            <br />
            <span>Backend APIs &amp; Production AI Workflows.</span>
          </h1>
          <p className="hero-tenure">
            <span>
              Full-Stack Software Developer with <strong>2+ years</strong> of
              hands-on experience designing, developing, and deploying
              end-to-end web applications, scalable backend services, and
              AI-powered solutions.
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
            {profile.locationLabel}
          </p>
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
    </section>
  );
}
