import assert from "node:assert/strict";
import { test, before, after } from "node:test";
import { readFile, readdir, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createServer } from "../server/app.mjs";
import { assertHomepage, siteOrigin } from "./prerender-checks.mjs";
import { projects, profile } from "../src/data/portfolio.ts";

let server;
let origin;
let html;
let canonical;
before(async () => {
  html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  canonical = html.match(/rel="canonical"\s+href="([^"]+)"/)?.[1];
  assert.ok(canonical, "Build the site first with npm run build");
  server = createServer({
    apiKey: "",
    model: "test-no-provider",
    allowedOrigins: [],
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
});
after(async () => {
  if (!server) return;
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
});

test("production HTML includes complete portfolio content before executing JavaScript", () => {
  assertHomepage(html, siteOrigin(canonical));
  assert.equal((html.match(/data-project-id=/g) || []).length, projects.length);
  assert.match(html, /Portfolio navigation without JavaScript/);
  assert.match(html, /data-render-year="\d{4}"/);
});

for (const userAgent of [
  "Googlebot",
  "LinkedInBot/1.0",
  "Portfolio-ATS-Reader/1.0",
]) {
  test(`${userAgent} receives the same complete HTML as a normal visitor`, async () => {
    const response = await fetch(origin, {
      headers: { "User-Agent": userAgent },
    });
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /text\/html/);
    assert.equal(response.headers.get("cache-control"), "no-cache");
    assert.equal(await response.text(), html);
  });
}

test("built assets, resume, and social preview resolve while source bundles stay private", async () => {
  const script = html.match(/<script[^>]+src="([^"]+)"/)?.[1];
  const css = html.match(/<link[^>]+href="([^"]+\.css)"/)?.[1];
  for (const path of [script, css, profile.resume, "/social-preview.png"])
    assert.equal((await fetch(origin + path)).status, 200, path);
  for (const path of [
    "/dist-ssr/entry-server.mjs",
    "/src/entry-server.tsx",
    "/.env",
  ])
    assert.equal((await fetch(origin + path)).status, 404, path);
  assert.ok(
    (await stat(new URL("../dist/index.html", import.meta.url))).size > 50000,
  );
});

test("every HTML image, responsive image candidate, stylesheet, script, and CSS font/image reference resolves", async () => {
  const resources = new Set();
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    if (
      /\.(?:js|css|woff2|png|jpe?g|webp|svg|pdf)(?:\?|$)/i.test(match[1]) &&
      match[1].startsWith("/")
    )
      resources.add(match[1]);
  }
  for (const match of html.matchAll(/\bsrc[Ss]et="([^"]+)"/g))
    for (const candidate of match[1].split(","))
      resources.add(candidate.trim().split(/\s+/)[0]);
  const stylesheets = [...resources].filter((resource) =>
    resource.endsWith(".css"),
  );
  for (const resource of stylesheets) {
    const css = await (await fetch(origin + resource)).text();
    // Quoted data SVGs can contain their own url(#filter) expressions; treat
    // the entire quoted value as one URL rather than a second asset request.
    for (const match of css.matchAll(
      /url\((?:(["'])([\s\S]*?)\1|([^)]*))\)/g,
    )) {
      const reference = (match[2] ?? match[3]).trim();
      if (reference.startsWith("data:") || reference.startsWith("#")) continue;
      const url = new URL(reference, origin + resource);
      assert.equal(
        url.origin,
        origin,
        "Expected self-hosted font/image assets",
      );
      resources.add(url.pathname);
    }
  }
  assert.ok(
    resources.has("/studio/signal-poster.png"),
    "Missing 3D fallback image reference",
  );
  for (const font of (
    await readdir(new URL("../dist/assets/", import.meta.url))
  ).filter((name) => name.endsWith(".woff2")))
    assert.ok(
      resources.has("/assets/" + font),
      `Missing stylesheet font reference: ${font}`,
    );
  for (const resource of resources) {
    const response = await fetch(origin + resource);
    assert.equal(response.status, 200, resource);
    assert.ok((await response.arrayBuffer()).byteLength > 0, resource);
    assert.ok(
      !response.headers.get("content-type")?.includes("text/html"),
      `Unexpected HTML fallback for ${resource}`,
    );
  }
});

test("all JavaScript chunks parse and are served as immutable JavaScript, including the lazy 3D renderer", async () => {
  const assets = new URL("../dist/assets/", import.meta.url);
  const scripts = (await readdir(assets)).filter((name) =>
    name.endsWith(".js"),
  );
  assert.ok(scripts.some((name) => name.startsWith("studioRenderer-")));
  for (const name of scripts) {
    execFileSync(
      process.execPath,
      ["--check", fileURLToPath(new URL(name, assets))],
      { stdio: "pipe" },
    );
    const response = await fetch(origin + "/assets/" + name);
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type"), /javascript/);
    assert.match(response.headers.get("cache-control"), /immutable/);
  }
});

test("every section and internal anchor is present and document IDs are unique", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const section of [
    "hero",
    "projects",
    "experience",
    "skills",
    "about",
    "all-projects",
    "workflow",
    "intelligence",
    "contact",
  ])
    assert.ok(ids.includes(section), section);
  for (const match of html.matchAll(/href="#([^"]+)"/g))
    assert.ok(ids.includes(match[1]), `Broken anchor: ${match[1]}`);
});

test("robots, sitemap, canonical, structured data, and social metadata agree on the production origin", async () => {
  const url = siteOrigin(canonical);
  for (const path of ["/robots.txt", "/sitemap.xml"])
    assert.ok((await (await fetch(origin + path)).text()).includes(url));
  const schema = JSON.parse(
    html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
  );
  assert.equal(schema.url, url + "/");
  for (const property of ["og:url", "og:image"])
    assert.ok(
      html
        .match(new RegExp(`property="${property}"\\s+content="([^"]+)"`))[1]
        .startsWith(url + "/"),
    );
});

test("unknown routes return a pre-rendered 404 with noindex; index.html redirects to the canonical home route", async () => {
  const response = await fetch(origin + "/not-a-portfolio-route");
  assert.equal(response.status, 404);
  const body = await response.text();
  assert.match(body, /data-prerendered="true"/);
  assert.match(body, /noindex, follow/);
  assert.match(body, /Back to the portfolio/);
  assert.ok(!body.includes('id="hero"'));
  const redirect = await fetch(origin + "/index.html?source=test", {
    redirect: "manual",
  });
  assert.equal(redirect.status, 308);
  assert.equal(redirect.headers.get("location"), "/?source=test");
  const head = await fetch(origin, { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), "");
});

test("pre-render validation rejects empty shells, incomplete catalogs, and malformed origins", () => {
  assert.throws(() => assertHomepage('<div id="root"></div>'));
  assert.throws(() =>
    assertHomepage(
      html.replace('data-project-id="27"', 'data-omitted="27"'),
      siteOrigin(canonical),
    ),
  );
  for (const url of [
    "http://example.com",
    "https://example.com/path",
    "https://user:password@example.com",
    "https://example.com/?key=value",
  ])
    assert.throws(() => siteOrigin(url));
  assert.equal(
    siteOrigin("https://portfolio.example.com/"),
    "https://portfolio.example.com",
  );
});
