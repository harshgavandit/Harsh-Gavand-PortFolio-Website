import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { runtimeDigest } from "./ai-runtime-digest.mjs";
import { sourceSnapshot } from "../server/grounding.mjs";
const report = JSON.parse(
  await readFile(
    new URL("../src/data/aiQuality.json", import.meta.url),
    "utf8",
  ),
);
assert.equal(report.status, "completed");
assert.equal(
  report.runtimeDigest,
  await runtimeDigest(),
  "Run the explicit live evaluation before releasing changed AI runtime or graders.",
);
assert.equal(report.sourceSnapshot, sourceSnapshot.digest);
assert.equal(
  report.summary.passed,
  report.summary.total,
  "A failed release benchmark cannot pass the release gate.",
);
assert.ok(
  report.dataset.uniqueCases >= 24 && report.dataset.repetitions >= 2,
  "At least 24 distinct synthetic cases and two repetitions are required.",
);
assert.equal(report.retrieval.passed, report.retrieval.total);
console.log(
  `AI release gate passed: ${report.summary.total} responses, current runtime/source fingerprint, ${report.retrieval.total} retrieval checks.`,
);
