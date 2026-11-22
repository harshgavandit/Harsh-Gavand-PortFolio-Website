import {
  aboutProfile,
  archiveProjects,
  experience,
  profile,
  skills,
} from "../data/portfolio.ts";
import { workPage, workPath } from "./projectNavigation.ts";
import { projectImage } from "../data/projectCaptures.ts";
import { noteBySlug, noteModified, notes } from "../data/notes.ts";

// One source of truth for titles, descriptions, canonical URLs, social images,
// and Schema.org data. The pre-renderer writes it into static HTML and the
// client keeps it in sync after navigation.

export const SITE_NAME = "Harsh Gavand";
export const JOB_TITLE = "Full-Stack & AI Engineer";
export const DEFAULT_IMAGE = {
  src: "/social-preview.png",
  width: 1200,
  height: 630,
  alt: "Harsh Gavand — Full-Stack and AI Engineer. Built with purpose. Engineered to work.",
};
export const PORTRAIT = "/portrait/harsh-studio.jpg";
export const ROBOTS_INDEX =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

const HOME_TITLE =
  "Harsh Gavand | Full-Stack Developer & Generative AI Engineer";
const HOME_DESCRIPTION =
  "Harsh Gavand is a Full-Stack Developer and AI Engineer in Mumbai building React, Node.js and Python (FastAPI, Django) applications, RAG assistants and LLM agents.";
const ARCHIVE_TITLE =
  "Projects: Full-Stack, Python & AI Repositories | Harsh Gavand";
const ARCHIVE_DESCRIPTION = `Searchable catalog of ${archiveProjects.length} projects by Harsh Gavand: MERN and Next.js web apps, Django and FastAPI services, RAG assistants, AI agents and ML models.`;
const AI_TITLE = "AI Workspace: Code-Grounded Guide & AI Tools | Harsh Gavand";
const AI_DESCRIPTION =
  "Ask a source-grounded technical guide about Harsh Gavand’s code, compare a role description against his published work, and try live AI support-ticket triage.";

const NOTES_TITLE = "Engineering Notes: Full-Stack & AI Systems | Harsh Gavand";
const NOTES_DESCRIPTION =
  "Technical write-ups by Harsh Gavand on the design decisions, failure handling and trade-offs behind shipped full-stack and AI code.";

export type PageSeo = {
  kind: "home" | "archive" | "ai" | "work" | "notes" | "note" | "notFound";
  title: string;
  description: string;
  path: string | null;
  ogType: "profile" | "website" | "article";
  image: { src: string; width: number; height: number; alt: string };
  robots: string;
  slug?: string;
};

/** Shorten copy for search snippets at a sentence, then a word, boundary. */
export function snippet(text: string, max = 158) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+(\s|$)/g) || [];
  let result = "";
  for (const sentence of sentences) {
    if ((result + sentence).trim().length > max) break;
    result += sentence;
  }
  if (result.trim().length >= 60) return result.trim();
  const cut = clean.slice(0, max - 1);
  // End on a complete list item rather than mid-phrase when possible.
  const clause = cut.lastIndexOf(",");
  if (clause >= 70) return cut.slice(0, clause) + ".";
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]+$/, "") + "…";
}

export function pageSeo(pathname: string): PageSeo {
  const path = pathname.replace(/\/+$/, "") || "/";
  if (path === "/")
    return {
      kind: "home",
      title: HOME_TITLE,
      description: HOME_DESCRIPTION,
      path: "/",
      ogType: "profile",
      image: DEFAULT_IMAGE,
      robots: ROBOTS_INDEX,
    };
  if (path === "/archive")
    return {
      kind: "archive",
      title: ARCHIVE_TITLE,
      description: ARCHIVE_DESCRIPTION,
      path: "/archive/",
      ogType: "website",
      image: DEFAULT_IMAGE,
      robots: ROBOTS_INDEX,
    };
  if (path === "/ai")
    return {
      kind: "ai",
      title: AI_TITLE,
      description: AI_DESCRIPTION,
      path: "/ai/",
      ogType: "website",
      image: DEFAULT_IMAGE,
      robots: ROBOTS_INDEX,
    };
  if (path === "/notes" && notes.length)
    return {
      kind: "notes",
      title: NOTES_TITLE,
      description: NOTES_DESCRIPTION,
      path: "/notes/",
      ogType: "website",
      image: DEFAULT_IMAGE,
      robots: notes.some((note) => !note.draft)
        ? ROBOTS_INDEX
        : "noindex, follow",
    };
  const note = noteBySlug(path.match(/^\/notes\/([^/]+)$/)?.[1]);
  if (note) {
    const titled = `${note.title} | Harsh Gavand`;
    return {
      kind: "note",
      title: titled.length <= 70 ? titled : note.title,
      description: snippet(note.description, 160),
      path: `/notes/${note.slug}/`,
      ogType: "article",
      image:
        (note.projectSlug && projectImage(note.projectSlug)) || DEFAULT_IMAGE,
      robots: note.draft ? "noindex, follow" : ROBOTS_INDEX,
      slug: note.slug,
    };
  }
  const slug = path.match(/^\/work\/([^/]+)$/)?.[1];
  const page = workPage(slug);
  if (page) {
    const capture = projectImage(page.project.slug);
    return {
      kind: "work",
      title: `${page.study.shortName} | Harsh Gavand`,
      description: `${snippet(page.study.summary, 132)} Case study by Harsh Gavand.`,
      path: workPath(page.project.slug),
      ogType: "article",
      image: capture || DEFAULT_IMAGE,
      robots: ROBOTS_INDEX,
      slug: page.project.slug,
    };
  }
  return {
    kind: "notFound",
    title: "Page not found | Harsh Gavand",
    description: HOME_DESCRIPTION,
    path: null,
    ogType: "website",
    image: DEFAULT_IMAGE,
    robots: "noindex, follow",
  };
}

const unique = (items: string[]) => [...new Set(items)];

/** Schema.org graph for a route; `origin` has no trailing slash. */
export function structuredData(
  pathname: string,
  origin: string,
  dateModified?: string,
) {
  const seo = pageSeo(pathname);
  const person = {
    "@type": "Person",
    "@id": `${origin}/#person`,
    name: profile.name,
    url: `${origin}/`,
    image: `${origin}${PORTRAIT}`,
    jobTitle: JOB_TITLE,
    description: aboutProfile.summary,
    email: `mailto:${profile.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Mumbai",
      addressRegion: "Maharashtra",
      addressCountry: "IN",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Pillai University",
      address: { "@type": "PostalAddress", addressLocality: "Mumbai" },
    },
    knowsAbout: unique([
      "Full-Stack Development",
      "Generative AI",
      ...skills.flatMap((group) => group.items),
      ...experience.flatMap((role) => role.tech),
    ]).slice(0, 60),
    award: aboutProfile.recognition,
    sameAs: [profile.github, profile.linkedin],
  };
  const website = {
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    url: `${origin}/`,
    name: SITE_NAME,
    alternateName: "Harsh Gavand Portfolio",
    description: HOME_DESCRIPTION,
    inLanguage: "en",
    publisher: { "@id": `${origin}/#person` },
  };
  const url = seo.path ? origin + seo.path : `${origin}/`;
  const breadcrumb = (items: [string, string][]) => ({
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: items.map(([name, item], index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: origin + item,
    })),
  });
  const pageBase = {
    "@id": `${url}#webpage`,
    url,
    name: seo.title,
    description: seo.description,
    inLanguage: "en",
    isPartOf: { "@id": `${origin}/#website` },
    ...(dateModified ? { dateModified } : {}),
  };
  const graph: object[] = [person, website];
  if (seo.kind === "home")
    graph.push({
      "@type": "ProfilePage",
      ...pageBase,
      mainEntity: { "@id": `${origin}/#person` },
      about: { "@id": `${origin}/#person` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${origin}${PORTRAIT}`,
      },
    });
  if (seo.kind === "archive") {
    graph.push(
      {
        "@type": "CollectionPage",
        ...pageBase,
        about: { "@id": `${origin}/#person` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: archiveProjects.length,
          itemListElement: archiveProjects.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: project.title,
            url:
              origin + (workPath(project.slug) || `/archive/#${project.slug}`),
          })),
        },
      },
      breadcrumb([
        ["Home", "/"],
        ["Projects", "/archive/"],
      ]),
    );
  }
  if (seo.kind === "ai")
    graph.push(
      {
        "@type": "WebPage",
        ...pageBase,
        about: { "@id": `${origin}/#person` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
      breadcrumb([
        ["Home", "/"],
        ["AI Workspace", "/ai/"],
      ]),
    );
  if (seo.kind === "work" && seo.slug) {
    const { project, study } = workPage(seo.slug)!;
    const work = {
      "@type": project.githubUrl ? "SoftwareSourceCode" : "CreativeWork",
      "@id": `${url}#project`,
      name: study.shortName,
      description: study.summary,
      url: project.demoUrl || url,
      ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
      ...(project.category ? { genre: project.category } : {}),
      keywords: project.technologies.join(", "),
      image: `${origin}${seo.image.src}`,
      author: { "@id": `${origin}/#person` },
      creator: { "@id": `${origin}/#person` },
    };
    graph.push(
      {
        "@type": "WebPage",
        ...pageBase,
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#project` },
        author: { "@id": `${origin}/#person` },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${origin}${seo.image.src}`,
          width: seo.image.width,
          height: seo.image.height,
        },
      },
      work,
      breadcrumb([
        ["Home", "/"],
        ["Projects", "/archive/"],
        [study.shortName, seo.path!],
      ]),
    );
  }
  const posting = (note: (typeof notes)[number]) => ({
    "@type": "BlogPosting",
    "@id": `${origin}/notes/${note.slug}/#article`,
    headline: note.title,
    description: note.description,
    url: `${origin}/notes/${note.slug}/`,
    datePublished: note.published,
    dateModified: noteModified(note),
    inLanguage: "en",
    keywords: note.tags.join(", "),
    author: { "@id": `${origin}/#person` },
    publisher: { "@id": `${origin}/#person` },
    isPartOf: { "@id": `${origin}/notes/#blog` },
  });
  if (seo.kind === "notes")
    graph.push(
      {
        "@type": "Blog",
        ...pageBase,
        "@id": `${origin}/notes/#blog`,
        author: { "@id": `${origin}/#person` },
        breadcrumb: { "@id": `${url}#breadcrumb` },
        blogPost: notes.map(posting),
      },
      breadcrumb([
        ["Home", "/"],
        ["Engineering notes", "/notes/"],
      ]),
    );
  if (seo.kind === "note" && seo.slug) {
    const note = noteBySlug(seo.slug)!;
    graph.push(
      {
        "@type": "WebPage",
        ...pageBase,
        dateModified: noteModified(note),
        breadcrumb: { "@id": `${url}#breadcrumb` },
        mainEntity: { "@id": `${url}#article` },
      },
      {
        ...posting(note),
        mainEntityOfPage: { "@id": `${url}#webpage` },
        image: `${origin}${seo.image.src}`,
      },
      breadcrumb([
        ["Home", "/"],
        ["Engineering notes", "/notes/"],
        [note.title, seo.path!],
      ]),
    );
  }
  return { "@context": "https://schema.org", "@graph": graph };
}
