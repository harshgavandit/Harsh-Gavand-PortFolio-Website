import { projects } from "../data/portfolio.ts";
// Preserve existing shared links while exposing semantic URLs and DOM IDs.
export function semanticFragment(fragment: string) {
  const match = fragment.match(/^#(?:archive-)?project-(\d+)$/);
  if (!match) return fragment;
  const project = projects.find((item) => item.id === Number(match[1]));
  return project ? "#" + project.slug : fragment;
}
