import { createServer as httpServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import {
  ChatError,
  validateMessages,
  generateReply,
  sourceLinks,
  buildRequest,
  generateStructured,
} from "./openai.mjs";

import { RedisQuota } from "./quota.mjs";
import { generateWithQuota } from "./quota-lifecycle.mjs";
import { validateVoice, generateVoice, transcribe, speak } from "./voice.mjs";
import { buildTask, normalizeTask, taskExecution } from "./ai-tools.mjs";
import { reservationFor, usageCost } from "./quota.mjs";

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
  ".mp3": "audio/mpeg",
};

export function createApplication(config) {
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
  const handler = async (req, res) => {
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
        voiceGuideConfigured: Boolean(apiKey && quota.configured),
        model,
        runtime: config.vercel ? "vercel" : "node",
        scheduledRecoveryConfigured: Boolean(config.cronSecret),
        usageProtection: {
          configured: quota.configured,
          dailyLimit: quota.dailyLimit,
          monthlyBudgetUsd: quota.monthlyBudgetMicros / 1000000,
          resetTimezone: "UTC",
        },
      });
    if (
      [
        "/api/chat",
        "/api/voice/chat",
        "/api/ai/recruiter",
        "/api/ai/triage",
      ].includes(pathname)
    ) {
      const voice = pathname === "/api/voice/chat";
      const taskKind = pathname.startsWith("/api/ai/")
        ? pathname.split("/").at(-1)
        : null;
      const started = performance.now();
      const requestId = randomUUID();
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
      let admissionLease;
      const controller = new AbortController();
      // Leave Vercel time to settle accounting and release the shared lease.
      const requestSignal = voice
        ? AbortSignal.any([controller.signal, AbortSignal.timeout(45000)])
        : controller.signal;
      const abort = () => {
        if (!res.writableEnded) controller.abort();
      };
      res.on("close", abort);
      req.on("aborted", abort);
      req.on("error", abort);
      try {
        const chunks = [];
        let bytes = 0;
        for await (const chunk of req) {
          bytes += chunk.length;
          if (bytes > (voice ? 900000 : taskKind ? 28000 : 16384))
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
        const voiceInput = voice ? validateVoice(body) : null;
        const task = taskKind ? buildTask(taskKind, body, model) : null;
        const messages = voice || task ? null : validateMessages(body);
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
        if (config.admission) {
          admissionLease = await config.admission.acquire(ip);
        } else {
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
        }
        await config.beforeGenerate?.();
        if (task) {
          const result = await generateWithQuota({
            request: task.request,
            quota,
            signal: controller.signal,
            generate: async (request, { signal }) => {
              const output = await (
                config.generateTask ||
                ((request, options) =>
                  generateStructured(request, { apiKey, ...options }))
              )(request, { signal });
              return {
                normalized: normalizeTask(task, output),
                usage: output.usage,
              };
            },
          });
          controller.signal.throwIfAborted();
          const execution = taskExecution(
            requestId,
            started,
            result,
            usageCost(result.usage, reservationFor(task.request)),
          );
          if (config.production)
            console.info(
              JSON.stringify({
                event: "portfolio_ai_complete",
                task: taskKind,
                ...execution,
              }),
            );
          json(res, 200, { ...result.normalized, execution });
          return;
        }
        if (voice) {
          const result = await generateVoice({
            ...voiceInput,
            quota,
            model,
            signal: requestSignal,
            generate,
            transcribeAudio:
              config.voiceTranscribe ||
              ((audio, { signal }) => transcribe(audio, { apiKey, signal })),
            speakAudio:
              config.voiceSpeak ||
              ((text, { signal }) => speak(text, { apiKey, signal })),
          });
          json(res, 200, result);
          return;
        }
        const request = buildRequest(messages, model);
        const result = await generateWithQuota({
          request,
          quota,
          signal: controller.signal,
          generate: (reservedRequest, { signal }) =>
            generate(messages, signal, reservedRequest),
        });
        if (typeof result.answer !== "string" || !result.answer.trim())
          throw new Error("Invalid response");
        const execution = taskExecution(
          requestId,
          started,
          result,
          usageCost(result.usage, reservationFor(request)),
        );
        if (config.production)
          console.info(
            JSON.stringify({
              event: "portfolio_ai_complete",
              task: "guide",
              ...execution,
            }),
          );
        json(res, 200, {
          answer: result.answer,
          sources: sourceLinks(result),
          evidence: result.evidence || [],
          execution,
        });
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
        if (admissionLease) {
          try {
            await config.admission.release(admissionLease);
          } catch {
            // The shared lease expires even if this cleanup cannot reach Redis.
            console.error(
              JSON.stringify({ event: "admission_release_unavailable" }),
            );
          }
        }
        res.off("close", abort);
        req.off("aborted", abort);
        req.off("error", abort);
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
    if (["/work/lendflow", "/work/lendflow/"].includes(pathname)) {
      res.writeHead(308, { Location: "/work/banking-saas/" });
      return res.end();
    }
    try {
      const file = resolve(dist, "." + pathname);
      if (!file.startsWith(dist + sep) && file !== dist)
        return json(res, 404, { error: "Not found." });
      if (pathname.split("/").some((part) => part.startsWith(".")))
        return json(res, 404, { error: "Not found." });
      let target = ["/ai", "/ai/"].includes(pathname)
        ? resolve(dist, "ai/index.html")
        : ["/archive", "/archive/"].includes(pathname)
          ? resolve(dist, "archive/index.html")
          : /^\/work\/[a-z0-9-]+\/?$/.test(pathname)
            ? resolve(dist, "." + pathname, "index.html")
            : file;
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
  };
  let reconciling = false;
  const reconcile = async (options) => {
    if (reconciling || !quota.configured || !quota.retrySettlements) return;
    reconciling = true;
    try {
      const report = await quota.retrySettlements(options);
      if (report.deadLettered || report.failed)
        console.error(
          JSON.stringify({ event: "quota_settlement_retry", ...report }),
        );
      return report;
    } catch {
      console.error(
        JSON.stringify({ event: "quota_settlement_retry_unavailable" }),
      );
    } finally {
      reconciling = false;
    }
  };
  return { handler, reconcile };
}

export function createServer(config) {
  const { handler, reconcile } = createApplication(config);
  const server = httpServer(handler);
  let timer;
  server.once("listening", () => {
    void reconcile();
    timer = setInterval(() => void reconcile(), 30000);
    timer.unref();
  });
  server.once("close", () => clearInterval(timer));
  return server;
}
