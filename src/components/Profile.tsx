import { aboutProfile, profile } from "../data/portfolio";
import { experienceForDisplay as experience } from "../data/experiencePresentation";
import { recognitionItems } from "../data/recognition";
import { availability } from "../data/availability";
import { HeroStack } from "./HeroStack";
import { LeadStatement, Tags } from "./Primitives";

export function Experience() {
  return (
    <section
      id="experience"
      data-chapter="experience"
      className="section section-container"
      tabIndex={-1}
      aria-label="Experience & Impact"
    >
      <h2 className="section-title">Experience &amp; Impact</h2>
      <div className="experience-list">
        {experience.map((job, index) => (
          <article
            className="experience-card"
            id={`experience-${index}`}
            key={job.company}
          >
            <div className="experience-meta">
              <span className="eyebrow">{job.company}</span>
              <p>{job.period}</p>
              <p>{job.context}</p>
              <p>{profile.location}</p>
            </div>
            <div>
              <h3>{job.role}</h3>
              <p className="shipment-banner">
                <span>Delivered</span>
                {job.shipment}
              </p>
              <ul className="engineering-bullets">
                {job.points.map((point) => (
                  <li key={point}>
                    <LeadStatement text={point} />
                  </li>
                ))}
              </ul>
              <details className="role-context">
                <summary>Core technologies</summary>
                <Tags items={job.tech} />
              </details>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function About() {
  return (
    <section
      id="about"
      data-chapter="about"
      className="section section-container"
      tabIndex={-1}
      aria-label="About & Recognition"
    >
      <div className="profile-brief">
        <div className="about-summary">
          <img
            className="profile-photo"
            src="/portrait/harsh-profile.webp"
            width={270}
            height={600}
            loading="lazy"
            alt="Harsh Gavand"
          />
          <span className="eyebrow">About me</span>
          <h2 className="section-title">Curious about the whole system.</h2>
          <p>{aboutProfile.summary}</p>
        </div>
        <div className="education-card">
          <span className="eyebrow">Education</span>
          <h3>{aboutProfile.education.degree}</h3>
          <p>{aboutProfile.education.details}</p>
          <span className="eyebrow">Based in</span>
          <p>{availability.about}</p>
        </div>
      </div>
      <div
        className="recognition"
        id="hackathon-recognition"
        aria-labelledby="recognition-title"
      >
        <h3 id="recognition-title">Hackathons &amp; recognition</h3>
        <div className="recognition-grid">
          {recognitionItems.map((item) => (
            <article key={item.title}>
              <strong>{item.badge}</strong>
              <h4>{item.title}</h4>
              <p className="recognition-context">{item.context}</p>
              {item.summary && <p>{item.summary}</p>}
              {item.href && (
                <div className="recognition-links">
                  <a
                    className="text-link"
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.linkLabel ?? "Explore the build"} ↗
                  </a>
                  {item.repositoryHref && (
                    <a
                      className="text-link"
                      href={item.repositoryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      XERJ on GitHub ↗
                    </a>
                  )}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section
      id="skills"
      className="section section-container"
      tabIndex={-1}
      data-chapter="skills"
      aria-label="Skills"
    >
      <aside className="ai-workspace-teaser">
        <div>
          <h2 className="section-title">Architecture &amp; Skills</h2>
          <p>
            Explore the code, compare a role, or inspect structured ticket
            routing.
          </p>
        </div>
        <a className="button button-secondary" href="/ai/">
          Explore AI tools ↗
        </a>
      </aside>
      <details className="full-stack-disclosure" id="workflow">
        <summary>
          View full stack{" "}
          <span>Core languages, frameworks &amp; infrastructure</span>
        </summary>
        <HeroStack />
      </details>
    </section>
  );
}
