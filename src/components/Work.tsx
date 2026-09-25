import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Search,
} from "lucide-react";
import {
  caseStudies,
  projects,
  type CaseStudy,
  type Project,
} from "../data/portfolio";
import { ActionLink, Reveal, SectionHeading, Tags } from "./Primitives";

function ProjectVisual({
  study,
  project,
}: {
  study: CaseStudy;
  project: Project;
}) {
  return (
    <figure
      className={`project-visual ${study.image ? "has-screenshot" : "has-diagram"}`}
    >
      <div className="browser-frame">
        <div className="browser-chrome">
          <span className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            {study.image
              ? new URL(project.demoUrl!).hostname
              : "ENGINEERING / SYSTEM OVERVIEW"}
          </span>
          <ArrowUpRight size={13} aria-hidden="true" />
        </div>
        {study.image ? (
          <img
            src={`/projects/${study.image}-1280.webp`}
            srcSet={`/projects/${study.image}-640.webp 640w, /projects/${study.image}-1280.webp 1280w`}
            sizes="(min-width: 1000px) 55vw, 100vw"
            width="1280"
            height="722"
            alt={study.imageAlt}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="pipeline-visual">
            <div className="pipeline-heading">
              <Code2 size={22} aria-hidden="true" />
              <span>{study.diagram?.title}</span>
            </div>
            <ol>
              {study.diagram?.nodes.map((node, i) => (
                <li key={node}>
                  <span className="pipeline-step">0{i + 1}</span>
                  <span>{node}</span>
                  {i < (study.diagram?.nodes.length ?? 0) - 1 ? (
                    <ArrowDown size={14} aria-hidden="true" />
                  ) : (
                    <Check size={15} aria-hidden="true" />
                  )}
                </li>
              ))}
            </ol>
            <span className="pipeline-note">CONNECTED BY DESIGN.</span>
          </div>
        )}
      </div>
      <figcaption>
        {study.image
          ? `Actual project screenshot${project.id === 1 ? " · sign-in required" : " · public landing page"}`
          : study.diagram?.caption}
      </figcaption>
    </figure>
  );
}

function ProjectDetails({ project }: { project: Project }) {
  return (
    <details className="project-details">
      <summary>
        Explore implementation <span aria-hidden="true">+</span>
      </summary>
      <div className="details-body">
        <h4>Product overview</h4>
        <p>{project.overview}</p>
        <h4>My contribution</h4>
        <p>{project.role}</p>
        <h4>Features implemented</h4>
        <ul>
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <h4>Engineering challenge</h4>
        <p>{project.challenges}</p>
        <h4>Outcome</h4>
        <p>{project.impact}</p>
      </div>
    </details>
  );
}

export function FeaturedWork() {
  return (
    <section
      id="projects"
      className="section section-container"
      tabIndex={-1}
      aria-labelledby="featured-title"
    >
      <SectionHeading
        number="01"
        label="Selected work"
        title={
          <span id="featured-title">
            The work.
            <br />
            <span className="muted-heading">The thinking behind it.</span>
          </span>
        }
        description="A closer look at the products, systems, and decisions that turn an idea into something useful."
      />
      <div className="case-study-list">
        {caseStudies.map((study, index) => {
          const project = projects.find((p) => p.id === study.projectId)!;
          return (
            <Reveal key={project.id}>
              <article
                className="case-study"
                id={`project-${project.id}`}
                aria-labelledby={`project-title-${project.id}`}
              >
                <div className="case-topline">
                  <span className="project-number">0{index + 1}</span>
                  <span className="eyebrow">{project.category}</span>
                  <span
                    className={`project-status ${project.demoUrl ? "status-live" : ""}`}
                  >
                    <span />
                    {project.demoUrl
                      ? "Live demo available"
                      : "Source available"}
                  </span>
                </div>
                <div className="case-layout">
                  <div className="case-copy">
                    <h3 id={`project-title-${project.id}`}>
                      {study.shortName}
                    </h3>
                    <p className="project-problem">{study.problem}</p>
                    <p className="project-summary">{study.summary}</p>
                    <dl className="role-meta">
                      <div>
                        <dt>ROLE</dt>
                        <dd>
                          {project.id === 17
                            ? "Backend & AI Developer"
                            : "Full-Stack Developer"}
                        </dd>
                      </div>
                      <div>
                        <dt>FOCUS</dt>
                        <dd>
                          {project.id === 17
                            ? "Pipeline · Data · AI · Delivery"
                            : "Frontend · APIs · Integrations"}
                        </dd>
                      </div>
                    </dl>
                    <Tags items={project.technologies} />
                    <div className="actions">
                      {project.demoUrl && (
                        <ActionLink href={project.demoUrl} primary external>
                          Live demo
                        </ActionLink>
                      )}
                      <ActionLink href={project.githubUrl} external>
                        Source code
                      </ActionLink>
                    </div>
                  </div>
                  <ProjectVisual study={study} project={project} />
                </div>
                <div className="contribution-grid">
                  {study.contributions.map((item, i) => (
                    <div key={item.label}>
                      <span className="contribution-number">0{i + 1}</span>
                      <h4>{item.label}</h4>
                      <p>{item.description}</p>
                    </div>
                  ))}
                </div>
                <ProjectDetails project={project} />
              </article>
            </Reveal>
          );
        })}
      </div>
      <a href="#all-projects" className="section-end-link">
        There’s more to explore{" "}
        <span>{projects.length - caseStudies.length} additional projects</span>
        <ArrowDown size={18} aria-hidden="true" />
      </a>
    </section>
  );
}

const filters = ["All", "AI & ML", "Web & SaaS", "APIs & Tools"] as const;
function group(project: Project) {
  if (/AI|Learning|Prediction|GPT/.test(project.title + project.category))
    return "AI & ML";
  if (
    /API|Automation|Authentication|Django|Employee/.test(
      project.title + project.category,
    )
  )
    return "APIs & Tools";
  return "Web & SaaS";
}

export function MoreWork() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [limit, setLimit] = useState(6);
  const secondary = useMemo(
    () =>
      projects.filter((p) => !caseStudies.some((c) => c.projectId === p.id)),
    [],
  );
  const filtered = secondary.filter(
    (p) =>
      (filter === "All" || group(p) === filter) &&
      `${p.title} ${p.category} ${p.technologies.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  return (
    <section
      id="all-projects"
      className="section section-container"
      tabIndex={-1}
      aria-labelledby="archive-title"
    >
      <SectionHeading
        number="04"
        label="Project archive"
        title={
          <span id="archive-title">
            More problems.
            <br />
            <span className="muted-heading">More possibilities.</span>
          </span>
        }
        description="Real-time communication, machine learning, enterprise applications, and everything in between."
      />
      <div className="archive-controls">
        <div className="filter-list" role="group" aria-label="Filter projects">
          {filters.map((item) => (
            <button
              key={item}
              aria-pressed={filter === item}
              onClick={() => {
                setFilter(item);
                setLimit(6);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search projects</span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setLimit(6);
            }}
            placeholder="Search name or technology"
            type="search"
          />
        </label>
      </div>
      <p className="results-count" role="status">
        Showing {Math.min(limit, filtered.length)} of {filtered.length} matching
        projects · {secondary.length} in the archive
      </p>
      <div className="archive-grid" id="archive-results">
        {filtered.slice(0, limit).map((project) => (
          <article key={project.id} className="archive-card">
            <div className="archive-top">
              <span className="eyebrow">{project.category}</span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </div>
            <h3>{project.title}</h3>
            <p>{project.overview.split(". ")[0]}.</p>
            <div className="archive-contribution">
              <span>MY CONTRIBUTION</span>
              <p>{project.role}</p>
            </div>
            <Tags items={project.technologies} />
            <div className="archive-links">
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Source code for ${project.title}`}
              >
                Source <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Live demo for ${project.title}`}
                >
                  Live demo <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ) : (
                <span>Source available</span>
              )}
            </div>
            <ProjectDetails project={project} />
          </article>
        ))}
      </div>
      {limit < filtered.length && (
        <div className="archive-more">
          <button
            className="button button-secondary"
            aria-controls="archive-results"
            onClick={() => setLimit((n) => n + 6)}
          >
            Show more projects <ArrowDown size={16} aria-hidden="true" />
          </button>
        </div>
      )}
      {filtered.length === 0 && (
        <div className="empty-state">
          <h3>No matching projects.</h3>
          <p>Try another name or technology.</p>
          <button
            className="button button-secondary"
            onClick={() => {
              setFilter("All");
              setQuery("");
            }}
          >
            Reset filters <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}
