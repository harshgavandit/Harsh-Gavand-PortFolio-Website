import { ArrowRight } from "lucide-react";
import { archiveProjects, type Project } from "../data/portfolio";
import { privateProjects } from "../data/privateProjects";
import { Tags } from "./Primitives";
import { ProjectReel } from "./ProjectReel";
import {
  primaryFeaturedStudies,
  secondaryFeaturedStudies,
} from "../data/workPresentation";
import { caseEvidence } from "../data/caseEvidence";
import { informaProjectId } from "../data/informaPresentation";

const informaStudy = secondaryFeaturedStudies.find(
  (study) => study.projectId === informaProjectId,
)!;
// Reel order: flagship public work first, then the remaining deployments.
const reelStudies = [
  primaryFeaturedStudies[0],
  informaStudy,
  ...primaryFeaturedStudies.slice(1),
  ...secondaryFeaturedStudies.filter(
    (study) => study.projectId !== informaProjectId,
  ),
];

// Used by the project catalog (/archive) for each repository's notes.
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
export function FeaturedWork() {
  return (
    <section
      id="projects"
      data-chapter="projects"
      className="section section-container"
      tabIndex={-1}
      aria-label="Selected work"
    >
      <div className="section-intro" data-reveal>
        <p className="eyebrow">Selected work</p>
        <h2 className="section-title">
          Products I designed, built &amp; shipped
        </h2>
        <p className="section-lede">
          Deployed full-stack products, AI systems and engineering repositories.
          Each card shows the real application or stack, with links to the live
          site, source code and a detailed case study.
        </p>
      </div>
      <ProjectReel studies={reelStudies} privateWork={privateProjects} />
      <a className="reel-catalog-link" href="/archive/">
        Browse the complete catalog of {archiveProjects.length} repositories{" "}
        <ArrowRight size={16} aria-hidden="true" />
      </a>
    </section>
  );
}
