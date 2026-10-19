import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
export async function runtimeDigest() {
  const files = [
    "server/app.mjs",
    "server/openai.mjs",
    "server/grounding.mjs",
    "server/ai-tools.mjs",
    "server/evidence-policy.mjs",
    "server/ai-operations.mjs",
    "server/voice.mjs",
    "server/quota.mjs",
    "server/quota-lifecycle.mjs",
    "server/knowledge/source-index.json",
    "src/data/portfolio.ts",
    "src/data/projects.json",
    "src/data/recentProjects.json",
    "src/data/platformProjects.json",
    "src/data/workPresentation.ts",
    "src/data/caseEvidence.ts",
    "scripts/ai-eval-cases.mjs",
    "scripts/evaluate-ai.mjs",
  ];
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(file);
    hash.update(
      (await readFile(new URL("../" + file, import.meta.url), "utf8")).replace(
        /\r\n/g,
        "\n",
      ),
    );
  }
  return hash.digest("hex");
}
