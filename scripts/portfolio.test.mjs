import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import {
  projects as catalog,
  latestAIProjects,
  caseStudies,
} from "../src/data/portfolio.ts";
import { matchesProjectCollection } from "../src/lib/portfolioActions.ts";
import { curatedArchive } from "../src/data/recruiter.ts";
const projects = JSON.parse(
  readFileSync(new URL("../src/data/projects.json", import.meta.url), "utf8"),
);
test("curated archive references eight distinct catalog projects and flagship stacks match reviewed source", () => {
  assert.equal(curatedArchive.length, 8);
  assert.equal(new Set(curatedArchive.map((item) => item.projectId)).size, 8);
  for (const item of curatedArchive)
    assert.ok(catalog.some((project) => project.id === item.projectId));
  const stack = (id) =>
    catalog.find((project) => project.id === id).technologies;
  for (const value of ["Prisma", "PostgreSQL", "Google AI"])
    assert.ok(stack(14).includes(value));
  assert.ok(!stack(14).includes("MongoDB"));
  assert.ok(stack(3).includes("Sequelize"));
  for (const value of ["Next.js", "Plaid", "Appwrite"])
    assert.ok(!stack(3).includes(value));
  assert.ok(stack(17).includes("Ollama"));
  assert.equal(caseStudies.length, 4);
  for (const study of caseStudies) assert.equal(study.engineering.length, 3);
});
test("preserves all original project identities while correcting editorial copy", () => {
  const identities = JSON.parse(
    readFileSync(
      new URL("./fixtures/project-identities.json", import.meta.url),
      "utf8",
    ),
  );
  assert.deepEqual(
    projects.map(({ id, githubUrl }) => ({ id, githubUrl })),
    identities,
  );
  for (const project of catalog) {
    assert.match(project.impact, /^I /);
    assert.match(project.role, /^I /);
    assert.ok(
      project.features.length &&
        project.challenges.length &&
        project.overview.length,
    );
    assert.ok(!project.githubUrl.endsWith(".git"));
  }
});
test("all project identifiers are unique and repository/demo links are valid HTTPS URLs", () => {
  assert.equal(new Set(catalog.map((p) => p.id)).size, catalog.length);
  assert.equal(
    new Set(catalog.map((p) => p.githubUrl.toLowerCase())).size,
    catalog.length,
  );
  for (const project of catalog) {
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
test("all recently pushed AI repositories are included once, discoverable, and traced to reviewed commits", () => {
  const sources = JSON.parse(
    readFileSync(
      new URL(
        "../verification/github-projects-2026-10-15/sources.json",
        import.meta.url,
      ),
      "utf8",
    ),
  );
  assert.equal(catalog.length, 38);
  assert.equal(latestAIProjects.length, 12);
  assert.equal(sources.projects.length, 12);
  assert.deepEqual(
    catalog.filter((project) => matchesProjectCollection(project, "Latest AI")),
    latestAIProjects,
  );
  for (const source of sources.projects) {
    const project = catalog.find((item) => item.id === source.projectId);
    assert.equal(project.githubUrl, source.url);
    assert.ok(Date.parse(source.pushedAt) >= Date.parse(sources.windowStart));
    assert.ok(Date.parse(source.pushedAt) <= Date.parse(sources.windowEnd));
    assert.match(source.commit, /^[a-f0-9]{40}$/);
    assert.ok(source.inspectedSourcePaths.length > 0);
    assert.equal(matchesProjectCollection(project, "Latest AI"), true);
    assert.equal(matchesProjectCollection(project, "AI & ML"), true);
    assert.equal(matchesProjectCollection(project, "All"), true);
    assert.equal(project.demoUrl, undefined);
  }
  for (const project of projects) {
    assert.deepEqual(
      catalog.find((item) => item.id === project.id),
      project,
    );
    assert.equal(matchesProjectCollection(project, "Latest AI"), false);
  }
  assert.ok(
    caseStudies.every((study) =>
      catalog.some((project) => project.id === study.projectId),
    ),
  );
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

test("original supplied portrait remains unaltered", () => {
  const portrait = readFileSync(
    new URL("../public/portrait/harsh.jpeg", import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(portrait).digest("hex"),
    "cf722b0070f9634cd864ac056994766102892c4675d831147a0c6007d91bdf96",
  );
});

test("new studio portrait matches the user's supplied photograph", () => {
  const photo = readFileSync(
    new URL("../public/portrait/harsh-studio.jpg", import.meta.url),
  );
  assert.equal(
    createHash("sha256").update(photo).digest("hex"),
    "d588f408c446e4cef1588f8bf0ae3cf1f2cb6a0ef5b052ee910903c51d5c2686",
  );
});
