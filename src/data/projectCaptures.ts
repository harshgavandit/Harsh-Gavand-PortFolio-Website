import { deploymentShowcase } from "./deploymentShowcase.ts";
import { projects } from "./portfolio.ts";
import { informaCapture, informaSlug } from "./informaPresentation.ts";
import { agriConnectGallery } from "./agriConnectGallery.ts";

export type ProjectCapture = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
};

// Real application captures shared by project cards, case studies, and
// per-page social/structured-data images.
export const captures: Record<string, ProjectCapture> = {
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
  [informaSlug]: informaCapture,
  "agri-samaj-community-platform": {
    src: "/evidence/agri-samaj-homepage-2026-10-22.png",
    alt: "Agri Samaj English homepage showing business search, community resources, and the Add your business registration link",
    width: 1917,
    height: 1102,
    caption:
      "Community homepage with business discovery, resources, and entrepreneur registration.",
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

export function projectImage(slug: string) {
  const capture =
    slug === "agri-connect" ? agriConnectGallery[0] : captures[slug];
  return capture
    ? {
        src: capture.src,
        alt: capture.alt,
        width: capture.width ?? 1280,
        height: capture.height ?? 900,
      }
    : null;
}
