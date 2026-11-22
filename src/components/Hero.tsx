import { Fragment } from "react";
import { ArrowDown } from "lucide-react";
import { ActionLink } from "./Primitives";
import { HeroStage } from "./hero/HeroStage";
import { profile, archiveProjects } from "../data/portfolio";
import { featuredStudies } from "../data/workPresentation";
import { availability } from "../data/availability";

// Words rise in sequence through CSS alone, so the pre-rendered heading is the
// largest paint without waiting for JavaScript (see .hero-word in theme.css).
function SplitWords({ text, offset = 0 }: { text: string; offset?: number }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="hero-word-mask">
            <span
              className="hero-word"
              style={{ ["--i" as string]: offset + index }}
            >
              {word}
            </span>
          </span>{" "}
        </Fragment>
      ))}
    </>
  );
}

const heroSignals = [
  { value: "2+ yrs", label: "Hands-on engineering experience" },
  { value: String(featuredStudies.length), label: "Live, deployed projects" },
  {
    value: String(archiveProjects.length),
    label: "Repositories in the catalog",
  },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="hero"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <HeroStage />
      <div className="hero-layout section-container">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="status-dot" aria-hidden="true" />
            Harsh Gavand · Full-Stack &amp; AI Engineer
          </p>
          <h1 id="hero-title" data-chapter="hero">
            <SplitWords text="Building Reliable Full-Stack Applications," />
            <br />
            <span className="hero-accent">
              <SplitWords
                text="Backend APIs &amp; Production AI Workflows."
                offset={5}
              />
            </span>
          </h1>
          <p className="hero-tenure">
            <span>
              I’m Harsh Gavand, a Full-Stack Software Developer with{" "}
              <strong>2+ years</strong> of hands-on experience designing,
              developing, and deploying end-to-end web applications, scalable
              backend services, and AI-powered solutions.
            </span>
          </p>
          <div className="actions hero-actions">
            <ActionLink href="#projects" primary>
              Explore selected work
            </ActionLink>
            <ActionLink href={profile.resume} external>
              View Resume (PDF)
            </ActionLink>
            <a className="button button-ghost" href="#contact">
              Get in touch
            </a>
          </div>
          <p className="hero-location">
            <span className="status-dot" aria-hidden="true" />
            <span>{availability.hero}</span>
          </p>
        </div>
        <dl className="hero-signals" aria-label="At a glance">
          {heroSignals.map((signal) => (
            <div className="hero-signal" key={signal.label}>
              <dt>{signal.label}</dt>
              <dd>{signal.value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <a className="hero-scroll-cue" href="#experience">
        <span>Scroll to explore</span>
        <ArrowDown size={16} aria-hidden="true" />
      </a>
    </section>
  );
}
