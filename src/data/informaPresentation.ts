import type { CaseStudy, Project } from "./portfolio.ts";

export const informaProjectId = 17;
export const informaSlug = "news-automation";
export const informaCapture = {
  src: "/evidence/informa-ai-reading-room.jpg",
  alt: "Informa AI Reading Room with global tech stories, search filters, and priority headlines",
  width: 1521,
  height: 728,
  caption:
    "The live Reading Room, with searchable stories and a quick look at major developments.",
};

export const informaAiSummary =
  "AI pulls out the key points from stories on the topics you choose and puts them into a short brief with links to the original articles.";

const overview =
  "I built Informa AI so readers can keep up with global tech news without checking a dozen sites. You can browse reporting, research, and software releases in one place, or get a short brief in your inbox.";

export function displayProject(project: Project): Project {
  if (project.id !== informaProjectId) return project;
  return {
    ...project,
    title: "Informa AI",
    overview,
    features: [
      "Search and filter technology stories from around the world, then open the original article.",
      "Choose topics or pin stories, preview your brief, and send it to your verified email address.",
      "Ask the Research Desk a question and follow the source links in its answer.",
    ],
    role: "I built the site, the news collection and AI brief features, and the email delivery flow. I launched it at getinformdaily.com so anyone can try it.",
    challenges:
      "The same story often appears in several places. I grouped related coverage and kept the publisher and original link visible so readers can check what each source actually said.",
    impact:
      "Informa AI is live and free to use at getinformdaily.com. Readers can browse the news and send up to three briefs per day to a verified inbox.",
  };
}

export function displayStudy(study: CaseStudy): CaseStudy {
  if (study.projectId !== informaProjectId) return study;
  return {
    ...study,
    shortName: "Informa AI",
    summary: overview,
    problem:
      "Keeping up with technology means checking news sites, engineering blogs, and research feeds. I wanted one place to catch up and still be able to read the original reporting.",
    engineering: [
      informaAiSummary,
      "The Research Desk uses available source material to answer questions and link to the reporting behind its answers.",
      "When there isn’t enough source material, the brief labels what it could use, such as a headline or a publisher excerpt.",
    ],
    recovery:
      "When a publisher feed is unavailable, previously collected stories remain available. Readers can also copy or download a prepared brief.",
    diagram: {
      title: "From published story to inbox",
      nodes: [
        "Collect stories",
        "Organize coverage",
        "Choose topics",
        "Write the brief",
        "Preview or send",
      ],
      details: [
        "The site checks publisher feeds and public sources for new reporting, research, and releases.",
        "Stories are categorized and related reporting is grouped to make it easier to browse.",
        "Readers choose topics or pin specific stories they want included.",
        "AI summarizes selected source excerpts and keeps the original story links alongside the key points.",
        "Readers can review the brief, download it, or send it after verifying their email address.",
      ],
      contracts: [
        "Publisher stories enter the news collection.",
        "The Reading Room offers search, filters, and related stories.",
        "The brief uses the reader’s choices and selected stories.",
        "The preview shows key points and original sources.",
        "A verified inbox can receive the prepared brief.",
      ],
      caption:
        "How Informa AI turns published technology coverage into a brief readers can check and use.",
      chapterNodes: [[0, 1], [2, 3], [4]],
    },
  };
}
