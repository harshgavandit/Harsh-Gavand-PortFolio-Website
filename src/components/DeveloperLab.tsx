import { projectGroup, openPortfolioAssistant } from "../lib/portfolioActions";
import { useEffect, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Boxes,
  Braces,
  Check,
  Code2,
  FileCode2,
  GitBranch,
  Layers3,
  Search,
  Sparkles,
} from "lucide-react";
import { caseStudies, projects } from "../data/portfolio";
import { ProjectArchitecture } from "./ProjectArchitecture";
import { Tags } from "./Primitives";
import { useMotionEnabled } from "./MotionPreferences";

const categories = [
  "Selected work",
  "All projects",
  "AI & ML",
  "Web & SaaS",
  "APIs & Tools",
];
const categoryIcons = [FileCode2, Boxes, Sparkles, Layers3, Braces];
const views = ["Overview", "Architecture", "Engineering"] as const;

export function DeveloperLab() {
  const [category, setCategory] = useState("Selected work");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(14);
  const [view, setView] = useState<(typeof views)[number]>("Overview");
  const motion = useMotionEnabled();
  const ordered = [...projects].sort((a, b) => {
    const ai = caseStudies.findIndex((s) => s.projectId === a.id);
    const bi = caseStudies.findIndex((s) => s.projectId === b.id);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });
  const filtered = ordered.filter(
    (p) =>
      (category === "All projects" ||
        (category === "Selected work"
          ? caseStudies.some((study) => study.projectId === p.id)
          : projectGroup(p) === category)) &&
      `${p.title} ${p.category} ${p.technologies.join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase().trim()),
  );
  const project = filtered.find((p) => p.id === selectedId) ?? filtered[0];
  const study = caseStudies.find((s) => s.projectId === project?.id);
  useEffect(() => {
    const select = (event: Event) => {
      const id = (event as CustomEvent<{ projectId?: number }>).detail
        ?.projectId;
      if (projects.some((p) => p.id === id)) {
        setCategory("All projects");
        setQuery("");
        setSelectedId(id!);
        setView("Overview");
      }
    };
    window.addEventListener("explore-project", select);
    return () => window.removeEventListener("explore-project", select);
  }, []);
  return (
    <div className="developer-lab">
      <header className="lab-windowbar">
        <span className="lab-window-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span>
          THE WORK / <strong>project index</strong>
        </span>
        <span className="lab-window-status">
          <span /> PUBLIC WORK
        </span>
      </header>
      <div className="lab-workspace">
        <aside className="lab-sidebar" aria-label="Project collections">
          <div className="lab-sidebar-title">
            <Code2 size={18} />
            <strong>Browse the builds</strong>
          </div>
          <span className="lab-micro">COLLECTIONS</span>
          <div
            className="lab-categories"
            role="group"
            aria-label="Project categories"
          >
            {categories.map((label, i) => {
              const Icon = categoryIcons[i];
              return (
                <button
                  key={label}
                  aria-pressed={category === label}
                  onClick={() => {
                    setCategory(label);
                    setView("Overview");
                  }}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  <small>
                    {label === "Selected work"
                      ? caseStudies.length
                      : label === "All projects"
                        ? projects.length
                        : projects.filter((p) => projectGroup(p) === label)
                            .length}
                  </small>
                </button>
              );
            })}
          </div>
          <div className="lab-sidebar-note">
            <GitBranch size={22} />
            <strong>Start with a question.</strong>
            <p>What did I build? How does it work? What did I learn?</p>
            <a href="#all-projects">
              Full archive <ArrowUpRight size={14} />
            </a>
          </div>
        </aside>
        <div className="lab-main">
          <div className="lab-toolbar">
            <div>
              <span className="lab-micro">EXPLORE THE WORK</span>
              <h3>{category}</h3>
            </div>
            <label className="lab-search">
              <Search size={16} aria-hidden="true" />
              <span className="sr-only">Search engineering lab</span>
              <input
                type="search"
                placeholder="Find a project or technology…"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  if (event.target.value.trim() && category === "Selected work")
                    setCategory("All projects");
                }}
              />
            </label>
          </div>
          <p className="lab-result-count" role="status">
            {filtered.length} {filtered.length === 1 ? "project" : "projects"} ·
            select a project to inspect
          </p>
          <div
            className={`lab-project-list ${category === "Selected work" ? "is-curated" : ""}`}
            role="group"
            aria-label="Choose a project"
          >
            {filtered.map((p, i) => (
              <button
                key={p.id}
                aria-pressed={p.id === project?.id}
                onClick={() => {
                  setSelectedId(p.id);
                  setView("Overview");
                }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <span className="lab-project-label">
                  {caseStudies.find((s) => s.projectId === p.id)?.shortName ??
                    p.title}
                  <small>{p.category}</small>
                </span>
                {p.id === project?.id && <Check size={14} aria-hidden="true" />}
              </button>
            ))}
          </div>
          {project ? (
            <>
              <div className="lab-project-heading">
                <div>
                  <span className="lab-micro">{project.category}</span>
                  <h3>{study?.shortName ?? project.title}</h3>
                </div>
                <span className="lab-evidence-badge">
                  <GitBranch size={13} /> Source available
                </span>
              </div>
              <div
                className="lab-view-tabs"
                role="tablist"
                aria-label="Project detail views"
              >
                {views.map((item, i) => (
                  <button
                    key={item}
                    role="tab"
                    id={`lab-tab-${item}`}
                    aria-selected={view === item}
                    aria-controls="lab-detail-panel"
                    tabIndex={view === item ? 0 : -1}
                    onClick={() => setView(item)}
                    onKeyDown={(event) => {
                      const next =
                        event.key === "ArrowRight"
                          ? (i + 1) % views.length
                          : event.key === "ArrowLeft"
                            ? (i + views.length - 1) % views.length
                            : event.key === "Home"
                              ? 0
                              : event.key === "End"
                                ? views.length - 1
                                : -1;
                      if (next >= 0) {
                        event.preventDefault();
                        setView(views[next]);
                        document
                          .getElementById(`lab-tab-${views[next]}`)
                          ?.focus();
                      }
                    }}
                  >
                    {item === "Overview" ? (
                      <FileCode2 size={15} />
                    ) : item === "Architecture" ? (
                      <GitBranch size={15} />
                    ) : (
                      <Braces size={15} />
                    )}
                    {item}
                  </button>
                ))}
              </div>
              <div
                id="lab-detail-panel"
                role="tabpanel"
                aria-labelledby={`lab-tab-${view}`}
                tabIndex={0}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <m.div
                    key={`${project.id}-${view}`}
                    initial={motion ? { opacity: 0, y: 8 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: motion ? 0.16 : 0 }}
                  >
                    {view === "Overview" && (
                      <div className="lab-overview">
                        <div>
                          <span className="lab-micro">THE PRODUCT</span>
                          <h4>{study?.problem ?? project.category}</h4>
                          <p>{study?.summary ?? project.overview}</p>
                          <Tags items={project.technologies} />
                          <div className="lab-proof-links">
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Code2 size={16} /> Source code{" "}
                              <ArrowUpRight size={14} />
                            </a>
                            {project.demoUrl && (
                              <a
                                href={project.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Live demo <ArrowUpRight size={14} />
                              </a>
                            )}
                          </div>
                        </div>
                        <div className="lab-preview">
                          {study?.image ? (
                            <img
                              src={`/projects/${study.image}-640.webp`}
                              alt={study.imageAlt}
                              width={640}
                              height={360}
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className="lab-project-map"
                              role="group"
                              aria-label={
                                study?.diagram
                                  ? "Published implementation sequence"
                                  : "Published project technologies"
                              }
                            >
                              <span className="lab-micro">
                                {study?.diagram
                                  ? "FROM INPUT TO OUTPUT"
                                  : "BUILT WITH"}
                              </span>
                              <ol>
                                {(
                                  study?.diagram?.nodes ??
                                  project.technologies.slice(0, 5)
                                ).map((node, i) => (
                                  <li key={node}>
                                    <span>0{i + 1}</span>
                                    <strong>{node}</strong>
                                    {study?.diagram &&
                                      i < study.diagram.nodes.length - 1 && (
                                        <ArrowRight
                                          size={13}
                                          aria-hidden="true"
                                        />
                                      )}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          )}
                          <span>
                            {study?.image
                              ? "PROJECT CAPTURE"
                              : study?.diagram
                                ? "PROJECT IMPLEMENTATION NOTES"
                                : "PROJECT TECHNOLOGY STACK"}
                          </span>
                        </div>
                      </div>
                    )}
                    {view === "Architecture" && (
                      <ProjectArchitecture project={project} key={project.id} />
                    )}
                    {view === "Engineering" && (
                      <div className="lab-engineering">
                        <section>
                          <span className="lab-micro">01 / THE CHALLENGE</span>
                          <h4>The problem to solve</h4>
                          <p>{project.challenges}</p>
                        </section>
                        <section>
                          <span className="lab-micro">
                            02 / MY IMPLEMENTATION
                          </span>
                          <h4>How I approached it</h4>
                          <p>{project.role}</p>
                          <ul>
                            {project.features.map((feature) => (
                              <li key={feature}>{feature}</li>
                            ))}
                          </ul>
                        </section>
                        <section>
                          <span className="lab-micro">03 / THE OUTCOME</span>
                          <h4>What the work delivered</h4>
                          <p>{project.impact}</p>
                        </section>
                      </div>
                    )}
                  </m.div>
                </AnimatePresence>
              </div>
              <footer className="lab-project-footer">
                <button
                  onClick={() =>
                    openPortfolioAssistant(
                      `Explain Harsh's contribution and engineering challenges in ${project.title}. Use the published project notes and identify anything not documented.`,
                    )
                  }
                >
                  <Sparkles size={16} /> Ask AI about this project{" "}
                  <ArrowUpRight size={14} />
                </button>
                {study && (
                  <a href={`#project-${project.id}`}>
                    Full walkthrough <ArrowRight size={15} />
                  </a>
                )}
              </footer>
            </>
          ) : (
            <div className="lab-empty">
              <Search size={28} />
              <h3>No projects found</h3>
              <p>Try a technology such as React, Python, or Django.</p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("All projects");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
