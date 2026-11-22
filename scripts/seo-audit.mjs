// Static SEO validation of the pre-rendered build: run after `npm run build`.
// Checks every generated page for unique metadata, canonical/sitemap
// agreement, parseable structured data, heading/image basics, and internal
// links that resolve to built files.
import { readFile, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, relative } from "node:path";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const origin = (process.env.SITE_URL || "https://harshgavand.dev").replace(
  /\/$/,
  "",
);
const problems = [];
const fail = (page, message) => problems.push(`${page}: ${message}`);

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(path)));
    else if (entry.name.endsWith(".html")) out.push(path);
  }
  return out;
}
const attr = (html, pattern) => html.match(pattern)?.[1];
const decode = (value = "") =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

const pages = (await htmlFiles(dist)).filter(
  (file) =>
    !relative(dist, file).startsWith("verification") &&
    !relative(dist, file).startsWith("evidence"),
);
const titles = new Map();
const descriptions = new Map();
const indexable = new Set();
for (const file of pages) {
  const name = "/" + relative(dist, file).replace(/\\/g, "/");
  const html = await readFile(file, "utf8");
  const head = html.split("</head>")[0];
  const isNotFound = name === "/404.html";
  const titleCount = (head.match(/<title>/g) || []).length;
  if (titleCount !== 1) fail(name, `expected one <title>, found ${titleCount}`);
  const title = decode(attr(head, /<title>(.*?)<\/title>/s));
  const description = decode(
    attr(head, /name="description"\s+content="([^"]*)"/),
  );
  const robots = attr(head, /name="robots"\s+content="([^"]*)"/) || "";
  const canonical = attr(head, /rel="canonical"\s+href="([^"]*)"/);
  const h1 = (html.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) fail(name, `expected one <h1>, found ${h1}`);
  for (const img of html.match(/<img\b[^>]*>/g) || []) {
    if (!/\salt="/.test(img))
      fail(name, `image without alt: ${img.slice(0, 80)}`);
    if (!/\swidth="/.test(img) || !/\sheight="/.test(img))
      fail(name, `image without dimensions: ${img.slice(0, 80)}`);
  }
  if (isNotFound) {
    if (!robots.includes("noindex")) fail(name, "404 must be noindex");
    if (canonical) fail(name, "404 must not declare a canonical URL");
    continue;
  }
  if (!title || title.length < 20 || title.length > 75)
    fail(name, `title length ${title?.length}: ${title}`);
  if (!description || description.length < 70 || description.length > 165)
    fail(name, `description length ${description?.length}`);
  if (titles.has(title))
    fail(name, `duplicate title with ${titles.get(title)}`);
  if (descriptions.has(description))
    fail(name, `duplicate description with ${descriptions.get(description)}`);
  titles.set(title, name);
  descriptions.set(description, name);
  // Draft previews (NOTES_DRAFTS=1 builds) are noindex and stay out of the sitemap.
  if (/noindex/.test(robots)) continue;
  const expected =
    origin + name.replace(/index\.html$/, "").replace(/\.html$/, "/");
  if (canonical !== expected)
    fail(name, `canonical ${canonical} should be ${expected}`);
  indexable.add(expected);
  for (const property of ["og:url", "og:title", "og:description", "og:image"])
    if (!new RegExp(`property="${property}"`).test(head))
      fail(name, `missing ${property}`);
  if (attr(head, /property="og:url"\s+content="([^"]*)"/) !== canonical)
    fail(name, "og:url differs from canonical");
  const blocks = [
    ...head.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs),
  ];
  if (blocks.length !== 1)
    fail(name, `expected one JSON-LD block, found ${blocks.length}`);
  for (const [, json] of blocks) {
    let data;
    try {
      data = JSON.parse(json);
    } catch (error) {
      fail(name, "invalid JSON-LD: " + error.message);
      continue;
    }
    const types = (data["@graph"] || []).map((node) => node["@type"]);
    for (const type of ["Person", "WebSite"])
      if (!types.includes(type)) fail(name, `JSON-LD missing ${type}`);
    if (name.startsWith("/work/")) {
      if (!types.includes("BreadcrumbList"))
        fail(name, "missing BreadcrumbList");
      if (
        !types.some((type) =>
          ["SoftwareSourceCode", "CreativeWork"].includes(type),
        )
      )
        fail(name, "missing project entity");
    }
    if (name === "/index.html" && !types.includes("ProfilePage"))
      fail(name, "homepage missing ProfilePage");
  }
  // Internal links must resolve to built files and use canonical paths.
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
    if (
      !href.startsWith("/") ||
      href.startsWith("//") ||
      href.startsWith("/api/")
    )
      continue;
    const path = decode(href).split("#")[0].split("?")[0];
    if (!path || path === "/") continue;
    if (/^\/(archive|ai|work\/[^/]+)$/.test(path))
      fail(name, `non-canonical internal link ${href}`);
    const target = join(dist, path);
    if (!(await exists(target)) && !(await exists(join(target, "index.html"))))
      fail(name, `broken internal link ${href}`);
  }
}

const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
const listed = new Set(
  [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]),
);
for (const url of indexable)
  if (!listed.has(url)) fail("sitemap.xml", `missing ${url}`);
for (const url of listed)
  if (!indexable.has(url)) fail("sitemap.xml", `lists non-page ${url}`);
const robots = await readFile(join(dist, "robots.txt"), "utf8");
if (!robots.includes(`Sitemap: ${origin}/sitemap.xml`))
  fail("robots.txt", "missing sitemap reference");
if (/Disallow:\s*\/\s*$/m.test(robots))
  fail("robots.txt", "blocks the whole site");

if (problems.length) {
  console.error(problems.map((problem) => "✗ " + problem).join("\n"));
  process.exit(1);
}
console.log(
  `SEO audit passed: ${indexable.size} indexable pages, unique titles/descriptions, canonical = sitemap, valid JSON-LD, ${pages.length} HTML files checked.`,
);
