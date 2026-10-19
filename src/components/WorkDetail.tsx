import { useParams } from "react-router-dom";
import { workPage } from "../lib/projectNavigation";
import { caseEvidence } from "../data/caseEvidence";
import { sampleWorkspaceURLs } from "../data/workPresentation";
import { ActionLink, LeadStatement, Tags } from "./Primitives";
import { ProductEvidence } from "./ProductEvidence";
import { SystemFlow } from "./SystemFlow";
import { Tabs } from "./Tabs";
import { communityProjects } from "../data/portfolio";

export function WorkDetail() {
  const { slug } = useParams();
  const page = workPage(slug);
  if (!page)
    return (
      <main id="main" className="not-found section-container" tabIndex={-1}>
        <span className="eyebrow">404 / Case study not found</span>
        <h1>This project isn’t in the selected work.</h1>
        <a className="button button-primary" href="/#projects">
          Explore selected work ↗
        </a>
      </main>
    );
  const { project, study } = page;
  const evidence = caseEvidence[project.slug];
  const sampleURL = sampleWorkspaceURLs[project.slug];
  const community = communityProjects.some((item) => item.id === project.id);
  const publicWebsite = community || study.publicPreview === true;
  return (
    <main id="main" className="work-page section-container" tabIndex={-1}>
      <a className="text-link" href={`/#${project.slug}`}>
        ← Selected work
      </a>
      <header className="work-intro">
        <h1>{study.shortName}</h1>
        <p>{study.summary}</p>
        <div className="actions">
          {project.demoUrl && (
            <ActionLink href={project.demoUrl} external primary>
              Visit live website
            </ActionLink>
          )}
          <ActionLink href="#walkthrough" primary={!project.demoUrl}>
            Explore the project
          </ActionLink>
          <ActionLink href={project.githubUrl} external>
            GitHub
          </ActionLink>
        </div>
      </header>
      <div className="work-context">
        <div>
          <h2>The problem</h2>
          <p>{evidence.context}</p>
        </div>
        <div>
          <h2>My contribution</h2>
          <p>{project.role}</p>
        </div>
      </div>
      <section
        id="walkthrough"
        aria-labelledby="walkthrough-title"
        className="work-demo"
      >
        <ProductEvidence slug={project.slug} />
        <div className="work-demo-copy">
          <h2 id="walkthrough-title">Product features</h2>
          <ul className="engineering-bullets">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
          {sampleURL && !publicWebsite && (
            <ActionLink href={sampleURL} external>
              Open demo
            </ActionLink>
          )}
        </div>
      </section>
      <section className="work-section" aria-labelledby="engineering-title">
        <h2 id="engineering-title">Engineering work</h2>
        <ul className="engineering-bullets">
          {study.engineering.map((point) => (
            <li key={point}>
              <LeadStatement text={point} />
            </li>
          ))}
        </ul>
      </section>
      <section className="work-section" aria-labelledby="architecture-title">
        <h2 id="architecture-title">Architecture &amp; tech stack</h2>
        <Tabs
          id={`work-${project.slug}`}
          label={`${study.shortName} engineering details`}
          items={[
            {
              label: "Architecture",
              content: <SystemFlow study={study} slug={project.slug} />,
            },
            {
              label: "Tech stack",
              content: <Tags items={project.technologies} />,
            },
          ]}
        />
      </section>
      <div className="work-section actions">
        <ActionLink href="/#projects">More selected work</ActionLink>
        <ActionLink href="/#contact" primary>
          Get in touch
        </ActionLink>
      </div>
    </main>
  );
}
