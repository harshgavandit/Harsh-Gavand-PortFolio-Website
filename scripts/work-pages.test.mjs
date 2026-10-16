import assert from "node:assert/strict";
import { test } from "node:test";
import * as navigation from "../src/lib/projectNavigation.ts";

test("focused work routes resolve current and legacy project names without exposing arbitrary catalog entries", () => {
  assert.equal(
    typeof navigation.workPage,
    "function",
    "Missing focused case-study resolver",
  );
  assert.equal(navigation.workPage("ugc-platform").project.id, 14);
  assert.equal(navigation.workPage("banking-agent-harness").project.id, 33);
  assert.equal(navigation.workPage("lendflow").project.slug, "banking-saas");
  assert.equal(navigation.workPage("not-a-project"), null);
  assert.equal(navigation.workPage("../ugc-platform"), null);
});

test("case-study paths have a stable canonical slug", () => {
  assert.equal(
    typeof navigation.workPath,
    "function",
    "Missing canonical work URL helper",
  );
  assert.equal(navigation.workPath("lendflow"), "/work/banking-saas/");
  assert.equal(navigation.workPath("ugc-platform"), "/work/ugc-platform/");
  assert.equal(navigation.workPath("missing"), null);
});
