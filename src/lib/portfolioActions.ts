import { isLatestAIProject, type Project } from "../data/portfolio.ts";

export function matchesProjectCollection(project: Project, collection: string) {
  return (
    collection === "All" ||
    collection === "All projects" ||
    (collection === "Latest AI"
      ? isLatestAIProject(project.id)
      : projectGroup(project) === collection)
  );
}

export function projectGroup(project: Project) {
  if (/AI|Learning|Prediction|GPT/.test(project.title + project.category))
    return "AI & ML";
  if (
    /API|Automation|Authentication|Django|Employee/.test(
      project.title + project.category,
    )
  )
    return "APIs & Tools";
  return "Web & SaaS";
}

export function openPortfolioAssistant(prompt = "") {
  window.dispatchEvent(
    new CustomEvent("open-portfolio-assistant", { detail: { prompt } }),
  );
}
