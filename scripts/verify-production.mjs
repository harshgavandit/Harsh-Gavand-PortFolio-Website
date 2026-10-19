import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  assertHomepage,
  assertArchive,
  siteOrigin,
} from "./prerender-checks.mjs";
import { profile } from "../src/data/portfolio.ts";
import { workStudies, featuredStudies } from "../src/data/workPresentation.ts";
import {
  projects,
  archiveProjects,
  communityProjects,
} from "../src/data/portfolio.ts";

// HTTP and generated-code verification only. Does not open a browser or call chat.
const origin = siteOrigin(process.argv[2] || profile.site);
async function request(path, options = {}) {
  return fetch(origin + path, {
    signal: AbortSignal.timeout(45000),
    ...options,
  });
}
const homeResponse = await request("/");
assert.equal(homeResponse.status, 200);
const home = await homeResponse.text();
assertHomepage(home, origin);
const archiveResponse = await request("/archive/");
assert.equal(archiveResponse.status, 200);
const archive = await archiveResponse.text();
assertArchive(archive, origin);
for (const project of communityProjects) {
  assert.ok(
    home.includes(`id="${project.slug}"`),
    "Community project must be featured on the homepage",
  );
  assert.ok(
    home.includes(`href="${project.demoUrl}"`),
    "Missing community live URL",
  );
  assert.ok(
    !archive.includes(`data-project-id="${project.id}"`),
    "Community project must stay outside the archive",
  );
}
const workPages = [];
for (const study of workStudies) {
  const project = projects.find((item) => item.id === study.projectId);
  const path = `/work/${project.slug}/`;
  const response = await request(path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(html.includes(`href="${origin}${path}"`), path + " canonical");
  assert.ok(
    html.includes('id="engineering-title"'),
    path + " engineering content",
  );
  assert.ok(html.includes('data-prerendered="true"'), path + " initial HTML");
  assert.ok(!html.includes('<div id="root"></div>'), path + " empty shell");
  workPages.push(html);
}
const resources = new Set();
for (const html of [home, archive, ...workPages]) {
  for (const match of html.matchAll(
    /\b(?:src|href)="(\/[^"?#]+\.(?:js|css|woff2|png|jpe?g|webp|svg|pdf))(?:#[^"]*)?"/g,
  ))
    resources.add(match[1]);
  for (const match of html.matchAll(/\bsrc[Ss]et="([^"]+)"/g))
    for (const candidate of match[1].split(","))
      resources.add(candidate.trim().split(/\s+/)[0]);
}
for (const cssPath of [...resources].filter((path) => path.endsWith(".css"))) {
  const response = await request(cssPath);
  assert.equal(response.status, 200);
  const css = await response.text();
  for (const match of css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
    if (match[1].startsWith("data:") || match[1].startsWith("#")) continue;
    const url = new URL(match[1], origin + cssPath);
    assert.equal(url.origin, origin);
    resources.add(url.pathname);
  }
}
const sha = (buffer) => createHash("sha256").update(buffer).digest("hex");
const assets = await Promise.all(
  [...resources].map(async (path) => {
    const response = await request(path);
    assert.equal(response.status, 200, path);
    assert.ok(
      !response.headers.get("content-type")?.includes("text/html"),
      path,
    );
    const body = Buffer.from(await response.arrayBuffer());
    assert.ok(body.length, path);
    const local = await readFile(new URL("../dist" + path, import.meta.url));
    assert.equal(
      sha(body),
      sha(local),
      "Deployed asset differs from local build: " + path,
    );
    return { path, bytes: body.length, sha256: sha(body) };
  }),
);
const bot = await request("/", { headers: { "User-Agent": "Googlebot" } });
assert.equal(await bot.text(), home);
const missing = await request("/not-a-portfolio-route");
assert.equal(missing.status, 404);
assert.match(await missing.text(), /noindex, follow/);
const removedDocument = await request("/Harsh_Gavand_Resume.pdf");
assert.equal(
  removedDocument.status,
  404,
  "Removed personal document remains accessible",
);
for (const page of [home, archive])
  assert.doesNotMatch(page, /Harsh_Gavand_Resume\.pdf/i);
const resume = await request(profile.resume);
assert.equal(resume.status, 200);
assert.match(resume.headers.get("content-type"), /application\/pdf/);
const resumeBody = Buffer.from(await resume.arrayBuffer());
assert.match(resumeBody.subarray(0, 8).toString(), /^%PDF-1\./);
assert.ok(
  resumeBody.equals(
    await readFile(new URL("../public/resume.pdf", import.meta.url)),
  ),
);
const health = await request("/api/health");
assert.equal(health.status, 200);
const healthInfo = await health.json();
assert.equal(healthInfo.runtime, "vercel", "Expected the API to run on Vercel");
const chatMethod = await request("/api/chat");
assert.equal(chatMethod.status, 405);
assert.equal(chatMethod.headers.get("allow"), "POST");
const invalidChat = await request("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: origin },
  body: JSON.stringify({ messages: [] }),
});
assert.equal(
  invalidChat.status,
  400,
  "Expected origin-approved validation before any provider work",
);
const cron = await request("/api/quota-reconcile");
assert.equal(cron.status, 401, "The recovery job must require authentication");
const report = {
  verifiedAt: new Date().toISOString(),
  origin,
  homeBytes: Buffer.byteLength(home),
  archiveBytes: Buffer.byteLength(archive),
  chapters: 5,
  flagshipCards: featuredStudies.length,
  curatedRows: 8,
  archiveProjects: archiveProjects.length,
  caseStudyPages: workPages.length,
  assets,
  googlebotHTMLMatches: true,
  unknownPageStatus: 404,
  removedDocumentStatus: 404,
  resumeStatus: 200,
  apiHealthStatus: 200,
  apiRuntime: healthInfo.runtime,
  assistantConfigured: healthInfo.assistantConfigured,
  usageProtectionConfigured: healthInfo.usageProtection.configured,
  scheduledRecoveryConfigured: healthInfo.scheduledRecoveryConfigured,
  invalidChatStatus: 400,
  unauthenticatedCronStatus: 401,
  browserReview:
    "This script verifies HTTP delivery; browser review is recorded separately.",
  providerCalls: 0,
};
await mkdir(new URL("../tmp/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../tmp/recruiter-production-verification.json", import.meta.url),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify({ ...report, assets: assets.length }));
