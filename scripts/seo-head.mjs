import { pageSeo, structuredData } from "../src/lib/seo.ts";
import { notes } from "../src/data/notes.ts";
import { escapeHTML } from "./prerender-checks.mjs";

const START = /<!-- seo:start[^>]*-->/;
const END = "<!-- seo:end -->";

// JSON inside <script> must not be able to close the element.
export const safeJSON = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

/** Head tags for one route, generated from src/lib/seo.ts. */
export function seoHead(pathname, origin, { dateModified, preload = [] } = {}) {
  const seo = pageSeo(pathname);
  const url = seo.path ? origin + seo.path : null;
  const image = origin + seo.image.src;
  const tag = (attribute, key, value) =>
    `<meta ${attribute}="${key}" content="${escapeHTML(String(value))}" />`;
  return [
    `<title>${escapeHTML(seo.title)}</title>`,
    tag("name", "description", seo.description),
    tag("name", "robots", seo.robots),
    url ? `<link rel="canonical" href="${url}" />` : "",
    tag("property", "og:type", seo.ogType),
    url ? tag("property", "og:url", url) : "",
    tag("property", "og:title", seo.title),
    tag("property", "og:description", seo.description),
    tag("property", "og:image", image),
    tag("property", "og:image:width", seo.image.width),
    tag("property", "og:image:height", seo.image.height),
    tag("property", "og:image:alt", seo.image.alt),
    seo.ogType === "profile"
      ? tag("property", "profile:first_name", "Harsh")
      : "",
    seo.ogType === "profile"
      ? tag("property", "profile:last_name", "Gavand")
      : "",
    tag("name", "twitter:title", seo.title),
    tag("name", "twitter:description", seo.description),
    tag("name", "twitter:image", image),
    tag("name", "twitter:image:alt", seo.image.alt),
    notes.some((note) => !note.draft)
      ? `<link rel="alternate" type="application/rss+xml" title="Harsh Gavand — Engineering notes" href="${origin}/notes/feed.xml" />`
      : "",
    ...preload,
    seo.kind === "notFound"
      ? ""
      : `<script type="application/ld+json">${safeJSON(structuredData(pathname, origin, dateModified))}</script>`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

export function applySeo(html, pathname, origin, options) {
  const start = html.match(START);
  const end = html.indexOf(END);
  if (!start || end < start.index)
    throw new Error("index.html is missing the seo:start/seo:end block.");
  return (
    html.slice(0, start.index) +
    seoHead(pathname, origin, options) +
    html.slice(end + END.length)
  );
}
