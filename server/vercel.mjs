import { timingSafeEqual } from "node:crypto";
import { createApplication } from "./app.mjs";
import { RedisQuota } from "./quota.mjs";
import { RedisAdmission } from "./admission.mjs";

function json(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(body));
}

export function withInvocationLifetime(handle, waitUntil) {
  return (req, res) => {
    // Register before execution so cancellation and res.end() cannot freeze
    // reservation settlement or lease cleanup that is still being awaited.
    const invocation = Promise.resolve().then(() => handle(req, res));
    waitUntil(invocation);
    return invocation;
  };
}

export function createVercelHandler(config) {
  const quota =
    config.quota ||
    new RedisQuota({
      url: config.quotaUrl,
      token: config.quotaToken,
      dailyLimit: config.dailyLimit,
      monthlyBudgetMicros: config.monthlyBudgetMicros,
    });
  const admission = config.admission || new RedisAdmission({ store: quota });
  const app = createApplication({
    ...config,
    quota,
    admission,
    trustProxy: true,
    beforeGenerate: () => app.reconcile({ limit: 1 }),
  });
  return async function handler(req, res) {
    let url;
    try {
      url = new URL(req.url, "https://harshgavand.dev");
    } catch {
      return json(res, 400, { error: "Invalid request." });
    }
    // Vercel may preserve the original pathname or pass the rewrite destination.
    // A captured path makes both invocation forms explicit and testable.
    if (["/api/index", "/api/index.mjs"].includes(url.pathname)) {
      const path = url.searchParams.get("__path") || "";
      if (!/^[a-z0-9/-]*$/i.test(path))
        return json(res, 400, { error: "Invalid API path." });
      url.pathname = "/api/" + path;
      req.url = url.pathname;
    }
    if (url.pathname === "/api/quota-reconcile") {
      if (req.method !== "GET") {
        res.setHeader("Allow", "GET");
        return json(res, 405, { error: "Use GET." });
      }
      const expected = Buffer.from(`Bearer ${config.cronSecret || ""}`);
      const actual = Buffer.from(String(req.headers.authorization || ""));
      if (
        !config.cronSecret ||
        expected.length !== actual.length ||
        !timingSafeEqual(expected, actual)
      )
        return json(res, 401, { error: "Unauthorized." });
      try {
        return json(res, 200, await quota.retrySettlements({ limit: 3 }));
      } catch {
        return json(res, 503, {
          error: "Accounting recovery is temporarily unavailable.",
        });
      }
    }
    if (!url.pathname.startsWith("/api/"))
      return json(res, 404, { error: "Not found." });
    await app.handler(req, res);
  };
}
