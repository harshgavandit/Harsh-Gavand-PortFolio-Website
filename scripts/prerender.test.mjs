import assert from "node:assert/strict";
import { test, before, after } from "node:test";
import { readFile, readdir, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createServer } from "../server/app.mjs";
import {
  assertHomepage,
  assertArchive,
  siteOrigin,
  escapeHTML,
} from "./prerender-checks.mjs";
import {
  projects,
  communityProjects,
  archiveProjects,
} from "../src/data/portfolio.ts";
import { featuredStudies } from "../src/data/workPresentation.ts";
import {
  chapters,
  productionCode,
  pythonQuotaCode,
} from "../src/data/recruiter.ts";
import { nextTabIndex, isAssistantShortcut } from "../src/lib/interaction.ts";

import { semanticFragment } from "../src/lib/projectNavigation.ts";
import { traceStage } from "../src/lib/requestTrace.ts";
import { resumeStackGroups, resumeStackCount } from "../src/data/heroStack.ts";

let server;
let origin;
let html;
let archive;
let canonical;
before(async () => {
  html = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
  archive = await readFile(
    new URL("../dist/archive/index.html", import.meta.url),
    "utf8",
  );
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

test("home has five chapters with unnumbered navigation and a hidden mobile menu", () => {
  const expected = chapters.map((chapter) => chapter.id);
  const main = html.split('<main id="main"')[1].split("</main>")[0];
  assert.deepEqual(
    [...main.matchAll(/<section id="([^"]+)"/g)].map((match) => match[1]),
    expected,
  );
  assert.ok(!html.includes('aria-label="Page chapters"'));
  assert.match(html, /id="mobile-navigation"[^>]*hidden=""/);
  for (const label of ["Main navigation", "Mobile navigation"]) {
    const nav = html.match(
      new RegExp(
        '<nav[^>]+aria-label="' + label + '"[^>]*>([\\s\\S]*?)<\\/nav>',
      ),
    )[1];
    assert.deepEqual(
      [...nav.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]),
      expected,
    );
    assert.deepEqual(
      [...nav.matchAll(/<span>(\d+)<\/span>/g)].map((match) => match[1]),
      [],
    );
  }
});

test("voice entry controls are prerendered without autoplay and the static welcome serves as audio", async () => {
  assert.match(html, /Text chat/);
  assert.match(html, /Voice guide/);
  assert.match(html, /Listen to welcome/);
  assert.match(html, /Welcome transcript/);
  assert.match(html, /AI-generated voice/);
  assert.doesNotMatch(html, /<audio[^>]+autoplay/i);
  const response = await fetch(origin + "/voice/welcome.mp3");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "audio/mpeg");
  assert.ok((await response.arrayBuffer()).byteLength > 1000);
});

test("AI workspace directly loads as complete HTML with accessible tools, correct SEO, and no backend corpus exposure", async () => {
  for (const path of ["/ai", "/ai/"]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    const page = await response.text();
    assert.match(page, /<title>AI Workspace \| Harsh Gavand<\/title>/);
    assert.match(page, /rel="canonical"[^>]+\/ai\//);
    assert.match(page, /id="code-question"/);
    assert.match(page, /id="role-description"/);
    assert.match(page, /id="ticket-input"/);
    assert.equal((page.match(/role="tabpanel"/g) || []).length, 3);
    assert.match(page, /Run live triage/);
    assert.match(page, /Indexed repositories and commits/);
    assert.ok(!page.includes('<div id="root"></div>'));
  }
  assert.equal(
    (await fetch(origin + "/server/knowledge/source-index.json")).status,
    404,
  );
  assert.match(await (await fetch(origin + "/sitemap.xml")).text(), /\/ai\//);
});

test("selected work leads with evidence and links to focused case studies", () => {
  const cards = [
    ...html.matchAll(/<article class="flagship-card"[\s\S]*?<\/article>/g),
  ].map((match) => match[0]);
  assert.equal(cards.length, featuredStudies.length);
  for (const card of cards) {
    assert.match(card, /Explore case study/);
    assert.match(card, /href="\/work\/[a-z-]+\/"/);
    assert.match(card, /GitHub source/);
    assert.doesNotMatch(
      card,
      /System Impact &amp; Guarantees|Interface reconstruction/,
    );
  }
  assert.match(html, /id="banking-agent-harness"/);
  assert.match(html, /id="github-replica"/);
  for (const project of communityProjects) {
    const card = html.match(
      new RegExp(
        `<article[^>]*id="${project.slug}"[^>]*>([\\s\\S]*?)<\\/article>`,
      ),
    )?.[1];
    assert.ok(card, "Community project must be visible on the homepage");
    assert.ok(card.includes(escapeHTML(project.overview)));
    assert.ok(card.includes(`href="${project.demoUrl}"`));
    assert.ok(card.includes(`href="${project.githubUrl}"`));
    assert.ok(card.includes('src="/evidence/agri-samaj-workspace.png"'));
    assert.ok(
      !archive.includes(`id="${project.slug}"`),
      "Community project stays on the homepage, outside the archive",
    );
  }
});

test("tabs have connected ARIA relationships and predictable keyboard movement", () => {
  for (const page of [html, archive]) {
    const ids = new Set(
      [...page.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]),
    );
    for (const match of page.matchAll(
      /\baria-(?:controls|labelledby|describedby)="([^"]+)"/g,
    ))
      for (const id of match[1].split(" "))
        assert.ok(ids.has(id), "Missing ARIA target: " + id);
  }
  assert.equal((html.match(/role="tablist"/g) || []).length, 1);
  assert.equal((html.match(/aria-selected="true"/g) || []).length, 1);
  assert.equal((html.match(/role="tabpanel"/g) || []).length, 2);
  assert.equal(nextTabIndex("ArrowLeft", 0, 3), 2);
  assert.equal(nextTabIndex("ArrowRight", 2, 3), 0);
  assert.equal(nextTabIndex("Home", 2, 3), 0);
  assert.equal(nextTabIndex("End", 0, 3), 2);
  assert.equal(nextTabIndex("Escape", 0, 3), null);
  const event = { key: "k", metaKey: false, ctrlKey: true, altKey: false };
  assert.equal(isAssistantShortcut(event), true);
  assert.equal(
    isAssistantShortcut({ ...event, ctrlKey: false, metaKey: true }),
    true,
  );
  assert.equal(isAssistantShortcut({ ...event, altKey: true }), false);
  assert.equal(isAssistantShortcut({ ...event, isComposing: true }), false);
  assert.equal(isAssistantShortcut({ ...event, ctrlKey: false }), false);
});

test("preview images reserve dimensions and load lazily; generated pages contain clean editorial copy and links", () => {
  const banned = [
    ["actual", "project", "capture"],
    ["updated", "resume"],
    ["sign-in", "required"],
    ["implementation", "map", "·", "based", "on", "the", "project"],
  ].map((words) => words.join(" "));
  for (const page of [html, archive]) {
    for (const phrase of banned)
      assert.ok(!page.toLowerCase().includes(phrase), phrase);
    for (const match of page.matchAll(/<img\b[^>]*>/g)) {
      assert.match(match[0], /width="\d+"/);
      assert.match(match[0], /height="\d+"/);
      if (match[0].includes('class="brand-logo"')) {
        assert.match(match[0], /loading="eager"/);
        assert.match(match[0], /alt=""/);
      } else if (
        match[0].includes('fetchPriority="high"') ||
        match[0].includes('fetchpriority="high"')
      ) {
        assert.match(match[0], /loading="eager"/);
        assert.match(match[0], /alt="[^"]+"/);
      } else {
        assert.match(match[0], /loading="lazy"/);
        assert.match(match[0], /alt="[^"]+"/);
      }
    }
    for (const match of page.matchAll(/href="(https:[^"]+)"/g))
      assert.ok(!/\.git(?:[?#]|$)/.test(match[1]), match[1]);
  }
});

test("production code excerpt matches the actual request handler", async () => {
  const server = await readFile(
    new URL("../server/quota-lifecycle.mjs", import.meta.url),
    "utf8",
  );
  const lines = server.split(/\r?\n/).map((line) => line.trim());
  for (const line of productionCode.filter(Boolean))
    assert.ok(lines.includes(line.trim()), line);
  const python = await readFile(
    new URL("../examples/quota_lifecycle.py", import.meta.url),
    "utf8",
  );
  for (const line of pythonQuotaCode)
    assert.ok(
      python
        .split(/\r?\n/)
        .map((item) => item.trim())
        .includes(line.trim()),
      line,
    );
});

test("core foreground tokens maintain at least 7:1 contrast against every card surface", async () => {
  const css = await readFile(
    new URL("../src/recruiter.css", import.meta.url),
    "utf8",
  );
  const color = (name) =>
    css.match(new RegExp("--" + name + ": (#[a-f0-9]+)"))[1];
  const luminance = (hex) => {
    const c = hex
      .slice(1)
      .match(/../g)
      .map((value) => parseInt(value, 16) / 255)
      .map((value) =>
        value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
      );
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  for (const foreground of ["text", "muted", "accent"])
    for (const background of ["bg", "surface", "raised"]) {
      const a = luminance(color(foreground)),
        b = luminance(color(background));
      assert.ok(
        (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 7,
        foreground + "/" + background,
      );
    }
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /data-motion="off"/);
});

test("archive route serves all projects and responds to HEAD without a body", async () => {
  for (const path of ["/archive", "/archive/"]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), archive);
    const head = await fetch(origin + path, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");
  }
  assert.match(archive, /<title>Project Archive/);
});

test("production HTML includes complete portfolio content before executing JavaScript", () => {
  assertHomepage(html, siteOrigin(canonical));
  assertArchive(archive, siteOrigin(canonical));
  assert.equal(
    (archive.match(/data-project-id=/g) || []).length,
    archiveProjects.length,
  );
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

test("built assets and social preview resolve while source bundles stay private", async () => {
  const script = html.match(/<script[^>]+src="([^"]+)"/)?.[1];
  const css = html.match(/<link[^>]+href="([^"]+\.css)"/)?.[1];
  for (const path of [script, css, "/social-preview.png"])
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

test("the attached resume is linked consistently and served as a real PDF; the retired filename stays removed", async () => {
  const notFound = await readFile(
    new URL("../dist/404.html", import.meta.url),
    "utf8",
  );
  for (const page of [html, archive, notFound]) {
    assert.doesNotMatch(page, /Harsh_Gavand_Resume\.pdf/i);
    const links = [...page.matchAll(/<a\b[^>]*href="\/resume\.pdf"[^>]*>/g)];
    assert.ok(links.length >= 2);
    for (const link of links) {
      assert.match(link[0], /target="_blank"/);
      assert.match(link[0], /rel="noopener noreferrer"/);
    }
  }
  assert.ok(
    archive.includes("Django Resume Builder"),
    "Keep the genuine project listing",
  );
  assert.equal((await fetch(origin + "/Harsh_Gavand_Resume.pdf")).status, 404);
  const response = await fetch(origin + "/resume.pdf");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /application\/pdf/);
  assert.ok(
    Buffer.from(await response.arrayBuffer()).equals(
      await readFile(new URL("../public/resume.pdf", import.meta.url)),
    ),
  );
});

test("every HTML image, responsive image candidate, stylesheet, script, and CSS font/image reference resolves", async () => {
  const resources = new Set();
  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const resource = match[1].split(/[?#]/)[0];
    if (
      /\.(?:js|css|woff2|png|jpe?g|webp|svg|pdf)$/i.test(resource) &&
      resource.startsWith("/")
    )
      resources.add(resource);
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

test("all JavaScript chunks parse and are served as immutable JavaScript", async () => {
  const assets = new URL("../dist/assets/", import.meta.url);
  const scripts = (await readdir(assets)).filter((name) =>
    name.endsWith(".js"),
  );
  assert.ok(scripts.length > 0);
  assert.ok(!scripts.some((name) => name.startsWith("studioRenderer-")));
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
    assertArchive(
      archive.replace('data-project-id="27"', 'data-omitted="27"'),
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

test("project fragments stay semantic and remote-only availability is consistent", () => {
  for (const project of projects) {
    assert.match(project.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.equal(
      archive.includes('id="' + project.slug + '"'),
      archiveProjects.some((item) => item.id === project.id),
    );
  }
  assert.match(html, /Remote only/);
  assert.doesNotMatch(html, /relocat/i);
});

test("phase two exposes brand, language, replay, shipment and skills proof controls in initial HTML", () => {
  assert.match(html, /class="brand-logo"[^>]*src="\/brand\/hg-icon.webp"/);
  assert.match(html, /href="\/favicon.png"/);
  assert.match(html, /aria-label="Implementation language"/);
  assert.match(html, /Node.js \/ TypeScript/);
  assert.match(html, /Python \/ FastAPI/);
  assert.match(html, /class="trace-replay"[\s\S]*?Replay Trace/);
  assert.equal((html.match(/class="shipment-banner"/g) || []).length, 2);
  assert.equal((html.match(/class="skill-patterns"/g) || []).length, 4);
  assert.equal((html.match(/class="skill-proofs"/g) || []).length, 4);
  assert.match(html, /PromptWars AI Engineering Competition/);
  assert.match(html, /Supervity Autopilot Hackathon/);
  assert.match(html, /aria-label="Copy email harshgavand2@gmail.com"/);
});

test("hero proof shows the requested role, experience wording, and complete categorized logo stack", async () => {
  const hero = html.split('id="hero"')[1].split("</section>")[0];
  assert.match(hero, /FULL-STACK &amp; AI ENGINEER/);
  assert.match(hero, /2\+ years/);
  assert.match(
    hero,
    /building full-stack products, backend services, and applied AI workflows/,
  );
  assert.doesNotMatch(hero, /stack-chip|request-trace/);
  assert.match(html, /<details class="full-stack-disclosure"/);
  assert.equal((html.match(/class="stack-category"/g) || []).length, 6);
  assert.equal(
    (html.match(/class="stack-chip"/g) || []).length,
    resumeStackCount,
  );
  const response = await fetch(origin + "/stack/technology-logos.svg");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type"), /image\/svg\+xml/);
  const sprite = await response.text();
  for (const group of resumeStackGroups)
    for (const item of group.items) {
      assert.ok(html.includes(escapeHTML(item.name)), item.name);
      if (item.brand) {
        assert.ok(html.includes(`/stack/technology-logos.svg#${item.brand}`));
        assert.ok(sprite.includes(`id="${item.brand}"`));
      }
    }
});
test("the header, hero lists and code preview contain meaningful accessible content", () => {
  const header = html.match(
    /<header class="site-header">([\s\S]*?)<\/header>/,
  )[1];
  assert.doesNotMatch(header, /<div\b[^>]*>\s*<\/div>/);
  assert.doesNotMatch(html, /<li\b[^>]*>\s*<\/li>/);
  assert.match(header, /href="#contact">Contact<\/a>/);
  assert.match(html, /href="#projects"[^>]*>Explore selected work/);
  assert.match(html, /href="\/resume.pdf"[^>]*>View Resume/);
  assert.match(html, /quota\.releaseOrEnqueueRetry\(/);
});

test("request trace is the default hero tab with accounting-safe scenario controls", () => {
  assert.match(html, /Request Lifecycle Trace/);
  assert.match(html, /id="hero-proof-tab-0"[^>]*aria-selected="true"/);
  assert.match(
    html,
    /id="hero-proof-panel-0"(?![^>]*hidden=)[^>]*>[\s\S]*?class="request-trace"/,
  );
  assert.doesNotMatch(html, /Interfaces → APIs → workflows → data/);
  assert.match(html, /Happy Path \(618ms\)/);
  assert.match(html, /Pre-Dispatch Abort \(29ms\)/);
  assert.match(html, /Upstream Timeout &amp; Recovery \(1,240ms\)/);
  assert.doesNotMatch(html, /Waiting for trace|No API call|Gemini scenario/);
  assert.equal(
    traceStage("success", 3).message,
    "Settled 112 actual tokens · refunded 28",
  );
  assert.equal(traceStage("timeout", 2).failed, true);
  assert.equal(
    traceStage("timeout", 3).message,
    "Unknown usage · reservation retained for reconciliation",
  );
  assert.equal(
    traceStage("rollback", 3).message,
    "Released full 140-token reservation atomically",
  );
});

test("architecture pipelines and evidence are rendered on focused work pages", async () => {
  for (const slug of [
    "ugc-platform",
    "banking-saas",
    "github-replica",
    "news-automation",
    "banking-agent-harness",
    "agri-samaj-community-platform",
  ]) {
    for (const suffix of ["", "/"]) {
      const response = await fetch(origin + "/work/" + slug + suffix);
      assert.equal(response.status, 200, slug + suffix);
      const page = await response.text();
      assert.equal((page.match(/<h1(?:\s|>)/g) || []).length, 1);
      assert.ok(page.includes(`href="${siteOrigin(canonical)}/work/${slug}/"`));
      assert.match(page, /Implementation details/);
      assert.match(page, /Alternative &amp; tradeoff/);
      assert.match(page, /id="walkthrough"/);
      assert.match(page, /role="status" aria-live="polite" aria-atomic="true"/);
      assert.equal(
        (page.match(/aria-pressed="true"/g) || []).length >= 1,
        true,
      );
      assert.match(page, /blob\/[a-f0-9]{40}\//);
      const head = await fetch(origin + "/work/" + slug + suffix, {
        method: "HEAD",
      });
      assert.equal(head.status, 200);
      assert.equal(await head.text(), "");
    }
  }
  assert.equal((await fetch(origin + "/work/not-a-project/")).status, 404);
});

test("sample artifacts and preview captures are delivered with the correct content types", async () => {
  for (const path of [
    "/evidence/ugc-workspace.png",
    "/evidence/lendflow-workspace.png",
    "/evidence/devgraph-workspace.png",
    "/evidence/agri-samaj-workspace.png",
    "/evidence/news-digest.html",
    "/evidence/banking-harness.json",
  ]) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200, path);
    if (path.endsWith(".png"))
      assert.match(response.headers.get("content-type"), /image\/png/);
    if (path.endsWith(".html"))
      assert.match(await response.text(), /Sample Edition/);
    if (path.endsWith(".json"))
      assert.equal((await response.json()).scenarios.length, 3);
  }
});
