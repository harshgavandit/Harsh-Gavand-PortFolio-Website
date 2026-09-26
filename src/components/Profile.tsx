import {
  ArrowUpRight,
  Braces,
  Database,
  Layers3,
  Sparkles,
  Terminal,
  Cloud,
} from "lucide-react";
import { experience, profile, skills } from "../data/portfolio";
import { ActionLink, Reveal, SectionHeading, Tags } from "./Primitives";

export function About() {
  return (
    <section
      id="about"
      className="section profile-section"
      tabIndex={-1}
      aria-labelledby="about-title"
    >
      <div className="section-container">
        <SectionHeading
          number="02"
          label="The engineer"
          title={
            <span id="about-title">
              A product mindset.
              <br />
              <span className="muted-heading">An engineer’s curiosity.</span>
            </span>
          }
        />
        <div className="about-layout">
          <Reveal>
            <p className="about-lead">
              I’m Harsh — a full-stack developer working at the intersection of{" "}
              <em>useful software</em> and <em>applied AI.</em>
            </p>
            <p className="body-copy">
              I build SaaS dashboards, real-time applications, AI tools, and
              data-backed platforms. My work connects responsive React
              interfaces with JavaScript and Python backends, thoughtful data
              models, and practical deployment workflows.
            </p>
            <p className="body-copy">
              I care about the details: clear architecture, accessible
              interfaces, predictable APIs, and a product that feels coherent
              from the first click to the last.
            </p>
            <ActionLink href={profile.resume} external>
              View updated resume
            </ActionLink>
          </Reveal>
          <Reveal className="profile-facts">
            <div>
              <span>EXPERIENCE</span>
              <strong>2+ years</strong>
              <p>Building and maintaining web applications.</p>
            </div>
            <div>
              <span>APPROACH</span>
              <strong>End to end.</strong>
              <p>Interface, business logic, data, and delivery.</p>
            </div>
            <div>
              <span>EDUCATION</span>
              <strong>B.Tech · Information Technology</strong>
              <p>Pillai University, Mumbai · July 2025 · CGPA 8.6</p>
            </div>
          </Reveal>
        </div>
        <div className="recognition">
          <span className="eyebrow">Beyond the day-to-day</span>
          <a
            href="https://github.com/harshgavandit/SuperVity-AutoPilot-AI-Hackathon.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Top 5</strong>
            <span>
              Supervity AI Hackathon
              <br />
              500+ participants · built in 24 hours
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a
            href="https://github.com/harshgavandit/OpenAI_Project-"
            target="_blank"
            rel="noopener noreferrer"
          >
            <strong>Top 10</strong>
            <span>
              OpenAI Builders Hackathon
              <br />
              Memory Graph AI · 500+ builders
            </span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <div>
            <strong>Top 100</strong>
            <span>
              Smart India Hackathon 2025
              <br />
              National level · 500+ teams
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section
      id="experience"
      className="section section-container"
      tabIndex={-1}
      aria-labelledby="experience-title"
    >
      <SectionHeading
        number="03"
        label="Experience"
        title={<span id="experience-title">Built in the real world.</span>}
        description="Hands-on ownership, collaborative delivery, and attention to the details that matter in production."
      />
      <div className="timeline">
        {experience.map((item, i) => (
          <Reveal key={item.company}>
            <article className="timeline-item">
              <div className="timeline-period">
                <span className="timeline-marker" />
                <span className="eyebrow">
                  0{i + 1} / {item.period}
                </span>
                <p>{item.company}</p>
              </div>
              <div>
                <h3>{item.role}</h3>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <Tags items={item.tech} />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

const icons = [Layers3, Braces, Database, Sparkles, Cloud, Terminal];
export function Skills() {
  return (
    <section
      id="skills"
      className="section section-container"
      tabIndex={-1}
      aria-labelledby="skills-title"
    >
      <SectionHeading
        number="05"
        label="The toolkit"
        title={
          <span id="skills-title">
            The right tools.
            <br />
            <span className="muted-heading">For the actual problem.</span>
          </span>
        }
        description="A practical stack that supports the work — chosen for the product, not the trend."
      />
      <div className="skills-grid">
        {skills.map((skill, i) => {
          const Icon = icons[i];
          return (
            <Reveal
              key={skill.title}
              delay={(i % 3) * 0.06}
              className="skill-card"
            >
              <div>
                <Icon size={21} aria-hidden="true" />
                <span className="eyebrow">0{i + 1}</span>
              </div>
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
              <Tags items={skill.items} />
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
