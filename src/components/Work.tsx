import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import {
  caseStudies,
  projects,
  type CaseStudy,
  type Project,
} from "../data/portfolio";
import { curatedArchive } from "../data/recruiter";
import { ActionLink, ChapterHeading, Tags } from "./Primitives";
import { Tabs } from "./Tabs";
export function ProjectNotes({ project }: { project: Project }) {
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
        <h4>Engineering outcome</h4>
        <p>{project.impact}</p>
      </div>
    </div>
  );
}
function ProductPreview({
  study,
  project,
}: {
  study: CaseStudy;
  project: Project;
}) {
  return (
    <div className="product-preview">
      <div className="browser-frame">
        <div className="browser-toolbar">
          <span>
            <i />
            <i />
            <i />
          </span>
          <span>
            {project.demoUrl
              ? new URL(project.demoUrl).hostname
              : "digest / email output"}
          </span>
          <ExternalLink size={12} aria-hidden="true" />
        </div>
        {study.image ? (
          <img
            src={`/projects/${study.image}-1280.webp`}
            srcSet={`/projects/${study.image}-640.webp 640w, /projects/${study.image}-1280.webp 1280w`}
            sizes="(min-width: 1000px) 42vw, 100vw"
            width={1280}
            height={722}
            loading="lazy"
            alt={study.imageAlt}
          />
        ) : project.id === 14 ? (
          <div className="generation-preview">
            <img
              src="/projects/ugc-gallery-640.webp"
              srcSet="/projects/ugc-gallery-320.webp 320w, /projects/ugc-gallery-640.webp 640w"
              sizes="(min-width:1000px) 220px, 45vw"
              width={640}
              height={1147}
              loading="lazy"
              alt="UGC project gallery image of a model with a suitcase"
            />
            <div>
              <span className="eyebrow">Project gallery</span>
              <h4>From assets to marketing content.</h4>
              <p>
                Image example from the UGC application’s gallery. Upload product
                and model references to create a generation.
              </p>
              <span className="gallery-format">
                Image generation → video generation
              </span>
            </div>
          </div>
        ) : (
          <div className="email-preview">
            <span className="eyebrow">Email delivery format</span>
            <h4>One digest. Two formats.</h4>
            <div>
              <strong>Plain text</strong>
              <p>
                A readable summary with links back to the collected articles and
                transcripts.
              </p>
            </div>
            <div>
              <strong>HTML email</strong>
              <p>
                A greeting, introduction, article headings, formatted summaries,
                and source links.
              </p>
            </div>
            <p>text/plain + text/html · SMTP delivery</p>
          </div>
        )}
      </div>
      <p className="preview-note">
        {study.previewNote}
        {study.hostingNote && (
          <span className="hosting-note">{study.hostingNote}</span>
        )}
      </p>
      {project.demoUrl ? (
        <a
          className="text-link"
          href={project.demoUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open the product <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      ) : (
        <a
          className="text-link"
          href={project.githubUrl + "/blob/main/app/services/email.py"}
          target="_blank"
          rel="noopener noreferrer"
        >
          Inspect the email formatter{" "}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}
function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const project = projects.find((item) => item.id === study.projectId)!;
  return (
    <article
      className="flagship-card"
      id={project.slug}
      tabIndex={-1}
      aria-labelledby={`${project.slug}-title`}
    >
      <header className="flagship-header">
        <div>
          <div className="flagship-kicker">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span className="category-badge">{project.category}</span>
          </div>
          <h3 id={`${project.slug}-title`}>{study.shortName}</h3>
        </div>
        <div className="actions demo-actions">
          {project.demoUrl && (
            <ActionLink href={project.demoUrl} primary external>
              Live demo
            </ActionLink>
          )}
          {project.demoUrl && (
            <span className="demo-access" title={study.previewNote}>
              {study.accessMode}
            </span>
          )}
          <ActionLink
            href={project.githubUrl}
            primary={!project.demoUrl}
            external
          >
            GitHub source
          </ActionLink>
        </div>
      </header>
      <div className="flagship-body">
        <div className="engineering-breakdown">
          <p className="eyebrow">The problem & product</p>
          <p className="product-summary">{study.summary}</p>
          <h4>Architecture & engineering decisions</h4>
          <ul className="engineering-bullets">
            {study.engineering.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <Tags items={project.technologies} />
          <div className="engineering-impact">
            <span className="eyebrow">Engineering outcome</span>
            <p>{project.impact}</p>
          </div>
        </div>
        <div className="flagship-visual">
          <Tabs
            id={`case-${project.slug}`}
            label={`${study.shortName} technical preview`}
            items={[
              {
                label: "Product Preview",
                content: <ProductPreview study={study} project={project} />,
              },
              {
                label: "System Architecture",
                content: (
                  <figure className="case-flow">
                    <ol>
                      {study.diagram!.nodes.map((node, i) => (
                        <li key={node}>
                          <span>{String(i + 1).padStart(2, "0")}</span>
                          <strong>{node}</strong>
                          {i < study.diagram!.nodes.length - 1 && (
                            <ArrowDown size={15} aria-hidden="true" />
                          )}
                        </li>
                      ))}
                    </ol>
                    <figcaption>{study.diagram!.caption}</figcaption>
                    <p className="flow-recovery">
                      <span>Recovery / state</span>
                      {study.recovery}
                    </p>
                  </figure>
                ),
              },
            ]}
          />
        </div>
      </div>
      <footer className="flagship-footer">
        <span>{study.takeaway}</span>
        <a href={`/archive#${project.slug}`}>
          Full project notes <ArrowRight size={14} aria-hidden="true" />
        </a>
      </footer>
    </article>
  );
}
export function FeaturedWork() {
  return (
    <section
      id="projects"
      className="section section-container"
      tabIndex={-1}
      aria-labelledby="projects-title"
    >
      <ChapterHeading
        id="projects"
        title="Four systems. The engineering behind them."
        description="AI media generation, lending workflows, repository discovery, and automated news delivery."
      />
      <div className="flagship-list">
        {caseStudies.map((study, index) => (
          <CaseStudyCard key={study.projectId} study={study} index={index} />
        ))}
      </div>
      <MoreWork />
    </section>
  );
}
export function MoreWork() {
  return (
    <details id="all-projects" className="curated-archive">
      <summary>
        <span>
          <span className="eyebrow">Curated archive</span>
          <strong>Eight more engineering problems.</strong>
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
            {curatedArchive.map((entry) => {
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
