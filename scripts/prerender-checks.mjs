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
      "SITE_URL / RENDER_EXTERNAL_URL must be an HTTPS origin without a path, query, or credentials.",
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
  assert.ok(html.includes(profile.resume), "Missing resume link");
  assert.ok(
    html.includes(`${origin}/social-preview.png`),
    "Incorrect social preview origin",
  );
  const directory = html
    .split('<ol class="project-directory-list">')[1]
    ?.split("</ol>")[0];
  assert.ok(directory, "Missing complete project directory");
  assert.equal(
    (directory.match(/data-project-id=/g) || []).length,
    projects.length,
  );
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
        directory.includes(escapeHTML(value)),
        `Missing public project content: ${project.title}`,
      );
  }
  for (const job of experience)
    assert.ok(
      html.includes(escapeHTML(job.company)),
      `Missing experience: ${job.company}`,
    );
}
