import { ArrowDown, ArrowRight, ArrowUpRight, LockKeyhole } from "lucide-react";
import { projects, type CaseStudy, type Project } from "../data/portfolio";
import { privateProjects, type PrivateProject } from "../data/privateProjects";
import { curatedArchive } from "../data/recruiter";
import { ActionLink, LeadStatement, Tags } from "./Primitives";
import { ProductEvidence } from "./ProductEvidence";
import { ProjectRecognition } from "./ProjectRecognition";
import {
  featuredStudies,
  primaryFeaturedStudies,
  secondaryFeaturedStudies,
} from "../data/workPresentation";
import { caseEvidence } from "../data/caseEvidence";
import {
  displayProject,
  displayStudy,
  informaAiSummary,
  informaProjectId,
} from "../data/informaPresentation";

const informaStudy = secondaryFeaturedStudies.find(
  (study) => study.projectId === informaProjectId,
)!;
const mainStudies = [
  primaryFeaturedStudies[0],
  informaStudy,
  ...primaryFeaturedStudies.slice(1),
];
const moreStudies = secondaryFeaturedStudies.filter(
  (study) => study.projectId !== informaProjectId,
);

export function ProjectNotes({ project }: { project: Project }) {
  const evidence = caseEvidence[project.slug];
  return (
    <div className="project-notes">
      <div>
        <strong className="card-label">My contribution</strong>
        <p>{project.role}</p>
      </div>
      <div>
        <strong className="card-label">Features implemented</strong>
        <ul>
          {project.features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </div>
      <div>
        <strong className="card-label">Engineering challenge</strong>
        <p>{project.challenges}</p>
      </div>
      <div>
        <strong className="card-label">Outcome</strong>
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
        <strong className="card-label">Complete tech stack</strong>
        <Tags items={project.technologies} />
      </div>
    </div>
  );
}
function CaseStudyCard({ study: record }: { study: CaseStudy }) {
  const study = displayStudy(record);
  const project = displayProject(
    projects.find((item) => item.id === study.projectId)!,
  );
  const isInforma = project.id === informaProjectId;
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
      <ProjectRecognition slug={project.slug} />
      <div className="flagship-body">
        <div className="flagship-visual">
          <ProductEvidence slug={project.slug} />
        </div>
        <div className="engineering-breakdown">
          <div className="project-focus">
            <strong className="card-label">
              {isInforma ? "How AI helps" : "Engineering focus"}
            </strong>
            {isInforma ? (
              <p>{informaAiSummary}</p>
            ) : (
              <ul className="engineering-bullets">
                {study.engineering.slice(0, 1).map((point) => (
                  <li key={point}>
                    <LeadStatement text={point} />
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="project-stack">
            <strong className="card-label">Tech stack</strong>
            <Tags items={project.technologies.slice(0, 5)} />
          </div>
          <div className="actions project-actions">
            {project.demoUrl && (
              <ActionLink href={project.demoUrl} external primary>
                {isInforma
                  ? "Try it at getinformdaily.com"
                  : "Visit live website"}
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
        {mainStudies.map((study) => (
          <CaseStudyCard key={study.projectId} study={study} />
        ))}
        {privateProjects.map((project) => (
          <PrivateProjectCard key={project.id} project={project} />
        ))}
      </div>
      <details id="more-deployed-work" className="secondary-work">
        <summary>
          More deployed applications{" "}
          <span>
            {moreStudies.length} AI, retrieval &amp; workflow projects
          </span>
        </summary>
        <div className="flagship-list">
          {moreStudies.map((study) => (
            <CaseStudyCard key={study.projectId} study={study} />
          ))}
        </div>
      </details>
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
            <strong className="card-label">Features</strong>
            <ul className="engineering-bullets">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div>
            <strong className="card-label">My contribution</strong>
            <p>{project.role}</p>
            <strong className="card-label">Business impact</strong>
            <p>{project.impact}</p>
          </div>
        </div>
        <div className="private-project-stack">
          <strong className="card-label">Tech stack</strong>
          <Tags items={project.technologies} />
          <strong className="card-label">Keywords</strong>
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
                    <a href={`/archive/#${project.slug}`}>{project.title}</a>
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
      <a className="archive-complete-link" href="/archive/">
        Browse the complete project catalog{" "}
        <ArrowRight size={16} aria-hidden="true" />
      </a>
    </details>
  );
}
