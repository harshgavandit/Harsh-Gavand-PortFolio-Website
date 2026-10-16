import { useParams } from "react-router-dom";
import { workPage } from "../lib/projectNavigation";
import { caseEvidence } from "../data/caseEvidence";
import { sampleWorkspaceURLs } from "../data/workPresentation";
import { ActionLink, Tags } from "./Primitives";
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
  return (
    <main id="main" className="work-page section-container" tabIndex={-1}>
      <a className="text-link" href={`/#${project.slug}`}>
        ← Selected work
      </a>
      <header className="work-intro">
        <span className="eyebrow">Case study / {project.category}</span>
        <h1>{study.shortName}</h1>
        <p>{study.summary}</p>
        <div className="actions">
          {community && project.demoUrl && (
            <ActionLink href={project.demoUrl} external primary>
              Visit live website
            </ActionLink>
          )}
          <ActionLink href="#walkthrough" primary={!community}>
            Explore the workflow
          </ActionLink>
          <ActionLink href={project.githubUrl} external>
            GitHub source
          </ActionLink>
        </div>
      </header>
      <div className="work-context">
        <div>
          <h2>Problem &amp; context</h2>
          <p>{evidence.context}</p>
        </div>
        <div>
          <h2>My contribution</h2>
          <p>{evidence.ownership}</p>
        </div>
      </div>
      <section
        id="walkthrough"
        aria-labelledby="walkthrough-title"
        className="work-demo"
      >
        <ProductEvidence slug={project.slug} />
        <div className="work-demo-copy">
          <span className="eyebrow">Product walkthrough</span>
          <h2 id="walkthrough-title">Explore the workflow.</h2>
          <p>
            {sampleURL
              ? "Try the sample workspace without creating an account. Explore the interface with built-in sample data."
              : study.previewNote}
          </p>
          {sampleURL && (
            <>
              <ActionLink href={sampleURL} external primary>
                Open sample workspace
              </ActionLink>
              <p className="evidence-caption">
                Read-only demo · sample data · no sign-in
              </p>
            </>
          )}
          <p>
            <strong>Failure path:</strong> {evidence.failure.trigger}
          </p>
          <p>{evidence.failure.handling}</p>
          {project.demoUrl && !community && (
            <a
              className="text-link"
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Authenticated app ↗
            </a>
          )}
        </div>
      </section>
      <section className="work-section" aria-labelledby="decision-title">
        <h2 id="decision-title">An engineering decision.</h2>
        <p>{evidence.decision.reason}</p>
        <div className="work-decision">
          <div>
            <h3>Implemented approach</h3>
            <p>{evidence.decision.choice}</p>
          </div>
          <div>
            <h3>Alternative &amp; tradeoff</h3>
            <p>{evidence.decision.alternative}</p>
          </div>
        </div>
      </section>
      <section className="work-section" aria-labelledby="architecture-title">
        <h2 id="architecture-title">Follow the system.</h2>
        <Tabs
          id={`work-${project.slug}`}
          label={`${study.shortName} engineering details`}
          items={[
            {
              label: "System Architecture",
              content: <SystemFlow study={study} slug={project.slug} />,
            },
            {
              label: "Implementation Stack",
              content: <Tags items={project.technologies} />,
            },
          ]}
        />
      </section>
      <section className="work-section" aria-labelledby="verification-title">
        <h2 id="verification-title">Implementation details.</h2>
        <div className="work-verification">
          <div>
            <h3>How it works</h3>
            <ul>
              {evidence.verifiedBehavior.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Constraints &amp; next steps</h3>
            <ul>
              {evidence.limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="source-list" aria-label="Code and examples">
          {evidence.verification.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target={item.href.startsWith("https:") ? "_blank" : undefined}
              rel="noopener noreferrer"
            >
              {item.label} ↗
            </a>
          ))}
        </div>
      </section>
      <section className="work-section" aria-labelledby="sources-title">
        <h2 id="sources-title">Source code.</h2>
        <p>
          Explore the controllers, schemas, and services behind this project.
        </p>
        <div className="source-list">
          {evidence.sources.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label} ↗
            </a>
          ))}
        </div>
      </section>
      <div className="work-section actions">
        <ActionLink href="/#projects">More selected work</ActionLink>
        <ActionLink href="/#contact" primary>
          Discuss an opportunity
        </ActionLink>
      </div>
    </main>
  );
}
