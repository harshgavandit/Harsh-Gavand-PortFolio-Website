import test from "node:test";
import assert from "node:assert/strict";

test("engineering notes are well formed and drafts stay unpublished by default", async () => {
  delete process.env.NOTES_DRAFTS;
  const { notes, includeDrafts } = await import(
    "../src/data/notes.ts?default=" + Date.now()
  );
  assert.equal(includeDrafts, false);
  assert.ok(notes.every((note) => !note.draft));
  process.env.NOTES_DRAFTS = "1";
  const preview = await import("../src/data/notes.ts?drafts=" + Date.now());
  delete process.env.NOTES_DRAFTS;
  const slugs = new Set();
  for (const note of preview.notes) {
    assert.match(note.slug, /^[a-z0-9-]+$/);
    assert.ok(!slugs.has(note.slug), note.slug);
    slugs.add(note.slug);
    assert.match(note.published, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(note.description.length >= 70 && note.description.length <= 160);
    assert.ok(note.sources.length > 0);
    for (const source of note.sources)
      assert.match(source.href, /^https:\/\/github\.com\/harshgavandit\//);
    const { noteBodies } = await import("../src/data/noteBodies.ts");
    const body = noteBodies[note.slug];
    assert.ok(body?.length, note.slug);
    const ids = body.filter((b) => b.type === "h2").map((b) => b.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.doesNotMatch(
      JSON.stringify(body),
      /\b(?:demo|prototype|experiment|toy)\b/i,
    );
  }
});
