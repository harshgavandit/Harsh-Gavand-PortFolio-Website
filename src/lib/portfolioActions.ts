import type { Project } from "../data/portfolio";

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
