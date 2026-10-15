import assert from "node:assert/strict";
import { projects, experience, profile } from "../src/data/portfolio.ts";

export function siteOrigin(value) {
  const url = new URL(value);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(
      "SITE_URL must be an HTTPS origin without a path, query, or credentials.",
    );
  return url.origin;
}

export function escapeHTML(value) {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
      })[character],
  );
}

export function assertHomepage(html, origin = profile.site) {
  assert.ok(
    html.includes('data-prerendered="true"'),
    "Missing hydration marker",
  );
  assert.ok(!html.includes('<div id="root"></div>'), "Empty application shell");
  assert.equal(
    (html.match(/<h1(?:\s|>)/g) || []).length,
    1,
    "Expected one page heading",
  );
  assert.ok(html.includes('id="main"'), "Missing main content");
  assert.ok(html.includes('id="contact"'), "Missing contact content");
  assert.ok(html.includes(profile.email), "Missing public contact email");
  assert.ok(
    html.includes(`href="${profile.resume}"`),
    "Missing resume PDF access",
  );
  assert.ok(
    !/href=["'][^"']*Harsh_Gavand_Resume\.pdf/i.test(html),
    "Removed personal document link must not be published",
  );
  assert.ok(
    html.includes(`${origin}/social-preview.png`),
    "Incorrect social preview origin",
  );
  const chapterNumbers = [...html.matchAll(/data-chapter-number="(\d+)"/g)].map(
    (match) => match[1],
  );
  assert.deepEqual(chapterNumbers, ["01", "02", "03", "04", "05"]);
  assert.equal((html.match(/class="flagship-card"/g) || []).length, 4);
  assert.ok(html.includes('id="all-projects"'));
  assert.equal(
    (html.match(/<tr>/g) || []).length,
    9,
    "Expected eight curated repositories and a table header",
  );
  assert.ok(html.includes('href="/archive"'));
  for (const job of experience)
    assert.ok(
      html.includes(escapeHTML(job.company)),
      `Missing experience: ${job.company}`,
    );
}

export function assertArchive(html, origin = profile.site) {
  assert.ok(html.includes('data-prerendered="true"'));
  assert.ok(html.includes('href="' + origin + '/archive/"'));
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
  assert.equal((html.match(/data-project-id=/g) || []).length, projects.length);
  for (const project of projects) {
    for (const value of [
      project.title,
      project.overview,
      project.role,
      project.challenges,
      project.impact,
      project.githubUrl,
      ...project.features,
      ...project.technologies,
    ])
      assert.ok(
        html.includes(escapeHTML(value)),
        "Missing archive content: " + project.title,
      );
  }
}
