import { useMemo, useState } from "react";
import { archiveProjects as projects } from "../data/portfolio";
import { ActionLink, Tags } from "./Primitives";
import { ProjectNotes } from "./Work";
import { workPath } from "../lib/projectNavigation";
import { matchesProjectCollection } from "../lib/portfolioActions";

export function ProjectArchive() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All projects");
  const visible = useMemo(
    () =>
      projects.filter(
        (project) =>
          matchesProjectCollection(project, filter) &&
          `${project.title} ${project.aliases?.join(" ") || ""} ${project.githubUrl} ${project.category} ${project.overview} ${project.technologies.join(" ")}`
            .toLowerCase()
            .includes(query.trim().toLowerCase()),
      ),
    [query, filter],
  );
  return (
    <main id="main" className="section-container archive-page" tabIndex={-1}>
      <a className="text-link" href="/#projects">
        ← Selected work
      </a>
      <span className="eyebrow">
        Project catalog / {projects.length} repositories
      </span>
      <h1>The complete build log.</h1>
      <p className="archive-intro">
        Applications, APIs, AI experiments, and the implementation details
        behind them. Start with the selected work for complete product
        walkthroughs.
      </p>
      <div className="archive-controls">
        <label htmlFor="archive-search">
          Search projects or technologies
          <input
            id="archive-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Python, APIs, retrieval…"
          />
        </label>
        <div
          className="archive-filters"
          role="group"
          aria-label="Filter project catalog"
        >
          {[
            "All projects",
            "Latest AI",
            "AI & ML",
            "APIs & Tools",
            "Web & SaaS",
          ].map((label) => (
            <button
              key={label}
              aria-pressed={filter === label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="archive-count" role="status">
        {visible.length} projects
      </p>
      <ol className="project-directory-list">
        {visible.map((project) => (
          <li data-project-id={project.id} id={project.slug} key={project.id}>
            <article>
              <header>
                <div>
                  <h2>{project.title}</h2>
                </div>
                <div className="actions">
                  {project.demoUrl && (
                    <ActionLink href={project.demoUrl} primary external>
                      Live demo
                    </ActionLink>
                  )}
                  <ActionLink href={project.githubUrl} external>
                    GitHub source
                  </ActionLink>
                </div>
              </header>
              <p>{project.overview}</p>
              <Tags items={project.technologies} />
              {workPath(project.slug) && (
                <a className="text-link" href={workPath(project.slug)!}>
                  Focused case study ↗
                </a>
              )}
              <details>
                <summary>Contribution, engineering decisions & outcome</summary>
                <ProjectNotes project={project} />
              </details>
            </article>
          </li>
        ))}
      </ol>
      {!visible.length && (
        <p className="empty-state">
          No projects match that search. Try a technology or clear the filter.
        </p>
      )}
    </main>
  );
}
