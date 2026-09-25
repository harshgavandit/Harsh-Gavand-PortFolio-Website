import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
const projects = JSON.parse(
  readFileSync(new URL("../src/data/projects.json", import.meta.url), "utf8"),
);
test("preserves every original project, its content, technology list, and links", () => {
  // Fingerprint of the original 26-project catalog before the redesign.
  const fingerprint = createHash("sha256")
    .update(JSON.stringify(projects))
    .digest("hex");
  assert.equal(
    fingerprint,
    "7a0c0a3819da71090a935eeb08f570eb8f1f232e5abde1f0924ba53b14ac739c",
  );
});
test("all project identifiers are unique and repository/demo links are valid HTTPS URLs", () => {
  assert.equal(new Set(projects.map((p) => p.id)).size, projects.length);
  for (const project of projects) {
    assert.equal(new URL(project.githubUrl).protocol, "https:");
    assert.equal(new URL(project.githubUrl).hostname, "github.com");
    if (project.demoUrl)
      assert.equal(new URL(project.demoUrl).protocol, "https:");
    assert.ok(
      project.features.length &&
        project.technologies.length &&
        project.role.length,
    );
  }
});
test("resume has a PDF signature and all responsive featured images exist", () => {
  const pdf = readFileSync(
    new URL("../public/Harsh_Gavand_Resume.pdf", import.meta.url),
  );
  assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
  assert.equal(
    createHash("sha256").update(pdf).digest("hex"),
    "e01a0147dc57cfb330c74c642c57687cec8657cede39440a76cabbc590dc195b",
  );
  for (const name of ["github", "banking"])
    for (const width of [640, 1280]) {
      assert.ok(
        existsSync(
          new URL(`../public/projects/${name}-${width}.webp`, import.meta.url),
        ),
      );
    }
});
test("SEO files use the canonical production origin and valid structured data", () => {
  const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const schema = JSON.parse(
    html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1],
  );
  assert.equal(schema.name, "Harsh Gavand");
  assert.equal(schema.email, "harsh.gavand.tech@gmail.com");
  for (const path of ["robots.txt", "sitemap.xml"])
    assert.ok(
      readFileSync(
        new URL(`../public/${path}`, import.meta.url),
        "utf8",
      ).includes(schema.url),
    );
});
