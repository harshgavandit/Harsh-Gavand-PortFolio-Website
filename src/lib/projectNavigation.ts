import { projects } from "../data/portfolio.ts";
import { workStudies } from "../data/workPresentation.ts";
// Preserve existing shared links while exposing semantic URLs and DOM IDs.
export function semanticFragment(fragment: string) {
  const match = fragment.match(/^#(?:archive-)?project-(\d+)$/);
  if (!match) return fragment;
  const project = projects.find((item) => item.id === Number(match[1]));
  return project ? "#" + project.slug : fragment;
}

export function workPage(slug: string | undefined) {
  const canonical = slug === "lendflow" ? "banking-saas" : slug;
  const project = projects.find((item) => item.slug === canonical);
  const study = workStudies.find((item) => item.projectId === project?.id);
  return project && study ? { project, study } : null;
}

export function workPath(slug: string) {
  const page = workPage(slug);
  return page ? `/work/${page.project.slug}/` : null;
}
