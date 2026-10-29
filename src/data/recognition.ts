import { engineeringSprints } from "./portfolio";

interface RecognitionItem {
  title: string;
  badge: string;
  context: string;
  summary: string;
  href: string | null;
  linkLabel?: string;
  repositoryHref?: string;
}

export const xerjRecognition = {
  projectSlug: "agri-samaj-community-platform",
  title: "XERJ Corpus Hub — Agri Samaj",
  badge: "Selected",
  context: "Open-source reference · 23 October 2026",
  summary:
    "The bilingual AI chat and voice implementation was selected as a searchable reference for AI coding agents, with repository, commit and file-line attribution.",
  href: "https://hub.xerj.org/contributors/harshgavandit",
  corpusHref:
    "https://hub.xerj.org/corpus/harshgavandit--agri-samaj-community-platform",
  linkLabel: "View XERJ selection",
  repositoryHref: "https://github.com/xerj-org/xerj",
};

export const recognitionItems: RecognitionItem[] = [
  xerjRecognition,
  {
    title: "Supervity Autopilot Hackathon",
    badge: "Top 5",
    context: "500+ participants · 24-hour build",
    summary: engineeringSprints[0].summary,
    href: engineeringSprints[0].href,
  },
  {
    title: "OpenAI Builders Hackathon — Memory Graph AI",
    badge: "Top 10",
    context: "500+ builders",
    summary:
      "Connected memory processing, retrieval, and relationship graphs to source-linked archive answers.",
    href: "https://github.com/harshgavandit/OpenAI_Project-",
  },
  {
    title: "Smart India Hackathon 2025",
    badge: "Top 100",
    context: "National level · 500+ teams",
    summary: "",
    href: null,
  },
  {
    title: engineeringSprints[1].title,
    badge: "Engineering sprint",
    context: "AI engineering · Competitive build",
    summary: engineeringSprints[1].summary,
    href: engineeringSprints[1].href,
  },
];
