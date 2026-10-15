import assert from "node:assert/strict";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import {
  assertHomepage,
  assertArchive,
  siteOrigin,
} from "./prerender-checks.mjs";
import { profile } from "../src/data/portfolio.ts";

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
const resources = new Set();
for (const html of [home, archive]) {
  for (const match of html.matchAll(
    /\b(?:src|href)="(\/[^"?#]+\.(?:js|css|woff2|png|jpe?g|webp|svg|pdf))"/g,
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
const health = await request("/api/health");
assert.equal(health.status, 200);
const report = {
  verifiedAt: new Date().toISOString(),
  origin,
  homeBytes: Buffer.byteLength(home),
  archiveBytes: Buffer.byteLength(archive),
  chapters: 5,
  flagshipCards: 4,
  curatedRows: 8,
  archiveProjects: 38,
  assets,
  googlebotHTMLMatches: true,
  unknownPageStatus: 404,
  removedDocumentStatus: 404,
  apiHealthStatus: 200,
  browserReview: "Not performed; user requested code-level verification only.",
  providerCalls: 0,
};
await mkdir(new URL("../tmp/", import.meta.url), { recursive: true });
await writeFile(
  new URL("../tmp/recruiter-production-verification.json", import.meta.url),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify({ ...report, assets: assets.length }));
