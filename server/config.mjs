import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { profile } from "../src/data/portfolio.ts";

export function loadConfig() {
  const vercel = process.env.VERCEL === "1";
  const production = vercel || process.env.NODE_ENV === "production";
  // Existing process variables take precedence. The parent env is a local-only
  // convenience for this workspace; it is never served, copied, or bundled.
  const candidates = vercel ? [] : ["../.env.local", "../.env"];
  if (!production) candidates.push("../../.env");
  for (const relative of candidates) {
    const path = fileURLToPath(new URL(relative, import.meta.url));
    if (existsSync(path)) loadEnvFile(path);
  }
  const model = process.env.OPENAI_MODEL || "gpt-6-luna";
  if (model !== "gpt-6-luna")
    throw new Error("OPENAI_MODEL must be gpt-6-luna for this assistant.");
  const dailyLimit = Number(process.env.AI_DAILY_REQUEST_LIMIT || 200);
  const monthlyBudget = process.env.AI_MONTHLY_BUDGET_USD || "1.00";
  if (
    !Number.isSafeInteger(dailyLimit) ||
    dailyLimit < 1 ||
    dailyLimit > 10000 ||
    !/^(?:0|[1-9][0-9]{0,3})(?:\.[0-9]{1,2})?$/.test(monthlyBudget) ||
    Number(monthlyBudget) <= 0
  )
    throw new Error("Invalid AI usage allowance configuration.");
  return {
    apiKey: process.env.OPENAI_API_KEY || "",
    model,
    quotaUrl: process.env.UPSTASH_REDIS_REST_URL || "",
    quotaToken: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    dailyLimit,
    monthlyBudgetMicros: Math.round(Number(monthlyBudget) * 1000000),
    port: Number(process.env.PORT || 3001),
    allowedOrigins: (
      process.env.ALLOWED_ORIGINS ||
      (production
        ? profile.site
        : "http://localhost:5173,http://127.0.0.1:5173")
    )
      .split(",")
      .map((s) => s.trim().replace(/\/+$/, ""))
      .filter(Boolean),
    trustProxy: vercel || process.env.TRUST_PROXY === "1",
    production,
    vercel,
    cronSecret: process.env.CRON_SECRET || "",
  };
}
