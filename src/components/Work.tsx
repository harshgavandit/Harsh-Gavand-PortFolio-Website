import { projectGroup } from "../lib/portfolioActions";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Search } from "lucide-react";
import {
  caseStudies,
  projects,
  type CaseStudy,
  type Project,
} from "../data/portfolio";
import { ActionLink, Reveal, SectionHeading, Tags } from "./Primitives";
import { ProjectWalkthrough } from "./ProjectWalkthrough";
import { DeveloperLab } from "./DeveloperLab";

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

export function ProjectCaseStudy({
  study,
  project,
  index,
}: {
  study: CaseStudy;
  project: Project;
  index: number;
}) {
  return (
    <Reveal>
      <article
        className="case-study"
        id={`project-${project.id}`}
        tabIndex={-1}
        aria-labelledby={`project-title-${project.id}`}
      >
        <div className="case-topline">
          <span className="project-number">0{index + 1}</span>
          <span className="eyebrow">{project.category}</span>
          <span
            className={`project-status ${project.demoUrl ? "status-live" : ""}`}
          >
            <span />
            {project.demoUrl ? "Live demo available" : "Source available"}
          </span>
        </div>
        <div className="case-layout">
          <div className="case-copy">
            <h3 id={`project-title-${project.id}`}>{study.shortName}</h3>
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
          <ProjectWalkthrough study={study} project={project} />
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
}

function CaseStudyExhibit({
  study,
  project,
  index,
}: {
  study: CaseStudy;
  project: Project;
  index: number;
}) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const reveal = () => {
      if (
        window.location.hash === `#project-${project.id}` &&
        disclosure.current
      ) {
        disclosure.current.open = true;
        requestAnimationFrame(() =>
          document
            .getElementById(`project-${project.id}`)
            ?.scrollIntoView({ block: "start" }),
        );
      }
    };
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, [project.id]);
  return (
    <details className={`work-exhibit exhibit-${index}`} ref={disclosure}>
      <summary aria-label={`Explore ${study.shortName} case study`}>
        <div className="exhibit-visual">
          <span className="exhibit-label">
            0{index + 1} /{" "}
            {study.image ? "PRODUCT CAPTURE" : "IMPLEMENTATION MAP"}
          </span>
          {study.image ? (
            <img
              src={`/projects/${study.image}-1280.webp`}
              srcSet={`/projects/${study.image}-640.webp 640w, /projects/${study.image}-1280.webp 1280w`}
              sizes="(min-width: 900px) 45vw, 100vw"
              width="1280"
              height="722"
              loading="lazy"
              alt={study.imageAlt}
            />
          ) : (
            <div className="exhibit-system">
              <span>{study.diagram?.title}</span>
              <ol>
                {study.diagram?.nodes.map((node, i) => (
                  <li key={node}>
                    <span>0{i + 1}</span>
                    <strong>{node}</strong>
                    <ArrowRight size={16} aria-hidden="true" />
                  </li>
                ))}
              </ol>
            </div>
          )}
          <span className="exhibit-open" aria-hidden="true">
            <ArrowUpRight size={23} />
          </span>
        </div>
        <div className="exhibit-copy">
          <span className="eyebrow">{project.category}</span>
          <h3>{study.shortName}</h3>
          <p>{study.problem}</p>
          <div className="exhibit-meta">
            <span>{project.technologies.slice(0, 3).join(" / ")}</span>
            <span className="exhibit-action">
              Explore the build <span aria-hidden="true">+</span>
            </span>
          </div>
        </div>
      </summary>
      <div className="exhibit-expanded">
        <ProjectCaseStudy study={study} project={project} index={index} />
        <button
          className="exhibit-close text-link"
          onClick={() => {
            if (!disclosure.current) return;
            disclosure.current.open = false;
            const summary = disclosure.current.querySelector("summary");
            summary?.focus({ preventScroll: true });
            summary?.scrollIntoView({ block: "center" });
          }}
        >
          Close case study <span aria-hidden="true">−</span>
        </button>
      </div>
    </details>
  );
}

export function FeaturedWork() {
  const labDisclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const revealLab = () => {
      if (!labDisclosure.current) return;
      labDisclosure.current.open = true;
      requestAnimationFrame(() => {
        labDisclosure.current?.scrollIntoView({ block: "start" });
        labDisclosure.current
          ?.querySelector<HTMLInputElement>(".lab-search input")
          ?.focus({ preventScroll: true });
      });
    };
    window.addEventListener("explore-project", revealLab);
    return () => window.removeEventListener("explore-project", revealLab);
  }, []);
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
            Selected work.
            <br />
            <span className="muted-heading">Built end to end.</span>
          </span>
        }
        description="Four different problems. One considered approach. Explore the products and the engineering behind them."
      />
      <div className="case-study-list">
        {caseStudies.map((study, index) => {
          const project = projects.find((p) => p.id === study.projectId)!;
          return (
            <CaseStudyExhibit
              key={project.id}
              study={study}
              project={project}
              index={index}
            />
          );
        })}
      </div>
      <details className="lab-disclosure" ref={labDisclosure}>
        <summary>
          <span>
            <span className="eyebrow">THE ENGINEERING INDEX</span>
            <strong>Go deeper into the work.</strong>
          </span>
          <span>
            Search all {projects.length} projects{" "}
            <ArrowUpRight size={20} aria-hidden="true" />
          </span>
        </summary>
        <DeveloperLab />
      </details>
      <a href="#all-projects" className="section-end-link">
        There’s more to explore{" "}
        <span>{projects.length - caseStudies.length} additional projects</span>
        <ArrowDown size={18} aria-hidden="true" />
      </a>
    </section>
  );
}

const filters = ["All", "AI & ML", "Web & SaaS", "APIs & Tools"] as const;
export function MoreWork() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("All");
  const [limit, setLimit] = useState(6);
  const searchRef = useRef<HTMLInputElement>(null);
  const projectHeadingRefs = useRef(new Map<number, HTMLHeadingElement>());
  const pendingProjectFocus = useRef<number | null>(null);
  useEffect(() => {
    if (pendingProjectFocus.current === null) return;
    const heading = projectHeadingRefs.current.get(pendingProjectFocus.current);
    pendingProjectFocus.current = null;
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: "center" });
  }, [limit]);
  const secondary = useMemo(
    () =>
      projects.filter((p) => !caseStudies.some((c) => c.projectId === p.id)),
    [],
  );
  const filtered = secondary.filter(
    (p) =>
      (filter === "All" || projectGroup(p) === filter) &&
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
        number="05"
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
      <details className="archive-disclosure">
        <summary>
          <span>
            <strong>{secondary.length.toString().padStart(2, "0")}</strong> More
            builds. Different challenges.
          </span>
          <span>
            Open the archive <ArrowDown size={18} aria-hidden="true" />
          </span>
        </summary>
        <div className="archive-controls">
          <div
            className="filter-list"
            role="group"
            aria-label="Filter projects"
          >
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
              ref={searchRef}
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
          Showing {Math.min(limit, filtered.length)} of {filtered.length}{" "}
          matching projects · {secondary.length} in the archive
        </p>
        <div className="archive-grid" id="archive-results">
          {filtered.slice(0, limit).map((project) => (
            <article key={project.id} className="archive-card">
              <div className="archive-top">
                <span className="eyebrow">{project.category}</span>
                <ArrowUpRight size={20} aria-hidden="true" />
              </div>
              <h3
                tabIndex={-1}
                ref={(heading) => {
                  if (heading)
                    projectHeadingRefs.current.set(project.id, heading);
                  else projectHeadingRefs.current.delete(project.id);
                }}
              >
                {project.title}
              </h3>
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
              onClick={() => {
                pendingProjectFocus.current = filtered[limit]?.id ?? null;
                setLimit((n) => n + 6);
              }}
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
                setLimit(6);
                searchRef.current?.focus();
              }}
            >
              Reset filters <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </details>
    </section>
  );
}
