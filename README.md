# Harsh Gavand — Full-Stack & AI Engineer

A React + TypeScript portfolio organized around engineering decisions: five homepage chapters, four immediately readable case studies, a compact eight-repository archive, and a complete searchable 38-project catalog at [/archive](https://harshgavand.dev/archive/).

[Live portfolio](https://harshgavand.dev/) · [Refactor verification](verification/recruiter-scan-2026-10-15/README.md) · [Recent AI repository sources](verification/github-projects-2026-10-15/sources.json)

## Experience and structure

The homepage has one shared chapter definition in `src/data/recruiter.ts`: Introduction, Selected Work, Experience & Impact, Architecture & Skills, and Contact. Header navigation, its hidden mobile menu, and headings derive their numbers from that definition.

The hero opens on an interactive Request Lifecycle Trace, with a verbatim excerpt from the executed quota lifecycle in its Implementation tab. The four case study cards expose concise product context, bold architectural decisions, technologies, and system impact immediately. Each case study opens on its visual Product Preview. Its System Architecture tab provides five keyboard-operable stages with a live contract and technical-detail callout. There are no nested disclosures.

The eight-row curated archive uses a native disclosure. The complete catalog lives on a separate pre-rendered route with search and All / Latest AI / AI & ML / APIs & Tools / Web & SaaS filters. Every project retains its identity and repository link; original copy was rewritten and inaccurate stack claims were corrected against source code. No invented performance metrics, production scale, payment guarantees, or database guarantees are added.

Experience, education, the supplied portrait, recognition, skills, engineering principles, contact draft preparation, and the existing assistant remain available. The assistant opens from the header, floating button, or Ctrl/Command+K, with three recruiter prompts. The chat response contract remains unchanged; quota cancellation and settlement recovery are described below.

The attached résumé is exported to `public/resume.pdf`, linked from the desktop header, mobile menu, hero, contact section, and assistant sources. The original Word document remains outside the repository. The two-page PDF preserves its text, formatting, and hyperlinks and was visually checked before publication. Contact also provides a Copy Email control with visible and live-region feedback.

Render-hosted project demos receive best-effort background GET requests after browser idle, with a 500ms fallback. Origins come only from HTTPS Render demo URLs in the catalog and are deduplicated. Requests omit credentials and referrers, failures stay isolated, and cleanup cancels pending work. Visitors using Save-Data are excluded. Warm-up improves the chance a demo is ready but cannot guarantee service availability or remove every cold start; no third-party requests run during server rendering.

## Development

Use Node.js **24.x LTS**, pinned in `package.json` and `.nvmrc`. This supports the server's shared TypeScript data and keeps deployments on one major version while receiving patch updates. Install with `npm ci`, then run `npm run dev`. This starts the API at `127.0.0.1:3001` and Vite at `127.0.0.1:5173`; both ports must be available. Vite proxies `/api`. The UI and API can also run separately through `npm run dev:ui` and `npm run dev:api`.

## OpenAI assistant

The assistant uses **`gpt-6-luna`** through the OpenAI Responses API. Requests use standard processing, `reasoning.effort=none`, a 1,000-token output cap, strict structured output, and `store=false`. There are no paid retrieval tools or embedding API calls; relevant project content is retrieved locally from the existing portfolio data.

Configure `OPENAI_API_KEY` and `OPENAI_MODEL=gpt-6-luna` in the service environment. Local development reads the existing `D:\PortFolio-Harsh\.env`, after any repository `.env.local` or `.env`; process variables take precedence. Restart the API after environment changes. Never prefix the key with `VITE_` or put it in browser code. Production deliberately does not load the parent-directory env file.

The browser sends bounded conversation history to same-origin `/api/chat`. The server supplies published profile, About, experience, skills, all 38 project index entries, and the five most relevant project details, including existing case-study architecture and contribution notes. OpenAI returns text and references; the server maps references to existing portfolio links. Chat is held in page memory only. This service does not store conversation text. Redis stores only aggregate allowance counters and anonymous reservation records. Messages and portfolio context are sent to OpenAI; `store=false` disables stored Responses, while provider retention follows the account's applicable data controls.

Controls include suggestions, follow-up questions, a 2,000-character input limit, loading, stop, retry, clear, project/contact references, and keyboard dismissal. Provider quota, invalid configuration, timeout, and incomplete output become clear user-facing errors. On Vercel, atomic Redis admission enforces ten requests per hashed client and sixty globally per ten-minute window, with at most three active generation leases across all function instances. Leases expire after two minutes if an invocation cannot clean up. Standalone local serving retains its per-process guards. The additional global daily and monthly allowances below remain persistent and shared across instances.

## Persistent credit protection

The entire assistant shares a **200-request daily allowance** and a **$1.00 monthly conservative cost allowance**, persisted in Upstash Redis. Daily and calendar-month windows reset at midnight UTC (05:30 India time). Both limits survive service restarts, sleep and redeploys, and apply across server instances sharing the same Redis database.

Configure these variables in your existing local `.env` and in Vercel's Production environment:

- `UPSTASH_REDIS_REST_URL`: the HTTPS Redis REST endpoint.
- `UPSTASH_REDIS_REST_TOKEN`: the standard REST token, with EVAL/write access. The read-only token cannot enforce quotas. Keep it server-only.
- `AI_DAILY_REQUEST_LIMIT=200`
- `AI_MONTHLY_BUDGET_USD=1.00`

Redis admission uses one atomic Lua script to check both allowances, count the request, and reserve its maximum estimated cost **before OpenAI is invoked**. Concurrent calls cannot oversubscribe the remaining allowance. A successful response reconciles its reservation with provider-reported token usage, once only. Cancellation before provider dispatch releases the monthly cost reservation through idempotent settlement at zero; the admitted daily request remains counted. Once a provider may have consumed usage, uncertain failures retain the conservative reservation. A failed settlement with known usage is stored in a durable Redis retry queue; the generated answer is returned only after reconciliation or retry persistence succeeds. If Redis cannot persist the retry, the request reports an accounting availability error and keeps the reservation. Rejected admissions never call OpenAI. There is no automatic provider retry.

Vercel drains one queued settlement during each admitted chat request and up to three jobs in a secret-authenticated daily cron invocation. Every invocation awaits its accounting work; no idle process or background timer is required. The daily schedule is compatible with Vercel Hobby. Standalone local serving also drains at startup and every 30 seconds. All workers use atomic job leases and idempotent settlement across instances. Failed jobs use bounded backoff and move to a dead-letter set after five failed attempts; conservative reservations remain held for operator review. Only anonymous reservation keys and accounting values enter these queues. `node scripts/quota-status.mjs` includes queued/dead-letter counts. `node scripts/quota-recovery-live.mjs` verifies recovery using an isolated temporary namespace, cleans up its test keys, and makes no model call.

The cost ledger uses integer micro-dollars and a 2x margin over GPT-6 Luna Standard prices checked on 13 October 2026 ($0.10/M input and $0.50/M output). Its preflight upper bound counts the full serialized request's UTF-8 bytes, including trusted portfolio context/history/schema, plus 4,096 tokens of framing allowance and the 1,000-output-token cap. Requests over 100,000 serialized bytes or with unsupported model/tier/reasoning/tools settings are rejected. Cache discounts are ignored for conservative accounting. This is an application allowance, not an OpenAI billing balance or account-wide cap: it covers this service's calls after activation, excludes taxes and unrelated API use, and requires reviewing pricing if the model's rates change.

Missing credentials, Redis errors, malformed stored values, and read-only tokens **pause generation**. The portfolio remains accessible. Exhausted allowances return HTTP 429 and a reset interval; storage failures return HTTP 503. Chat hides immediate retry for daily/monthly exhaustion and keeps the contact link available. Never delete the quota database or its current keys to reset usage. The short-window IP limiter does not provide identity authentication; persistent global allowances protect the spending even when callers use multiple IPs.

`node scripts/quota-status.mjs` prints aggregate usage and remaining allowances without exposing credentials or chat. `node scripts/quota-live.mjs` runs explicit live Redis verification using isolated expiring test keys and **no OpenAI calls**. `node scripts/quota-http-live.mjs` also verifies rejection after a real Node process restart with a fake generator. Test keys cannot change the production ledger. Vercel function memory and filesystem are not durable shared storage, so the allowance remains in Redis. See [verification](verification/quota-2026-10-13/README.md).

## Validation

```sh
npm run lint
npm run type-check
npm test
npm run build
npm run test:prerender
```

The build automatically runs a browser-free React pre-render step for the homepage, archive, and 404 page. Client code hydrates the same component tree and build year. No API call, credential, running server, or headless browser is needed during the build. HTML is readable before JavaScript runs, including all 38 archive entries and their complete notes.

The tests cover original project identities and assets, source metadata, assistant validation and failure contracts, quota admission, pre-dispatch rollback, durable retries, dead letters, crawler user agents, archive routing, every referenced HTML/CSS asset, JavaScript chunk syntax, unique IDs and anchors, chapter numbering, tab relationships and keyboard movement, copy/link cleanup, image attributes, and disclosure nesting. Local HTTP tests require loopback networking. Browser layout and device interaction review is a separate manual check; this refactor was verified at the code and HTTP levels at the user's request.

## Content and presentation

- `src/data/projects.json` and `src/data/recentProjects.json`: 38 project records, including 12 recent AI repositories.
- `src/data/portfolio.ts`: shared profile, experience, skills, and four source-reviewed case studies.
- `src/data/recruiter.ts`: chapter numbers, curated archive, architecture widget, code excerpt, prompts, and principles.
- `src/recruiter.css`: graphite, ivory, and citrus tokens; high-contrast text; responsive layouts; focus states; 180ms transitions and reduced-motion support.
- `src/components/RequestTrace.tsx` and `src/lib/requestTrace.ts`: a completed happy path, pre-dispatch rollback, and uncertain upstream timeout scenarios. Token values and timings are illustrative; the accounting decisions match the live lifecycle without making network requests or changing balances.
- `server/quota-lifecycle.mjs`: shared executed lifecycle for release-before-dispatch and settlement recovery.
- `server/vercel.mjs` and `api/index.mjs`: directly awaited Vercel API handler and authenticated recovery endpoint.
- `server/admission.mjs`: atomic shared request counters and expiring concurrency leases for serverless instances.
- `src/components/Tabs.tsx`: shared ARIA tablist with arrow-key, Home/End, and roving-tabindex behavior.
- `src/components/SystemFlow.tsx`: native architecture-stage buttons with pointer, click, and keyboard-focus activation and a linked live callout.
- `src/components/DemoWarmup.tsx` and `src/lib/demoWarmup.ts`: cancellable idle scheduling and credential-free Render demo requests.
- `src/components/ProjectArchive.tsx`: searchable full catalog; initial HTML includes every record.
- `src/entry-server.tsx` and `scripts/prerender.mjs`: build-time rendering and route metadata.
- `public/projects`: responsive banking/repository landing-page captures and a UGC gallery asset composed into a labelled studio interface study. Its displayed 5-credit image and 10-credit video generation costs come from the source; it is not a captured live account balance. The digest preview describes its email format rather than claiming a live inbox capture.
- `verification/recruiter-2026-10-15/sources.json`: reviewed flagship commit IDs, paths, and corrections.

Fonts are self-hosted Latin subsets. Images reserve dimensions and load lazily below the fold. The retired Three.js and Framer Motion implementations and dependencies were removed. There is no scroll interception or delayed text reveal. Native scrolling, system reduced motion, and the manual motion control remain supported.

The contact form prepares a `mailto:` draft for the visitor to review and send in their email app. Copy-email and direct email links remain available. GitHub and LinkedIn icon links are in the header corner; the footer aligns identity, copyright, and back-to-top with space for the assistant.

## Hosting

The portfolio runs entirely on **Vercel** at **https://harshgavand.dev**. Vercel serves the pre-rendered `dist` output through its CDN and routes `/api/*` to the shared Node 24 function in `api/index.mjs`. There is no external backend proxy or Render dependency. The function has a 60-second maximum duration and cancellation support; its entire invocation is registered with Vercel's `waitUntil` before work begins so accounting and cleanup can finish after a disconnect or response completion. Application provider calls still have their existing 25-second timeout. Related API paths share the same function, and Redis enforces allowances across every instance.

Import this repository into Vercel, deploy branch `main`, and attach `harshgavand.dev`. The repository's `vercel.json` sets the Vite framework, install/build commands, `dist` output, API routing, function settings, static/security headers and daily recovery cron. Do not replace these with a catch-all SPA rewrite or a long-running start command. The build automatically pre-renders the homepage, archive and 404 page. Vercel serves the custom 404 with HTTP 404; `/index.html` redirects to `/`.

Set the following under **Project Settings → Environment Variables → Production**, then redeploy:

| Variable | Value |
| --- | --- |
| `SITE_URL` | `https://harshgavand.dev` (also the built-in default) |
| `ALLOWED_ORIGINS` | `https://harshgavand.dev` (also the production default); comma-separate only real aliases |
| `OPENAI_API_KEY` | Existing OpenAI project key; keep secret |
| `OPENAI_MODEL` | `gpt-6-luna` |
| `UPSTASH_REDIS_REST_URL` | Existing HTTPS Upstash REST endpoint |
| `UPSTASH_REDIS_REST_TOKEN` | Existing writable REST token with EVAL access; keep secret |
| `AI_DAILY_REQUEST_LIMIT` | `200` |
| `AI_MONTHLY_BUDGET_USD` | `1.00` |
| `CRON_SECRET` | Random secret of at least 32 characters |

Use the existing quota database: the namespace remains `portfolio-ai:v1`, so moving hosts does not reset spending or lose queued settlements. Never put secrets in `VITE_*` variables. Vercel supplies its runtime environment; no manual `PORT`, `TRUST_PROXY`, `VERCEL` or start command is required. Node 24 is already pinned. `.env.example` contains placeholders only.

Vercel calls `/api/quota-reconcile` daily at 04:15 UTC (09:45 India time), automatically passing `CRON_SECRET` as a bearer token. Missing or incorrect authorization returns 401 without Redis or provider work. Cron runs only on production deployments. The assistant also reconciles during admitted requests, so recovery progresses between daily invocations. Dead letters still require operator review. `/api/health` reports model, allowance limits and configuration presence; presence alone does not prove Redis connectivity or a successful model request.

Metadata defaults to `https://harshgavand.dev`. Optional build-time `SITE_URL` overrides canonical, Open Graph, Twitter, JSON-LD, robots and sitemap output consistently; only an HTTPS origin is accepted. Development uses `createRoot`; generated pages use `hydrateRoot`, including a shared build year. Old verification reports remain historical records and are not rewritten to imply they tested the current host.

For a local built preview, run `npm run build` then `npm start`, and use `http://127.0.0.1:3001`. Add that origin to `ALLOWED_ORIGINS`. The integrated `npm run dev` setup uses the development origins from your `.env`.

No deployment is performed by local development or validation commands.

Earlier verification directories document earlier designs and are retained as historical evidence.

## Web Analytics

Vercel Web Analytics uses `@vercel/analytics/react`, mounted once in the shared `Portfolio` component. React Router's pathname supplies page views for the homepage, archive and other routes; hash-only chapter navigation does not send another page view. Development uses the SDK's debug mode, and production uses its hosted collection script. The component renders no HTML, preserving pre-rendering and hydration.

Enable Web Analytics in the Vercel project's Analytics panel, then deploy. No additional application environment variable or tracking ID is required. Visit the production site normally to generate real traffic and view visitors/page views in the Vercel dashboard. The integration adds page-view tracking only; contact fields and AI conversations are not sent as custom analytics events.

## Speed Insights

Vercel Speed Insights uses `@vercel/speed-insights/react`, mounted once beside Web Analytics in the shared `Portfolio` component. React Router's pathname identifies the route for performance measurements on the homepage, archive and other routes. The component renders no HTML, preserving pre-rendering and hydration.

Enable Speed Insights in the Vercel project's Speed Insights panel, then deploy the updated application. Visit the deployed site and navigate between pages to collect real performance measurements, then view them in the Vercel dashboard. No additional application environment variable or tracking ID is required. Local build checks do not verify hosted data collection.

## Dependency and deployment tooling

The linter uses ESLint 10 flat configuration in `eslint.config.js`, with compatible TypeScript, React, hooks, and Fast Refresh checks. The lockfile excludes the retired ESLint 8 dependency chain.

Vercel uses the repository's `vercel.json` install/build commands. `node scripts/run-npm.mjs` invokes npm with supported environment settings: legacy `cache-dir` is translated to npm's `cache` setting when no explicit cache is configured, and pnpm-only `store-dir` is omitted. This changes only the npm subprocess; it does not modify your system or deployment environment variables. Warnings are not suppressed. For the same behavior locally, use `node scripts/run-npm.mjs ci --include=dev` and `node scripts/run-npm.mjs run build`.
