import assert from "node:assert/strict";
import { test } from "node:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import {
  retrieveCode,
  codeEvidence,
  sourceSnapshot,
} from "../server/grounding.mjs";
import { sourceAllowlist } from "./source-allowlist.mjs";
import { aiEvalCases, gradeCase } from "./ai-eval-cases.mjs";

test("source snapshot preserves public provenance, content hashes, and bounded excerpts", () => {
  assert.equal(sourceSnapshot.repositories.length, 6);
  for (const file of sourceSnapshot.files) {
    assert.ok(
      sourceAllowlist.some(
        (entry) =>
          entry.repo === file.repo &&
          entry.slug === file.slug &&
          entry.files.includes(file.path),
      ),
    );
    assert.match(file.commit, /^[a-f0-9]{40}$/);
    assert.equal(
      createHash("sha256").update(file.text).digest("hex"),
      file.sha256,
    );
    assert.doesNotMatch(file.path, /\.env|node_modules|\.sqlite|\.pdf|\.docx/);
    assert.notEqual(file.slug, "agri-samaj-community-platform");
  }
});

test("missing-information grading accepts explicit natural refusals and rejects invented compensation", () => {
  const item = aiEvalCases.find(
    (item) => item.id === "guide-unknown-compensation",
  );
  const execution = { elapsedMs: 1, model: "gpt-6-luna" };
  assert.equal(
    gradeCase(item, {
      execution,
      answer:
        "Harsh’s exact salary isn’t listed in his public portfolio. Please contact him.",
    }).passed,
    true,
  );
  assert.equal(
    gradeCase(item, {
      execution,
      answer: "Harsh received a salary of ten lakh rupees at GlobeTrek.",
    }).passed,
    false,
  );
});
test("technical retrieval resolves credit recovery and deterministic policy to actual code lines", () => {
  for (const [question, expected] of [
    [
      "Where does the portfolio release a reservation when a client aborts?",
      "portfolio",
    ],
    [
      "How does UGC refund credits when image generation fails?",
      "ugc-platform",
    ],
    [
      "How does the banking agent harness validate transfer limits?",
      "banking-agent-harness",
    ],
    [
      "How does the RAG project combine BM25 and vector search with reciprocal rank fusion?",
      "hybrid-rag-documentation-assistant",
    ],
  ]) {
    const results = retrieveCode(question);
    assert.ok(results.length > 0 && results.length <= 4, question);
    assert.equal(results[0].slug, expected, question);
    const citations = codeEvidence(
      results.map((result) => result.id),
      question,
    );
    assert.ok(
      citations.every(
        (c) =>
          c.href.endsWith(`#L${c.startLine}-L${c.endLine}`) &&
          c.text.length <= 2800,
      ),
    );
  }
});
test("unknown questions and fabricated citation identifiers produce no supporting code", () => {
  assert.deepEqual(retrieveCode("zygomorphic quasar oscillation"), []);
  assert.deepEqual(
    codeEvidence(["javascript:alert(1)", "missing"], "quota"),
    [],
  );
  const unrelated = retrieveCode("How does UGC refund credits?")[0];
  assert.deepEqual(
    codeEvidence(
      [unrelated.id],
      "How does the RAG project combine BM25 and vector retrieval?",
    ),
    [],
  );
});
test("public summary and deployment source index represent the same immutable snapshot", async () => {
  const summary = JSON.parse(
    await readFile(new URL("../src/data/sourceSummary.json", import.meta.url)),
  );
  assert.equal(summary.digest, sourceSnapshot.digest);
  assert.equal(summary.fileCount, sourceSnapshot.files.length);
});
