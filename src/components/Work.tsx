import { ArrowDown, ArrowRight, ArrowUpRight, LockKeyhole } from "lucide-react";
import { projects, type CaseStudy, type Project } from "../data/portfolio";
import { privateProjects, type PrivateProject } from "../data/privateProjects";
import { curatedArchive } from "../data/recruiter";
import { ActionLink, LeadStatement, Tags } from "./Primitives";
import { LazyScene } from "../three/LazyScene";
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
  informaCapture,
} from "../data/informaPresentation";

const loadDevice = () =>
  import("../three/DeviceShowcase").then((module) => module.DeviceShowcase);

// Spotlight for the flagship live product. The 3D laptop shows the same real
// capture as the card below; phones and reduced motion keep a CSS 3D frame.
function InformaSpotlight() {
  const project = displayProject(
    projects.find((item) => item.id === informaProjectId)!,
  );
  return (
    <aside className="spotlight" aria-labelledby="spotlight-title" data-reveal>
      <div className="spotlight-copy">
        <p className="eyebrow">Spotlight · Live product</p>
        <h3 id="spotlight-title">{project.title}</h3>
        <p className="spotlight-lede">{project.overview}</p>
        <ol className="spotlight-steps">
          <li>
            <strong>Collect</strong> live technology news from many sources
          </li>
          <li>
            <strong>Summarise</strong> the stories that match your topics
          </li>
          <li>
            <strong>Deliver</strong> a short, source-linked brief
          </li>
        </ol>
        <Tags items={project.technologies.slice(0, 6)} />
        <div className="actions">
          {project.demoUrl && (
            <ActionLink href={project.demoUrl} external primary>
              Try it at getinformdaily.com
            </ActionLink>
          )}
          <ActionLink href={`/work/${project.slug}/`}>Case study</ActionLink>
        </div>
      </div>
      <LazyScene
        className="spotlight-stage"
        load={loadDevice}
        fallback={
          <div className="spotlight-device">
            <img
              src={informaCapture.src}
              width={informaCapture.width}
              height={informaCapture.height}
              loading="lazy"
              alt={informaCapture.alt}
            />
          </div>
        }
      />
    </aside>
  );
}

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
const AI_SIGNALS =
  /OpenAI|LangChain|LangGraph|Google ADK|RAG|LLM|TensorFlow|LSTM|MCP/i;
function projectKind(project: Project) {
  const ai = project.technologies.some((item) => AI_SIGNALS.test(item));
  const web = project.technologies.some((item) =>
    /React|Next\.js|PostgreSQL|Express/.test(item),
  );
  if (ai && web) return "Full-stack · Applied AI";
  if (ai) return "Applied AI";
  return "Full-stack product";
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
      data-reveal
    >
      <header className="flagship-header">
        <div>
          <p className="project-kind">{projectKind(project)}</p>
          <h3 id={`${project.slug}-title`}>{study.shortName}</h3>
        </div>
        <a className="text-link" href={`/work/${project.slug}/`}>
          Explore case study <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </header>
      <p className="flagship-summary">{study.summary}</p>
      <ProjectRecognition slug={project.slug} />
      <div className="flagship-body">
        <div className="flagship-visual" data-tilt="4">
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
      <div className="section-intro section-intro-split" data-reveal>
        <div>
          <p className="eyebrow">Selected work</p>
          <h2 className="section-title">
            Products I designed, built &amp; shipped
          </h2>
          <p className="section-lede">
            Deployed full-stack products and AI systems. Each card shows the
            real application, what I built, the stack, and links to the live
            site, source code and a detailed case study.
          </p>
        </div>
        <nav className="project-index" aria-label="Jump to a project">
          <ul>
            {[
              ...mainStudies.map((study) => {
                const project = displayProject(
                  projects.find((item) => item.id === study.projectId)!,
                );
                return {
                  slug: project.slug,
                  name: displayStudy(study).shortName,
                };
              }),
              ...privateProjects.map((project) => ({
                slug: project.slug,
                name: project.title,
              })),
            ].map((item) => (
              <li key={item.slug}>
                <a href={`#${item.slug}`}>{item.name.split(" — ")[0]}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <InformaSpotlight />
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
      data-reveal
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
