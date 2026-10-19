import { build } from "vite";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  assertHomepage,
  assertArchive,
  siteOrigin,
  escapeHTML,
} from "./prerender-checks.mjs";
import { workStudies } from "../src/data/workPresentation.ts";
import { workPage } from "../src/lib/projectNavigation.ts";
import { profile, projects, archiveProjects } from "../src/data/portfolio.ts";

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
const documentFor = (location) =>
  template.replace(
    outlet,
    () =>
      `<div id="root" data-prerendered="true" data-render-year="${year}">${render(location, year)}</div>`,
  );
const homepage = documentFor("/");
assertHomepage(homepage, origin);
const archive = documentFor("/archive")
  .replace(
    /<title>.*?<\/title>/s,
    "<title>Project Archive | Harsh Gavand — Full-Stack & AI Engineer</title>",
  )
  .replace(/(rel="canonical"\s+href=")[^"]+"/, `$1${origin}/archive/"`)
  .replace(/(property="og:url"\s+content=")[^"]+"/, `$1${origin}/archive/"`)
  .replace(
    /(property="og:title"\s+content=")[^"]+"/,
    '$1Project Archive | Harsh Gavand"',
  );
assertArchive(archive, origin);
const notFound = documentFor("/404")
  .replace(
    /<title>.*?<\/title>/s,
    "<title>Page not found | Harsh Gavand</title>",
  )
  .replace(
    "</head>",
    '<meta name="robots" content="noindex, follow" /></head>',
  );
await writeFile(new URL("../dist/index.html", import.meta.url), homepage);
await writeFile(new URL("../dist/404.html", import.meta.url), notFound);
const ai = documentFor("/ai")
  .replace(/<title>.*?<\/title>/s, "<title>AI Workspace | Harsh Gavand</title>")
  .replace(/(rel="canonical"\s+href=")[^"]+"/, `$1${origin}/ai/"`)
  .replace(/(property="og:url"\s+content=")[^"]+"/, `$1${origin}/ai/"`)
  .replace(
    /(property="og:title"\s+content=")[^"]+"/,
    '$1AI Workspace | Harsh Gavand"',
  )
  .replace(
    /(name="twitter:title"\s+content=")[^"]+"/,
    '$1AI Workspace | Harsh Gavand"',
  )
  .replace(
    /((?:name="description"|property="og:description"|name="twitter:description")\s+content=")[^"]+"/g,
    '$1Explore a source-grounded technical guide, evidence-based role comparison, and live AI support-ticket triage by Harsh Gavand."',
  );
await mkdir(new URL("../dist/ai/", import.meta.url), { recursive: true });
await writeFile(new URL("../dist/ai/index.html", import.meta.url), ai);
await mkdir(new URL("../dist/archive/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../dist/archive/index.html", import.meta.url),
  archive,
);
const workLocations = [];
for (const study of workStudies) {
  const project = projects.find((item) => item.id === study.projectId);
  const location = `/work/${project.slug}/`;
  const title = escapeHTML(`${study.shortName} | Harsh Gavand`);
  const content = documentFor(location)
    .replace(/<title>.*?<\/title>/s, `<title>${title}</title>`)
    .replace(/(rel="canonical"\s+href=")[^"]+"/, `$1${origin}${location}"`)
    .replace(/(property="og:url"\s+content=")[^"]+"/, `$1${origin}${location}"`)
    .replace(/(property="og:title"\s+content=")[^"]+"/, `$1${title}"`)
    .replace(
      /(name="description"\s+content=")[^"]+"/,
      `$1${escapeHTML(study.summary)}"`,
    )
    .replace(/(name="twitter:title"\s+content=")[^"]+"/, `$1${title}"`)
    .replace(
      /(name="twitter:description"\s+content=")[^"]+"/,
      `$1${escapeHTML(study.summary)}"`,
    )
    .replace(
      /(property="og:description"\s+content=")[^"]+"/,
      `$1${escapeHTML(study.summary)}"`,
    );
  if (!workPage(project.slug) || !content.includes('id="engineering-title"'))
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
await writeFile(
  new URL("../dist/robots.txt", import.meta.url),
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
await writeFile(
  new URL("../dist/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url><url><loc>${origin}/archive/</loc></url><url><loc>${origin}/ai/</loc></url>${workLocations.map((location) => `<url><loc>${origin}${location}</loc></url>`).join("")}</urlset>\n`,
);
console.log(
  `Pre-rendered home, archive (${archiveProjects.length} projects), ${workLocations.length} case studies, and 404. Canonical origin: ${origin}`,
);
