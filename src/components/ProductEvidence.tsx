import { deploymentShowcase } from "../data/deploymentShowcase";
import { projects } from "../data/portfolio";
import { AgriConnectGallery } from "./AgriConnectGallery";

const captures: Record<
  string,
  {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }
> = {
  ...Object.fromEntries(
    deploymentShowcase.map((item) => [
      projects.find((project) => project.id === item.projectId)!.slug,
      {
        src: `/evidence/${item.capture}`,
        alt: item.alt,
        width: item.captureWidth ?? 1265,
        height: item.captureHeight ?? 712,
      },
    ]),
  ),
  "agri-samaj-community-platform": {
    src: "/evidence/agri-samaj-workspace.png",
    alt: "Agri Samaj live Marathi homepage with community business search, entrepreneur registration, directory, and publications",
  },
  "ugc-platform": {
    src: "/evidence/ugc-workspace.png",
    alt: "UGC Content Studio generation workspace showing reference inputs, saved output, and generation status",
  },
  "banking-saas": {
    src: "/evidence/lendflow-workspace.png",
    alt: "LendFlow lending workspace showing borrower records and loan review",
  },
  "github-replica": {
    src: "/evidence/devgraph-workspace.png",
    alt: "DevGraph repository explorer showing repository discovery and issue records",
  },
};

export function ProductEvidence({ slug }: { slug: string }) {
  if (slug === "agri-connect") return <AgriConnectGallery />;
  const capture = captures[slug];
  return capture ? (
    <figure className="capture-evidence">
      <a
        href={capture.src}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Enlarge ${slug} website screenshot`}
      >
        <img
          src={capture.src}
          width={capture.width ?? 1280}
          height={capture.height ?? 900}
          alt={capture.alt}
          loading="lazy"
        />
      </a>
    </figure>
  ) : null;
}
