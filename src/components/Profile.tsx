import {
  aboutProfile,
  engineeringSprints,
  experience,
  profile,
  skills,
} from "../data/portfolio";

import { HeroStack } from "./HeroStack";

import { EngineeringShowcase } from "./EngineeringShowcase";

import { resumeStackGroups } from "../data/heroStack";

import { ChapterHeading, LeadStatement, Tags } from "./Primitives";

export function Experience() {
  return (
    <section
      id="experience"

      className="section section-container"

      tabIndex={-1}

      aria-labelledby="experience-title"
    >
      <ChapterHeading
        id="experience"

        title="Professional experience."

        description="Business applications, operational data, and responsive product delivery."
      />

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

      aria-labelledby="skills-title"
    >
      <ChapterHeading
        id="skills"

        title="Tools, systems & implementation."

        description="The technologies and patterns I use across applications, APIs, data, and AI workflows."
      />

      <div className="skills-grid">
        {skills.map((group, index) => (
          <article key={group.title}>
            <span className="eyebrow">
              0{index + 1} / {group.title}
            </span>

            <h3>{group.description}</h3>

            <p className="skill-patterns">
              <strong>Applied patterns:</strong> {group.patterns}
            </p>

            <div
              className="skill-proofs"

              aria-label={`${group.title} projects`}
            >
              {group.proofs.map((proof) => (
                <a key={proof.href} href={proof.href}>
                  {proof.label} ↗
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>

      <details className="full-stack-disclosure" id="workflow">
        <summary>
          View full stack <span>Languages, frameworks & infrastructure</span>
        </summary>
        <HeroStack />
        <div className="additional-stack">
          <h3>Additional implementation tools & patterns</h3>
          <Tags
            items={[...new Set(skills.flatMap((group) => group.items))].filter(
              (item) =>
                !new Set(
                  resumeStackGroups.flatMap((group) =>
                    group.items.map((item) => item.name.toLowerCase()),
                  ),
                ).has(item.toLowerCase()),
            )}
          />
        </div>
      </details>

      <details className="engineering-lab" id="engineering-lab">
        <summary>
          Engineering field notes{" "}
          <span>Quota lifecycle, failure scenarios & source code</span>
        </summary>
        <EngineeringShowcase />
      </details>
    </section>
  );
}
