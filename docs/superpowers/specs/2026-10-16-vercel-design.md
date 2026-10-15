# Vercel deployment design

The portfolio will use Vercel exclusively for hosting. Static, pre-rendered homepage, archive and 404 output stays in `dist`; the existing Node request handler becomes directly callable by a Vercel Function. No Render proxy or service is required. Genuine project demo links on Render remain project content.

Production defaults to `https://harshgavand.dev`; `SITE_URL` can override the build origin. Runtime secrets remain server-only. Existing OpenAI model, response schema, Upstash namespace, 200/day request allowance, $1 monthly allowance and conservative reservation/settlement behavior remain intact. No new provider key or live model call is needed for migration checks.

Use one shared Node function for `/api/*`, with Node 24 and a 60-second maximum duration. Related API routes share an instance where Vercel permits; persistent Redis admission limits continue to apply across independent instances. Preserve the local Node development/start commands through a thin HTTP-server wrapper around the same handler.

Vercel invocations must await all accounting work. Replace reliance on an idle interval with one bounded retry drain during admitted chat requests and a secret-authenticated daily Vercel Cron endpoint. The daily schedule supports Hobby plans; existing Redis job leases, backoff, idempotency and dead letters remain the authority. Failed cleanup leaves an expiring concurrency lease, never an unbounded slot leak.

Use shared Redis client/global request counters and expiring concurrency leases on Vercel. Hash client identities before storing them. Reject admission before provider work, and fail closed on storage errors. Local standalone serving retains existing per-process guards.

Keep static paths, proper 404 status, accessibility, project fragments and asset caching. Do not introduce an SPA catch-all returning HTTP 200 for missing pages. Verify source/build/HTTP only, per user instruction. Deliver to GitHub main under the existing push authorization; report hosted credential gaps separately from code correctness.
