import { projects } from "../data/portfolio";
import { displayProject } from "../data/informaPresentation";
import { captures } from "../data/projectCaptures";
import { AgriConnectGallery } from "./AgriConnectGallery";

export function ProductEvidence({ slug }: { slug: string }) {
  if (slug === "agri-connect") return <AgriConnectGallery />;
  const capture = captures[slug];
  const project = projects.find((item) => item.slug === slug);
  const projectTitle = project ? displayProject(project).title : slug;
  return capture ? (
    <figure className="capture-evidence">
      <a
        href={capture.src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Enlarge ${projectTitle} website screenshot`}
      >
        <img
          src={capture.src}
          width={capture.width ?? 1280}
          height={capture.height ?? 900}
          alt={capture.alt}
          loading="lazy"
        />
      </a>
      {capture.caption && <figcaption>{capture.caption}</figcaption>}
    </figure>
  ) : null;
}
