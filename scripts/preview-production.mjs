// Run the production build locally, behaving like harshgavand.dev:
//   npm run preview:prod            build, pre-render, then serve on :4173
//   npm run preview:prod -- --no-build   serve the existing dist/
//
// Same as production: pre-rendered pages, 404 page and status, redirects,
// security headers, canonical SITE_URL, the gpt-6-luna assistant, voice and AI
// tools, Redis-backed daily/monthly allowance, concurrency admission and
// settlement recovery.
//
// Kept separate from production on purpose: the allowance and admission use
// their own Redis namespace (portfolio-ai:local-preview), so local questions
// never consume visitors' allowance; production metrics and the public answer
// cache are read but never written.
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { createServer as httpServer } from "node:http";

const root = fileURLToPath(new URL("../", import.meta.url));
// Local secrets: repository .env.local/.env, then the workspace-level .env.
for (const file of ["../.env.local", "../.env", "../../.env"]) {
  const path = fileURLToPath(new URL(file, import.meta.url));
  if (existsSync(path)) loadEnvFile(path);
}
const port = Number(process.env.PREVIEW_PORT || 4173);
process.env.SITE_URL ||= "https://harshgavand.dev";

if (!process.argv.includes("--no-build")) {
  const build = spawnSync(
    process.execPath,
    ["scripts/run-npm.mjs", "run", "build"],
    { cwd: root, stdio: "inherit", env: { ...process.env, NODE_ENV: "" } },
  );
  if (build.status !== 0) process.exit(build.status || 1);
}
if (!existsSync(new URL("../dist/index.html", import.meta.url)))
  throw new Error("dist/ is missing. Run without --no-build first.");

// Import after the build so the server reads the same data the pages show.
process.env.NODE_ENV = "production";
const { loadConfig } = await import("../server/config.mjs");
const { createApplication } = await import("../server/app.mjs");
const { RedisQuota } = await import("../server/quota.mjs");
const { RedisAdmission } = await import("../server/admission.mjs");
const { AIMetrics, PublicGuideCache } =
  await import("../server/ai-operations.mjs");

const origins = [`http://localhost:${port}`, `http://127.0.0.1:${port}`];
const config = { ...loadConfig(), allowedOrigins: origins, port };
const quota = new RedisQuota({
  url: config.quotaUrl,
  token: config.quotaToken,
  dailyLimit: config.dailyLimit,
  monthlyBudgetMicros: config.monthlyBudgetMicros,
  namespace: "portfolio-ai:local-preview",
});
const productionMetrics = new AIMetrics({ store: quota });
const productionCache = new PublicGuideCache({ store: quota });
const app = createApplication({
  ...config,
  production: true,
  trustProxy: false,
  quota,
  admission: new RedisAdmission({ store: quota }),
  metrics: {
    snapshot: () => productionMetrics.snapshot(),
    record: async () => {},
  },
  guideCache: {
    get: (messages) => productionCache.get(messages),
    put: async () => {},
  },
});
const server = httpServer(app.handler);
server.requestTimeout = 35000;
server.headersTimeout = 10000;
server.listen(port, "127.0.0.1", () => {
  const ai = config.apiKey
    ? quota.configured
      ? "assistant, voice and AI tools on"
      : "assistant on; voice off (Upstash Redis not configured)"
    : "assistant off (OPENAI_API_KEY not set)";
  console.log(
    `\nProduction preview: http://localhost:${port}  (${ai}; allowance ${config.dailyLimit}/day, $${config.monthlyBudgetMicros / 1e6}/month in a separate local namespace)\nPress Ctrl+C to stop.`,
  );
  void app.reconcile();
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    server.close();
    server.closeIdleConnections();
  });
