import { ArrowDown, ArrowRight, ArrowUpRight, LockKeyhole } from "lucide-react";
import { projects, type CaseStudy, type Project } from "../data/portfolio";
import { privateProjects, type PrivateProject } from "../data/privateProjects";
import { curatedArchive } from "../data/recruiter";
import { ActionLink, LeadStatement, Tags } from "./Primitives";
import { ProductEvidence } from "./ProductEvidence";
import { featuredStudies } from "../data/workPresentation";
import { caseEvidence } from "../data/caseEvidence";
export function ProjectNotes({ project }: { project: Project }) {
  const evidence = caseEvidence[project.slug];
  return (
    <div className="project-notes">
      <div>
        <h4>My contribution</h4>
        <p>{project.role}</p>
      </div>
      <div>
        <h4>Features implemented</h4>
        <ul>
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
      <div>
        <h4>Engineering challenge</h4>
        <p>{project.challenges}</p>
      </div>
      <div>
        <h4>Outcome</h4>
        <p>{project.impact}</p>
        {evidence && (
          <>
            <a className="text-link" href={`/work/${project.slug}/`}>
              Project details ↗
            </a>
          </>
        )}
      </div>
      <div className="project-complete-stack">
        <h4>Complete tech stack</h4>
        <Tags items={project.technologies} />
      </div>
    </div>
  );
}
function CaseStudyCard({ study }: { study: CaseStudy }) {
  const project = projects.find((item) => item.id === study.projectId)!;
  return (
    <article
      className={`flagship-card flagship-${project.slug}`}
      id={project.slug}
      tabIndex={-1}
      aria-labelledby={`${project.slug}-title`}
    >
      <header className="flagship-header">
        <div>
          <h3 id={`${project.slug}-title`}>{study.shortName}</h3>
        </div>
        <a className="text-link" href={`/work/${project.slug}/`}>
          Explore case study <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </header>
      <p className="flagship-summary">{study.summary}</p>
      <div className="flagship-body">
        <div className="flagship-visual">
          <ProductEvidence slug={project.slug} />
        </div>
        <div className="engineering-breakdown">
          <div className="project-focus">
            <h4>Engineering focus</h4>
            <ul className="engineering-bullets">
              {study.engineering.slice(0, 1).map((point) => (
                <li key={point}>
                  <LeadStatement text={point} />
                </li>
              ))}
            </ul>
          </div>
          <div className="project-stack">
            <h4>Tech stack</h4>
            <Tags items={project.technologies.slice(0, 5)} />
          </div>
          <div className="actions project-actions">
            {project.demoUrl && (
              <ActionLink href={project.demoUrl} external primary>
                Visit live website
              </ActionLink>
            )}
            <ActionLink href={project.githubUrl} external>
              GitHub source
            </ActionLink>
          </div>
        </div>
      </div>
      <details className="flagship-notes">
        <summary>Features, my contribution &amp; outcome</summary>
        <ProjectNotes project={project} />
      </details>
    </article>
  );
}
export function FeaturedWork() {
  return (
    <section
      id="projects"
      data-chapter="projects"
      className="section section-container"
      tabIndex={-1}
      aria-label="Selected work"
    >
      <div className="flagship-list">
        {privateProjects.map((project) => (
          <PrivateProjectCard key={project.id} project={project} />
        ))}
        {featuredStudies.map((study) => (
          <CaseStudyCard key={study.projectId} study={study} />
        ))}
      </div>
      <MoreWork />
    </section>
  );
}

function PrivateProjectCard({ project }: { project: PrivateProject }) {
  return (
    <article
      className="private-project-card"
      id={project.slug}
      tabIndex={-1}
      aria-labelledby={`${project.slug}-title`}
    >
      <header className="flagship-header">
        <div>
          <div className="flagship-kicker">
            <span className="private-project-badge">
              <LockKeyhole size={13} aria-hidden="true" />
              Private internal project
            </span>
          </div>
          <h3 id={`${project.slug}-title`}>{project.title}</h3>
        </div>
      </header>
      <p className="flagship-summary">{project.overview}</p>
      <div className={project.preview ? "private-project-body" : undefined}>
        {project.preview && (
          <figure className="private-project-preview">
            <a
              href={project.preview.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View full-size Globetrek quotation workspace screenshot"
            >
              <img
                src={project.preview.src}
                alt={project.preview.alt}
                width={project.preview.width}
                height={project.preview.height}
                loading="lazy"
              />
            </a>
            <figcaption>
              {project.preview.caption}
              <span>Click image to enlarge ↗</span>
            </figcaption>
          </figure>
        )}
        <div className="private-project-details">
          <div>
            <h4>Features</h4>
            <ul className="engineering-bullets">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>My contribution</h4>
            <p>{project.role}</p>
            <h4>Business impact</h4>
            <p>{project.impact}</p>
          </div>
        </div>
        <div className="private-project-stack">
          <h4>Tech stack</h4>
          <Tags items={project.technologies} />
          <h4>Keywords</h4>
          <ul className="tags" aria-label="Project keywords">
            {project.keywords.map((keyword) => (
              <li key={keyword}>{keyword}</li>
            ))}
          </ul>
          <p className="project-boundary">
            Private internal project · Source code and application access are
            not public.
          </p>
        </div>
      </div>
    </article>
  );
}

export function MoreWork() {
  const additional = curatedArchive.filter(
    (entry) =>
      !featuredStudies.some((study) => study.projectId === entry.projectId),
  );
  if (additional.length === 0) return null;
  return (
    <details id="all-projects" className="curated-archive">
      <summary>
        <span>
          <span className="eyebrow">Curated archive</span>
          <strong>{additional.length} more engineering projects.</strong>
        </span>
        <span>
          Browse repositories <ArrowDown size={17} aria-hidden="true" />
        </span>
      </summary>
      <div
        className="archive-table-scroll"
        tabIndex={0}
        role="region"
        aria-label="Curated engineering repositories"
      >
        <table>
          <caption>
            Selected AI, API, retrieval, and workflow repositories
          </caption>
          <thead>
            <tr>
              {[
                "Year",
                "Project",
                "Built with",
                "Key engineering feature",
                "Links",
              ].map((label) => (
                <th scope="col" key={label}>
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {additional.map((entry) => {
              const project = projects.find((p) => p.id === entry.projectId)!;
              return (
                <tr key={project.id}>
                  <td>{entry.year}</td>
                  <th scope="row">
                    <a href={`/archive#${project.slug}`}>{project.title}</a>
                  </th>
                  <td>{project.technologies.slice(0, 3).join(" · ")}</td>
                  <td>{entry.feature}</td>
                  <td>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub source for ${project.title}`}
                    >
                      GitHub <ArrowUpRight size={13} aria-hidden="true" />
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Live <ArrowUpRight size={13} aria-hidden="true" />
                      </a>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <a className="archive-complete-link" href="/archive">
        Browse the complete project catalog{" "}
        <ArrowRight size={16} aria-hidden="true" />
      </a>
    </details>
  );
}
