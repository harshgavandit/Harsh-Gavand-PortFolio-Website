import { build } from "vite";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { assertHomepage, siteOrigin } from "./prerender-checks.mjs";
import { profile, projects } from "../src/data/portfolio.ts";

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
const origin = siteOrigin(
  process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL || profile.site,
);
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
await writeFile(
  new URL("../dist/robots.txt", import.meta.url),
  `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`,
);
await writeFile(
  new URL("../dist/sitemap.xml", import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`,
);
console.log(
  `Pre-rendered homepage and 404 page; all ${projects.length} projects included. Canonical origin: ${origin}`,
);
