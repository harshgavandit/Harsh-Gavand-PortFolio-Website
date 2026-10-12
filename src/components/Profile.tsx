import { ArrowUpRight } from "lucide-react";
import { aboutProfile, profile } from "../data/portfolio";
import { ActionLink, Reveal, SectionHeading } from "./Primitives";
import { Portrait } from "./Portrait";
import { SkillExplorer } from "./SkillExplorer";
import { ExperienceJourney } from "./ExperienceJourney";

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
          <Reveal className="about-portrait">
            <Portrait />
          </Reveal>
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
              <strong>{aboutProfile.experience}</strong>
              <p>Building and maintaining web applications.</p>
            </div>
            <div>
              <span>APPROACH</span>
              <strong>End to end.</strong>
              <p>Interface, business logic, data, and delivery.</p>
            </div>
            <div>
              <span>EDUCATION</span>
              <strong>{aboutProfile.education.degree}</strong>
              <p>{aboutProfile.education.details}</p>
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
      <ExperienceJourney />
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
      <SkillExplorer />
    </section>
  );
}
