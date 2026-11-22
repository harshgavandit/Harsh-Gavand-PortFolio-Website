import {
  ArrowUpRight,
  BriefcaseBusiness,
  GraduationCap,
  MapPin,
} from "lucide-react";
import { aboutProfile, profile } from "../data/portfolio";
import { experienceForDisplay as experience } from "../data/experiencePresentation";
import { recognitionItems } from "../data/recognition";
import { availability } from "../data/availability";
import { HeroStack } from "./HeroStack";
import { AIEngineering } from "./AIEngineering";
import { LeadStatement, Tags } from "./Primitives";
import { privateProjects } from "../data/privateProjects";

export function Experience() {
  return (
    <section
      id="experience"
      data-chapter="experience"
      className="section section-container"
      tabIndex={-1}
      aria-label="Experience & Impact"
    >
      <div className="section-intro" data-reveal>
        <p className="eyebrow">Career</p>
        <h2 className="section-title">Experience &amp; Impact</h2>
        <p className="section-lede">
          Production roles across full-stack delivery, backend APIs and
          AI-assisted business workflows.
        </p>
      </div>
      <div className="timeline">
        <div className="timeline-rail" aria-hidden="true">
          <span className="timeline-progress" />
        </div>
        <ol className="experience-list">
          {experience.map((job, index) => (
            <li className="timeline-item" key={job.company}>
              <span className="timeline-node" aria-hidden="true" />
              <article
                className="experience-card"
                id={`experience-${index}`}
                data-reveal
              >
                <div className="experience-meta">
                  <span className="eyebrow">{job.company}</span>
                  <p className="experience-period">{job.period}</p>
                  <p>{job.context}</p>
                  <p>{profile.location}</p>
                </div>
                <div className="experience-body">
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
                  <div className="role-context">
                    <h4>Core technologies</h4>
                    <Tags items={job.tech} />
                  </div>
                  {index === 0 &&
                    privateProjects.map((project) => (
                      <details
                        className="role-project"
                        id={`${project.slug}-details`}
                        key={project.slug}
                      >
                        <summary>
                          <span className="eyebrow">
                            Private internal project
                          </span>
                          {project.title}
                        </summary>
                        <div className="role-project-body">
                          <p>{project.overview}</p>
                          {project.preview && (
                            <figure>
                              <a
                                href={project.preview.src}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`View full-size ${project.title} screenshot`}
                              >
                                <img
                                  src={project.preview.src}
                                  alt={project.preview.alt}
                                  width={project.preview.width}
                                  height={project.preview.height}
                                  loading="lazy"
                                />
                              </a>
                              <figcaption>{project.preview.caption}</figcaption>
                            </figure>
                          )}
                          <h4>Features</h4>
                          <ul className="engineering-bullets">
                            {project.features.map((feature) => (
                              <li key={feature}>{feature}</li>
                            ))}
                          </ul>
                          <h4>My contribution</h4>
                          <p>{project.role}</p>
                          <h4>Business impact</h4>
                          <p>{project.impact}</p>
                          <h4>Tech stack</h4>
                          <Tags items={project.technologies} />
                          <h4>Keywords</h4>
                          <ul className="tags" aria-label="Project keywords">
                            {project.keywords.map((keyword) => (
                              <li key={keyword}>{keyword}</li>
                            ))}
                          </ul>
                          <p className="project-boundary">
                            Source code and application access are not public.
                          </p>
                        </div>
                      </details>
                    ))}
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const journey = [
  {
    icon: BriefcaseBusiness,
    date: experience[1].period.split(" — ")[0],
    title: `${experience[1].role} · ${experience[1].company}`,
  },
  {
    icon: GraduationCap,
    date: "Jul 2025",
    title: aboutProfile.education.degree,
  },
  {
    icon: BriefcaseBusiness,
    date: experience[0].period.split(" — ")[0],
    title: `${experience[0].role} · ${experience[0].company}`,
  },
];

// Technologies from the summary beside the portrait, drifting in depth.
const aboutFloaters = [
  { label: "React", brand: "react", depth: 0.9 },
  { label: "Python", brand: "python", depth: -0.7 },
  { label: "LangGraph", brand: "langgraph", depth: 1.2 },
  { label: "FastAPI", brand: "fastapi", depth: -1 },
  { label: "Next.js", brand: "nextdotjs", depth: 0.6 },
];

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
        <figure className="about-portrait" data-reveal>
          <div className="about-floaters" aria-hidden="true">
            {aboutFloaters.map((item, index) => (
              <span
                key={item.label}
                className="about-floater depth-layer"
                data-depth={item.depth}
                style={{ ["--f" as string]: index }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width={16}
                  height={16}
                  focusable="false"
                >
                  <use href={`/stack/technology-logos.svg#${item.brand}`} />
                </svg>
                {item.label}
              </span>
            ))}
          </div>
          <div className="about-portrait-frame" data-tilt="5">
            <img
              className="profile-photo"
              src="/portrait/harsh-studio.jpg"
              width={335}
              height={745}
              loading="lazy"
              alt="Harsh Gavand"
            />
          </div>
          <figcaption>
            <span className="about-badge">
              <GraduationCap size={15} aria-hidden="true" />
              {aboutProfile.education.degree}
            </span>
            <span className="about-badge">
              <MapPin size={15} aria-hidden="true" />
              Mumbai · Remote worldwide
            </span>
          </figcaption>
        </figure>
        <div className="about-summary" data-reveal>
          <span className="eyebrow">About me</span>
          <h2 className="section-title">Curious about the whole system.</h2>
          <p>{aboutProfile.summary}</p>
          <ol className="journey" aria-label="Career and education milestones">
            {journey.map((step) => (
              <li key={step.title}>
                <step.icon size={16} aria-hidden="true" />
                <span className="journey-date">{step.date}</span>
                <span>{step.title}</span>
              </li>
            ))}
          </ol>
          <div className="education-card">
            <div>
              <span className="eyebrow">Education</span>
              <h3>{aboutProfile.education.degree}</h3>
              <p>{aboutProfile.education.details}</p>
            </div>
            <div>
              <span className="eyebrow">Based in</span>
              <p>{availability.about}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        className="recognition"
        id="hackathon-recognition"
        aria-labelledby="recognition-title"
      >
        <h3 id="recognition-title" data-reveal>
          Hackathons &amp; recognition
        </h3>
        <div className="recognition-grid" data-reveal-group>
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
      <div className="section-intro" data-reveal>
        <p className="eyebrow">Capabilities</p>
        <h2 className="section-title">Architecture &amp; Skills</h2>
        <p className="section-lede">
          How the AI systems are wired, and the stack used to build and ship
          them.
        </p>
      </div>
      <AIEngineering />
      <details className="full-stack-disclosure" id="workflow" open>
        <summary>
          Technology ecosystem{" "}
          <span>Core languages, frameworks &amp; infrastructure</span>
        </summary>
        <HeroStack />
      </details>
      <aside className="ai-workspace-teaser" data-reveal>
        <div>
          <span className="eyebrow">Interactive</span>
          <h3>Try the AI workspace</h3>
          <p>
            Explore the code, compare a role, or inspect structured ticket
            routing.
          </p>
        </div>
        <a className="button button-primary" href="/ai/">
          Explore AI tools <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </aside>
    </section>
  );
}
