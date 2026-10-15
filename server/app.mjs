import { createServer as httpServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ChatError,
  validateMessages,
  generateReply,
  sourceLinks,
  buildRequest,
} from "./openai.mjs";

import { RedisQuota, reservationFor, usageCost } from "./quota.mjs";

const defaultDist = resolve(
  fileURLToPath(new URL("../dist/", import.meta.url)),
);
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
  ".xml": "application/xml",
};

export function createServer(config) {
  const dist = resolve(config.staticDirectory || defaultDist);
  const {
    apiKey,
    model,
    allowedOrigins = [],
    trustProxy = false,
    clientLimit = 10,
    globalLimit = 60,
    windowMs = 600000,
  } = config;
  const quota =
    config.quota ||
    new RedisQuota({
      url: config.quotaUrl,
      token: config.quotaToken,
      dailyLimit: config.dailyLimit,
      monthlyBudgetMicros: config.monthlyBudgetMicros,
    });
  const generate =
    config.generate ||
    ((messages, signal, request) =>
      generateReply(messages, { apiKey, model, signal, request }));
  const clients = new Map();
  let global = { count: 0, reset: Date.now() + windowMs };
  let concurrent = 0;
  function json(res, status, body, retryAfter) {
    res.writeHead(status, {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...(retryAfter ? { "Retry-After": String(retryAfter) } : {}),
    });
    res.end(JSON.stringify(body));
  }
  return httpServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("X-Frame-Options", "DENY");
    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
    } catch {
      return json(res, 400, { error: "Invalid request." });
    }
    if (pathname === "/api/health" && req.method === "GET")
      return json(res, 200, {
        status: "ok",
        assistantConfigured: Boolean(apiKey),
        model,
        usageProtection: {
          configured: quota.configured,
          dailyLimit: quota.dailyLimit,
          monthlyBudgetUsd: quota.monthlyBudgetMicros / 1000000,
          resetTimezone: "UTC",
        },
      });
    if (pathname === "/api/chat") {
      if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return json(res, 405, { error: "Use POST." });
      }
      if (req.headers.origin && !allowedOrigins.includes(req.headers.origin))
        return json(res, 403, { error: "This origin is not allowed." });
      if (!req.headers["content-type"]?.startsWith("application/json"))
        return json(res, 415, { error: "Send JSON." });
      if (!apiKey)
        return json(res, 503, {
          error:
            "The assistant is not configured yet. Please contact Harsh directly.",
          code: "not_configured",
        });
      let inFlight = false;
      const controller = new AbortController();
      const abort = () => {
        if (!res.writableEnded) controller.abort();
      };
      res.on("close", abort);
      try {
        const chunks = [];
        let bytes = 0;
        for await (const chunk of req) {
          bytes += chunk.length;
          if (bytes > 16384)
            throw new ChatError(
              413,
              "too_large",
              "The request is too large. Please shorten your question.",
            );
          chunks.push(chunk);
        }
        let body;
        try {
          body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
        } catch {
          throw new ChatError(400, "invalid_json", "Send a valid question.");
        }
        const messages = validateMessages(body);
        const now = Date.now();
        for (const [key, value] of clients)
          if (value.reset <= now) clients.delete(key);
        if (global.reset <= now) global = { count: 0, reset: now + windowMs };
        // Only trust the nearest forwarded hop when explicitly enabled behind a trusted proxy.
        const ip = trustProxy
          ? String(req.headers["x-forwarded-for"] || req.socket.remoteAddress)
              .split(",")
              .at(-1)
              .trim()
          : req.socket.remoteAddress;
        const client = clients.get(ip) || { count: 0, reset: now + windowMs };
        if (
          client.count >= clientLimit ||
          global.count >= globalLimit ||
          concurrent >= 3
        )
          throw new ChatError(
            429,
            "rate_limit",
            "The assistant is busy. Please try again shortly or use the contact links.",
            concurrent >= 3
              ? 5
              : Math.max(
                  1,
                  Math.ceil(
                    ((client.count >= clientLimit
                      ? client.reset
                      : global.reset) -
                      now) /
                      1000,
                  ),
                ),
          );
        client.count++;
        global.count++;
        clients.set(ip, client);
        concurrent++;
        inFlight = true;
        const request = buildRequest(messages, model);
        const estimate = reservationFor(request);
        const reservation = await quota.reserve(estimate.amount);
        // Keep the full reservation after cancellations, timeouts or provider
        // failures: these may already have incurred a charge. Never retry a
        // provider request automatically when its outcome is unknown.
        if (controller.signal.aborted) return;
        const result = await generate(messages, controller.signal, request);
        try {
          await quota.settle(reservation, usageCost(result.usage, estimate));
        } catch {
          // Reservation is already durable. A failed settlement keeps the
          // conservative amount charged to the allowance, so it stays safe.
          console.warn(
            "AI quota settlement unavailable; reservation retained.",
          );
        }
        if (typeof result.answer !== "string" || !result.answer.trim())
          throw new Error("Invalid response");
        json(res, 200, { answer: result.answer, sources: sourceLinks(result) });
      } catch (error) {
        if (!res.destroyed)
          json(
            res,
            error instanceof ChatError ? error.status : 502,
            {
              error:
                error instanceof ChatError
                  ? error.message
                  : "The assistant is temporarily unavailable. Please try again.",
              code: error instanceof ChatError ? error.code : "unavailable",
            },
            error instanceof ChatError ? error.retryAfter : undefined,
          );
      } finally {
        if (inFlight) concurrent--;
        res.off("close", abort);
      }
      return;
    }
    if (pathname.startsWith("/api/"))
      return json(res, 404, { error: "Not found." });
    if (!["GET", "HEAD"].includes(req.method))
      return json(res, 405, { error: "Method not allowed." });
    if (pathname === "/index.html") {
      res.writeHead(308, {
        Location: "/" + new URL(req.url, "http://localhost").search,
      });
      return res.end();
    }
    try {
      const file = resolve(dist, "." + pathname);
      if (!file.startsWith(dist + sep) && file !== dist)
        return json(res, 404, { error: "Not found." });
      if (pathname.split("/").some((part) => part.startsWith(".")))
        return json(res, 404, { error: "Not found." });
      let target = file;
      let status = pathname === "/404.html" ? 404 : 200;
      const fallback = () => {
        status = pathname === "/" ? 200 : 404;
        return resolve(dist, status === 200 ? "index.html" : "404.html");
      };
      try {
        if (!(await stat(target)).isFile()) target = fallback();
      } catch {
        if (extname(pathname)) return json(res, 404, { error: "Not found." });
        target = fallback();
      }
      const data = await readFile(target);
      res.writeHead(status, {
        "Content-Type": mime[extname(target)] || "application/octet-stream",
        "Cache-Control": pathname.startsWith("/assets/")
          ? "public, max-age=31536000, immutable"
          : "no-cache",
      });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch {
      json(res, 404, {
        error: "Build the portfolio first with npm run build.",
      });
    }
  });
}
