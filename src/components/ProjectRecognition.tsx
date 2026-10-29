import { ArrowUpRight } from "lucide-react";
import { xerjRecognition } from "../data/recognition";

export function ProjectRecognition({ slug }: { slug: string }) {
  if (slug !== xerjRecognition.projectSlug) return null;

  return (
    <aside className="project-recognition" aria-label="XERJ Corpus Hub selection">
      <div>
        <span className="eyebrow">Selected for XERJ Corpus Hub</span>
        <p>{xerjRecognition.summary}</p>
      </div>
      <a
        className="text-link"
        href={xerjRecognition.corpusHref}
        target="_blank"
        rel="noopener noreferrer"
      >
        View the selection <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </aside>
  );
}
