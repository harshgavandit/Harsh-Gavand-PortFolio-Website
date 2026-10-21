import { engineeringSprints } from "./portfolio";

// Combine the established achievement figures with each project's architecture.
export const recognitionItems = [
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
