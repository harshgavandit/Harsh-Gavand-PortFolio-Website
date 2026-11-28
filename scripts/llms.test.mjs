import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { profile, projectSlug } from "../src/data/portfolio.ts";
import { workStudies } from "../src/data/workPresentation.ts";
import { workPage, workPath } from "../src/lib/projectNavigation.ts";
import { writeLlmProfiles } from "./llms.mjs";

test("LLM profile files use the published contact and every case-study path", async (t) => {
  const temp = await mkdtemp(join(tmpdir(), "portfolio-llms-"));
  t.after(() => rm(temp, { recursive: true, force: true }));
  const directory = pathToFileURL(temp + sep);
  const origin = "https://portfolio.example";
  await writeLlmProfiles(directory, origin);
  const [short, full] = await Promise.all(
    ["llms.txt", "llms-full.txt"].map((name) =>
      readFile(new URL(name, directory), "utf8"),
    ),
  );
  assert.ok(Buffer.byteLength(short) < 4096);
  for (const document of [short, full]) {
    assert.ok(document.startsWith(`# ${profile.name}\n`));
    assert.equal(document.match(/mailto:([^\)]+)/)?.[1], profile.email);
    assert.doesNotMatch(
      document,
      /\bundefined\b|\[object Object\]|<\/?[a-z][^>]*>/i,
    );
    assert.deepEqual(
      [
        ...document.matchAll(
          /\]\((https:\/\/portfolio\.example\/work\/[^)]+)\)/g,
        ),
      ].map((match) => match[1]),
      workStudies.map(
        ({ projectId }) => origin + workPath(projectSlug(projectId)),
      ),
    );
  }
  const summaries = new Map(
    [
      ...short.matchAll(
        /\]\((https:\/\/portfolio\.example\/work\/[^)]+)\): (.+)/g,
      ),
    ].map(([, href, summary]) => [href, summary]),
  );
  for (const { projectId } of workStudies) {
    const slug = projectSlug(projectId);
    const { study } = workPage(slug);
    const summary = summaries.get(origin + workPath(slug));
    assert.ok(summary, `Missing summary for ${slug}`);
    assert.ok(
      study.summary
        .replace(/\s+/g, " ")
        .trim()
        .startsWith(summary.replace(/[.…]$/, "")),
      `Expected an excerpt of the published summary for ${slug}`,
    );
  }
});
