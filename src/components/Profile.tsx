import {
  aboutProfile,
  engineeringSprints,
  profile,
} from "../data/portfolio";
import { experienceForDisplay as experience } from "../data/experiencePresentation";

import { HeroStack } from "./HeroStack";

import { LeadStatement, Tags } from "./Primitives";

export function Experience() {
  return (
    <section
      id="experience"

      data-chapter="experience"

      className="section section-container"

      tabIndex={-1}

      aria-label="Professional experience"
    >
      <div className="experience-list">
        {experience.map((job, index) => (
          <article
            className="experience-card"

            id={`experience-${index}`}

            key={job.company}
          >
            <div className="experience-meta">
              <span className="eyebrow">{job.company}</span>

              <p>
                {job.period}
                {index === 0 && " · Full-time"}
              </p>

              <p>Based in {profile.location}</p>
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
                <summary>Technologies</summary>
                <Tags items={job.tech} />
              </details>
            </div>
          </article>
        ))}
      </div>

      <div className="profile-brief" id="about">
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

          <h3>Curious about the whole system.</h3>

          <p>{aboutProfile.summary}</p>
        </div>

        <div className="education-card">
          <span className="eyebrow">Education</span>

          <h4>{aboutProfile.education.degree}</h4>

          <p>{aboutProfile.education.details}</p>

          <span className="eyebrow">Based in</span>

          <p>
            {profile.location} · {profile.workPreference}
          </p>
        </div>
      </div>

      <div className="recognition" id="hackathon-recognition">
        <span className="eyebrow">Hackathons & recognition</span>

        <div className="recognition-grid">
          {aboutProfile.recognition.map((item, index) => (
            <div key={item}>
              <strong>{["Top 5", "Top 10", "Top 100"][index]}</strong>

              <p>{item.split(" — ")[1]}</p>

              {index < 2 && (
                <a
                  className="text-link"

                  href={
                    index === 0
                      ? "https://github.com/harshgavandit/SuperVity-AutoPilot-AI-Hackathon"
                      : "https://github.com/harshgavandit/OpenAI_Project-"
                  }

                  target="_blank"

                  rel="noopener noreferrer"
                >
                  View project ↗
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="engineering-sprints" aria-labelledby="sprints-title">
        <h3 id="sprints-title">Hackathons &amp; Engineering Sprints</h3>

        <div className="sprints-grid">
          {engineeringSprints.map((sprint) => (
            <article key={sprint.title}>
              <span className="eyebrow">{sprint.kind}</span>

              <h4>{sprint.title}</h4>

              <p>{sprint.summary}</p>

              {sprint.href && (
                <a
                  className="text-link"

                  href={sprint.href}

                  target="_blank"

                  rel="noopener noreferrer"
                >
                  Explore the build ↗
                </a>
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
          <span className="eyebrow">Try the implementation</span>
          <h3>A working AI workspace.</h3>
          <p>
            Ask the code, compare a role, or run a live ticket-classification
            workflow.
          </p>
        </div>
        <a className="button button-secondary" href="/ai/">
          Explore AI tools ↗
        </a>
      </aside>
      <details className="full-stack-disclosure" id="workflow">
        <summary>
          View full stack <span>Languages, frameworks & infrastructure</span>
        </summary>
        <HeroStack />
      </details>

    </section>
  );
}
