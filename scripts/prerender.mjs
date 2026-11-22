import { build } from "vite";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  assertHomepage,
  assertArchive,
  siteOrigin,
} from "./prerender-checks.mjs";
import { workStudies } from "../src/data/workPresentation.ts";
import { workPage } from "../src/lib/projectNavigation.ts";
import { profile, projects, archiveProjects } from "../src/data/portfolio.ts";
import { applySeo } from "./seo-head.mjs";
import { notes, noteModified } from "../src/data/notes.ts";
import { escapeHTML } from "./prerender-checks.mjs";

// Generate HTML from the same components and data as the client, without a
// browser download, network requests, API credentials, or a running dev server.
process.env.NODE_ENV = "production";
const root = fileURLToPath(new URL("../", import.meta.url));
await build({
  root,
  logLevel: "warn",
  build: {
    ssr: "src/entry-server.tsx",
    outDir: "dist-ssr",
    emptyOutDir: true,
    copyPublicDir: false,
    rollupOptions: { output: { entryFileNames: "entry-server.mjs" } },
  },
});
const { render } = await import("../dist-ssr/entry-server.mjs");
const origin = siteOrigin(process.env.SITE_URL || profile.site);
const template = (
  await readFile(new URL("../dist/index.html", import.meta.url), "utf8")
).replaceAll(profile.site, origin);
const outlet = '<div id="root"></div>';
if (!template.includes(outlet))
  throw new Error(
    "Expected an empty Vite root before pre-rendering. Run npm run build again.",
  );
const year = new Date().getFullYear();
// Last content change for dateModified/lastmod: the commit date when git
// history is available, otherwise the build time.
let lastModified;
try {
  lastModified = execFileSync("git", ["log", "-1", "--format=%cI"], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
} catch {
  /* Shallow or missing history. */
}
lastModified = new Date(lastModified || Date.now()).toISOString();
// Preload the display font used by the hero heading (largest text paint).
const assets = await readdir(new URL("../dist/assets/", import.meta.url));
const preload = assets
  .filter((file) => /^space-grotesk-latin-wght-normal-.*\.woff2$/.test(file))
  .map(
    (file) =>
      `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`,
  );
const documentFor = (location) =>
  applySeo(template, location, origin, {
    dateModified: lastModified,
    preload,
  }).replace(
    outlet,
    () =>
      `<div id="root" data-prerendered="true" data-render-year="${year}">${render(location, year)}</div>`,
  );
const homepage = documentFor("/");
assertHomepage(homepage, origin);
const archive = documentFor("/archive");
assertArchive(archive, origin);
const notFound = documentFor("/404");
await writeFile(new URL("../dist/index.html", import.meta.url), homepage);
await writeFile(new URL("../dist/404.html", import.meta.url), notFound);
const ai = documentFor("/ai");
await mkdir(new URL("../dist/ai/", import.meta.url), { recursive: true });
await writeFile(new URL("../dist/ai/index.html", import.meta.url), ai);
await mkdir(new URL("../dist/archive/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../dist/archive/index.html", import.meta.url),
  archive,
);
const workLocations = [];
for (const record of workStudies) {
  const slug = projects.find((item) => item.id === record.projectId).slug;
  const { project } = workPage(slug);
  const location = `/work/${project.slug}/`;
  const content = documentFor(location);
  if (!content.includes('id="engineering-title"'))
    throw new Error("Missing project engineering content: " + location);
  await mkdir(new URL(`../dist${location}`, import.meta.url), {
    recursive: true,
  });
  await writeFile(
    new URL(`../dist${location}index.html`, import.meta.url),
    content,
  );
  workLocations.push(location);
}
// Engineering notes are published only when at least one note is not a draft.
const noteLocations = [];
if (notes.length) {
  const indexHtml = documentFor("/notes/");
  if (!indexHtml.includes('class="notes-list"'))
    throw new Error("Missing engineering notes index content.");
  await mkdir(new URL("../dist/notes/", import.meta.url), { recursive: true });
  await writeFile(
    new URL("../dist/notes/index.html", import.meta.url),
    indexHtml,
  );
  for (const note of notes) {
    const location = `/notes/${note.slug}/`;
    const content = documentFor(location);
    if (!content.includes('class="note-article"'))
      throw new Error("Missing note content: " + location);
    await mkdir(new URL(`../dist${location}`, import.meta.url), {
      recursive: true,
    });
    await writeFile(
      new URL(`../dist${location}index.html`, import.meta.url),
      content,
    );
    if (!note.draft) noteLocations.push([location, noteModified(note)]);
  }
  const published = notes.filter((note) => !note.draft);
  if (published.length)
    await writeFile(
      new URL("../dist/notes/feed.xml", import.meta.url),
      `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Harsh Gavand — Engineering notes</title><link>${origin}/notes/</link><atom:link href="${origin}/notes/feed.xml" rel="self" type="application/rss+xml"/><description>Technical write-ups on full-stack and AI systems by Harsh Gavand.</description><language>en</language>${published
        .map(
          (note) =>
            `<item><title>${escapeHTML(note.title)}</title><link>${origin}/notes/${note.slug}/</link><guid>${origin}/notes/${note.slug}/</guid><pubDate>${new Date(note.published + "T00:00:00Z").toUTCString()}</pubDate><description>${escapeHTML(note.description)}</description></item>`,
        )
        .join("")}</channel></rss>\n`,
    );
}
await writeFile(
  new URL("../dist/robots.txt", import.meta.url),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`,
);
const lastmod = lastModified.slice(0, 10);
const sitemapEntry = (location, priority) =>
  `  <url><loc>${origin}${location}</loc><lastmod>${lastmod}</lastmod><priority>${priority}</priority></url>`;
await writeFile(
  new URL("../dist/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[
    sitemapEntry("/", "1.0"),
    ...workLocations.map((location) => sitemapEntry(location, "0.8")),
    ...(noteLocations.length
      ? [
          sitemapEntry("/notes/", "0.7"),
          ...noteLocations.map(
            ([location, modified]) =>
              `  <url><loc>${origin}${location}</loc><lastmod>${modified}</lastmod><priority>0.7</priority></url>`,
          ),
        ]
      : []),
    sitemapEntry("/archive/", "0.7"),
    sitemapEntry("/ai/", "0.6"),
  ].join("\n")}\n</urlset>\n`,
);
console.log(
  `Pre-rendered home, archive (${archiveProjects.length} projects), ${workLocations.length} case studies, ${notes.length} engineering notes (${noteLocations.length} published), and 404. Canonical origin: ${origin}`,
);
