import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

export function loadConfig() {
  // Existing process variables take precedence. The parent env is a local-only
  // convenience for this workspace; it is never served, copied, or bundled.
  const candidates = ["../.env.local", "../.env"];
  if (process.env.NODE_ENV !== "production") candidates.push("../../.env");
  for (const relative of candidates) {
    const path = fileURLToPath(new URL(relative, import.meta.url));
    if (existsSync(path)) loadEnvFile(path);
  }
  const model = process.env.OPENAI_MODEL || "gpt-6-luna";
  if (model !== "gpt-6-luna")
    throw new Error("OPENAI_MODEL must be gpt-6-luna for this assistant.");
  return {
    apiKey: process.env.OPENAI_API_KEY || "",
    model,
    port: Number(process.env.PORT || 3001),
    allowedOrigins: (
      process.env.ALLOWED_ORIGINS ||
      (process.env.NODE_ENV === "production"
        ? ""
        : "http://localhost:5173,http://127.0.0.1:5173")
    )
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    trustProxy: process.env.TRUST_PROXY === "1",
    production: process.env.NODE_ENV === "production",
  };
}
