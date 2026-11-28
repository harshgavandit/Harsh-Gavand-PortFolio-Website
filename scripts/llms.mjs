import { writeFile } from "node:fs/promises";
import {
  aboutProfile,
  experience,
  profile,
  projectSlug,
  skills,
} from "../src/data/portfolio.ts";
import { workStudies } from "../src/data/workPresentation.ts";
import { workPage, workPath } from "../src/lib/projectNavigation.ts";
import { snippet } from "../src/lib/seo.ts";

const singleLine = (value) => value.replace(/\s+/g, " ").trim();
// One sentence per case study: the summary's opening sentence, shortened at a
// clause boundary when long (same rules as the page's meta description).
const shortSummary = (study) => snippet(study.summary, 150);
const bullets = (items) => items.map((value) => "- " + singleLine(value));

export async function writeLlmProfiles(directory, origin) {
  const intro = [
    `# ${profile.name}`,
    "",
    `> ${profile.availability}. ${aboutProfile.summary}`,
    "",
    "## Profile",
    "",
    `- [Homepage](${origin}/)`,
    `- [Résumé](${origin}${profile.resume})`,
    `- [GitHub](${profile.github})`,
    `- [LinkedIn](${profile.linkedin})`,
    `- [Email](mailto:${profile.email})`,
  ];
  const more = [
    "",
    "## More",
    "",
    `- [Project archive](${origin}/archive/)`,
    `- [AI workspace](${origin}/ai/)`,
  ];
  const studies = workStudies.map(({ projectId }) => {
    const slug = projectSlug(projectId);
    return { ...workPage(slug), href: origin + workPath(slug) };
  });
  const short = [
    ...intro,
    "",
    "## Case studies",
    "",
    ...studies.map(
      ({ study, href }) =>
        `- [${study.shortName.split(" — ")[0]}](${href}): ${shortSummary(study)}`,
    ),
    ...more,
  ].join("\n");
  const full = [
    ...intro,
    "",
    "## Experience",
    "",
    aboutProfile.experience,
    ...experience.flatMap(
      ({ company, role, period, context, shipment, points }) => [
        "",
        `### ${role} · ${company}`,
        "",
        `${period} · ${context}`,
        "",
        shipment,
        "",
        ...bullets(points),
      ],
    ),
    "",
    "## Skills",
    ...skills.flatMap(({ title, description, patterns, items }) => [
      "",
      `### ${title}`,
      "",
      description,
      patterns,
      "",
      ...bullets(items),
    ]),
    "",
    "## Education",
    "",
    aboutProfile.education.degree,
    aboutProfile.education.details,
    "",
    "## Recognition",
    "",
    ...bullets(aboutProfile.recognition),
    "",
    "## Case studies",
    ...studies.flatMap(({ study, project, href }) => [
      "",
      `### ${study.shortName}`,
      "",
      singleLine(study.summary),
      "",
      `- [Case study](${href})`,
      ...(project.demoUrl ? [`- [Live website](${project.demoUrl})`] : []),
      `- [GitHub](${project.githubUrl})`,
      `- Role: ${project.role}`,
      `- Challenges: ${project.challenges}`,
      `- Outcome: ${project.impact}`,
      `- Technology: ${project.technologies.join(", ")}`,
      "",
      "Features:",
      "",
      ...bullets(project.features),
      "",
      "Contributions:",
      "",
      ...bullets(
        study.contributions.map(
          ({ label, description }) => `${label}: ${description}`,
        ),
      ),
    ]),
    ...more,
  ].join("\n");
  await Promise.all([
    writeFile(new URL("llms.txt", directory), short + "\n"),
    writeFile(new URL("llms-full.txt", directory), full + "\n"),
  ]);
}
