import { ArrowUpRight } from "lucide-react";
import { xerjRecognition } from "../data/recognition";

export function ProjectRecognition({ slug }: { slug: string }) {
  if (slug !== xerjRecognition.projectSlug) return null;

  return (
    <aside className="project-recognition" aria-label="XERJ Corpus Hub selection">
      <div className="project-recognition-copy">
        <span className="eyebrow">Selected for XERJ Corpus Hub</span>
        <p>{xerjRecognition.summary}</p>
      </div>
      <div className="project-recognition-links">
        <a
          className="text-link"
          href={xerjRecognition.corpusHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          View the selection <ArrowUpRight size={16} aria-hidden="true" />
        </a>
        <a
          className="text-link"
          href={xerjRecognition.repositoryHref}
          target="_blank"
          rel="noopener noreferrer"
        >
          XERJ on GitHub <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      </div>
    </aside>
  );
}
