# Harsh Gavand — Full-Stack & AI Engineer

A React + TypeScript portfolio organized around engineering decisions: five homepage chapters, four immediately readable case studies, a compact eight-repository archive, and a complete searchable 38-project catalog at [/archive](https://harsh-gavand-portfolio-website-ai.onrender.com/archive/).

[Live portfolio](https://harsh-gavand-portfolio-website-ai.onrender.com/) · [Refactor verification](verification/recruiter-scan-2026-10-15/README.md) · [Recent AI repository sources](verification/github-projects-2026-10-15/sources.json)

## Experience and structure

The homepage has one shared chapter definition in `src/data/recruiter.ts`: Introduction, Selected Work, Experience & Impact, Architecture & Skills, and Contact & Résumé. Header navigation, its hidden mobile menu, and headings derive their numbers from that definition.

The hero replaces the abstract WebGL sculpture with a technical widget: an interactive architecture pipeline, a verbatim excerpt from the executed quota lifecycle, and a deterministic Request Trace simulator. The four case study cards expose product context, engineering decisions, technologies, challenges, and outcomes immediately. Each case study opens on its visual Product Preview, with System Architecture as the only other tab. There are no nested disclosures.

The eight-row curated archive uses a native disclosure. The complete catalog lives on a separate pre-rendered route with search and All / Latest AI / AI & ML / APIs & Tools / Web & SaaS filters. Every project retains its identity and repository link; original copy was rewritten and inaccurate stack claims were corrected against source code. No invented performance metrics, production scale, payment guarantees, or database guarantees are added.

Experience, education, the supplied portrait, recognition, skills, engineering principles, résumé, contact draft preparation, and the existing assistant remain available. The assistant opens from the header, floating button, or Ctrl/Command+K, with three recruiter prompts. The chat response contract remains unchanged; quota cancellation and settlement recovery are described below.

## Development

Use Node.js **22.18 or newer**, required for the server's shared TypeScript data. Install with `npm ci`, then run `npm run dev`. This starts the API at `127.0.0.1:3001` and Vite at `127.0.0.1:5173`; both ports must be available. Vite proxies `/api`. The UI and API can also run separately through `npm run dev:ui` and `npm run dev:api`.

## OpenAI assistant

The assistant uses **`gpt-6-luna`** through the OpenAI Responses API. Requests use standard processing, `reasoning.effort=none`, a 1,000-token output cap, strict structured output, and `store=false`. There are no paid retrieval tools or embedding API calls; relevant project content is retrieved locally from the existing portfolio data.

Configure `OPENAI_API_KEY` and `OPENAI_MODEL=gpt-6-luna` in the service environment. Local development reads the existing `D:\PortFolio-Harsh\.env`, after any repository `.env.local` or `.env`; process variables take precedence. Restart the API after environment changes. Never prefix the key with `VITE_` or put it in browser code. Production deliberately does not load the parent-directory env file.

The browser sends bounded conversation history to same-origin `/api/chat`. The server supplies published profile, About, experience, skills, all 38 project index entries, and the five most relevant project details, including existing case-study architecture and contribution notes. OpenAI returns text and references; the server maps references to existing portfolio links. Chat is held in page memory only. This service does not store conversation text. Redis stores only aggregate allowance counters and anonymous reservation records. Messages and portfolio context are sent to OpenAI; `store=false` disables stored Responses, while provider retention follows the account's applicable data controls.

Controls include suggestions, follow-up questions, a 2,000-character input limit, loading, stop, retry, clear, résumé/contact references, and keyboard dismissal. Provider quota, invalid configuration, timeout, and incomplete output become clear user-facing errors. Default server limits are ten requests per client and sixty globally per ten minutes, with at most three simultaneous generations. These short-window limits remain in memory. The additional global daily and monthly allowances below are persistent and shared across server instances.

## Persistent credit protection

The entire assistant shares a **200-request daily allowance** and a **$1.00 monthly conservative cost allowance**, persisted in Upstash Redis. Daily and calendar-month windows reset at midnight UTC (05:30 India time). Both limits survive service restarts, sleep and redeploys, and apply across server instances sharing the same Redis database.

Configure these variables in your existing local `.env` and in Render's service environment:

- `UPSTASH_REDIS_REST_URL`: the HTTPS Redis REST endpoint.
- `UPSTASH_REDIS_REST_TOKEN`: the standard REST token, with EVAL/write access. The read-only token cannot enforce quotas. Keep it server-only.
- `AI_DAILY_REQUEST_LIMIT=200`
- `AI_MONTHLY_BUDGET_USD=1.00`

Redis admission uses one atomic Lua script to check both allowances, count the request, and reserve its maximum estimated cost **before OpenAI is invoked**. Concurrent calls cannot oversubscribe the remaining allowance. A successful response reconciles its reservation with provider-reported token usage, once only. Cancellation before provider dispatch releases the monthly cost reservation through idempotent settlement at zero; the admitted daily request remains counted. Once a provider may have consumed usage, uncertain failures retain the conservative reservation. A failed settlement with known usage is stored in a durable Redis retry queue; the generated answer is returned only after reconciliation or retry persistence succeeds. If Redis cannot persist the retry, the request reports an accounting availability error and keeps the reservation. Rejected admissions never call OpenAI. There is no automatic provider retry.

The Node server drains settlement retries at startup and every 30 seconds, with atomic job leases and idempotent settlement across instances. Failed jobs use bounded backoff and move to a dead-letter set after five failed attempts; conservative reservations remain held for operator review. Only anonymous reservation keys and accounting values enter these queues. `node scripts/quota-status.mjs` includes queued/dead-letter counts. `node scripts/quota-recovery-live.mjs` verifies recovery using an isolated temporary namespace, cleans up its test keys, and makes no model call.

The cost ledger uses integer micro-dollars and a 2x margin over GPT-6 Luna Standard prices checked on 13 October 2026 ($0.10/M input and $0.50/M output). Its preflight upper bound counts the full serialized request's UTF-8 bytes, including trusted portfolio context/history/schema, plus 4,096 tokens of framing allowance and the 1,000-output-token cap. Requests over 100,000 serialized bytes or with unsupported model/tier/reasoning/tools settings are rejected. Cache discounts are ignored for conservative accounting. This is an application allowance, not an OpenAI billing balance or account-wide cap: it covers this service's calls after activation, excludes taxes and unrelated API use, and requires reviewing pricing if the model's rates change.

Missing credentials, Redis errors, malformed stored values, and read-only tokens **pause generation**. The portfolio remains accessible. Exhausted allowances return HTTP 429 and a reset interval; storage failures return HTTP 503. Chat hides immediate retry for daily/monthly exhaustion and keeps the contact link available. Never delete the quota database or its current keys to reset usage. The short-window IP limiter does not provide identity authentication; persistent global allowances protect the spending even when callers use multiple IPs.

`node scripts/quota-status.mjs` prints aggregate usage and remaining allowances without exposing credentials or chat. `node scripts/quota-live.mjs` runs explicit live Redis verification using isolated expiring test keys and **no OpenAI calls**. `node scripts/quota-http-live.mjs` also verifies rejection after a real Node process restart with a fake generator. Test keys cannot change the production ledger. The free Render filesystem cannot retain local counters, which is why this uses external Redis instead of a local file. See [verification](verification/quota-2026-10-13/README.md).

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
- `src/components/RequestTrace.tsx` and `src/lib/requestTrace.ts`: illustrative Gemini success/timeout scenarios with no network requests or real balance changes. The live assistant uses OpenAI and conservative cost accounting.
- `server/quota-lifecycle.mjs`: shared executed lifecycle for release-before-dispatch and settlement recovery.
- `src/components/Tabs.tsx`: shared ARIA tablist with arrow-key, Home/End, and roving-tabindex behavior.
- `src/components/ProjectArchive.tsx`: searchable full catalog; initial HTML includes every record.
- `src/entry-server.tsx` and `scripts/prerender.mjs`: build-time rendering and route metadata.
- `public/Harsh_Gavand_Resume.pdf`: unchanged supplied résumé at a stable URL.
- `public/projects`: responsive banking/repository landing-page captures and a UGC gallery image from the project's asset directory. The digest preview describes its email format rather than claiming a live inbox capture.
- `verification/recruiter-2026-10-15/sources.json`: reviewed flagship commit IDs, paths, and corrections.

Fonts are self-hosted Latin subsets. Images reserve dimensions and load lazily below the fold. The retired Three.js and Framer Motion implementations and dependencies were removed. There is no scroll interception or delayed text reveal. Native scrolling, system reduced motion, and the manual motion control remain supported.

The contact form prepares a `mailto:` draft for the visitor to review and send in their email app. Copy-email and direct email links remain available. GitHub and LinkedIn icon links are in the header corner; the footer aligns identity, copyright, and back-to-top with space for the assistant.

## Hosting

For the complete portfolio **including the assistant**, use a Node web service:

- Build command: `npm ci --include=dev && npm run build`
- Start command: `npm start`
- Environment: `NODE_ENV=production`, `OPENAI_API_KEY` (secret), `OPENAI_MODEL=gpt-6-luna`, and `ALLOWED_ORIGINS` set to the exact public origin (no trailing slash). Include comma-separated aliases only if they actually serve this site.
- Add the four Redis/allowance variables described above. The assistant will pause if Redis is not configured or writable.
- Let the host provide `PORT`. For a Render service behind its single trusted reverse proxy, set `TRUST_PROXY=1`; leave it `0` when directly exposing Node.
- Health endpoint: `/api/health`. It reports model, allowance limits, and configuration presence. Presence alone does not verify Redis connectivity or OpenAI generation quota; a successful chat request verifies the full path.

The Node service serves pre-rendered `dist/index.html`, the full `dist/archive/index.html` catalog at `/archive` and `/archive/`, assets, résumé, and API routes. Unknown pages receive a pre-rendered 404 with HTTP 404 and `noindex`; `/index.html` redirects to `/`. A static-only host can serve the generated page but cannot run `/api/chat`. The existing Render Node service uses `npm ci --include=dev && npm run build`, starts with `npm run start`, and auto-deploys `main` on commit. Its build lifecycle already invokes pre-rendering; no Render setting change is required.

Metadata defaults to the current public hostname. An optional build-time `SITE_URL` overrides the canonical origin, otherwise Render's `RENDER_EXTERNAL_URL` is used when present. Pre-rendering applies the origin consistently to canonical, Open Graph, Twitter, JSON-LD, robots, and sitemap output. Only an HTTPS origin is accepted. For a custom domain, set `SITE_URL` to that origin before building. Development continues to use `createRoot`; generated production pages use `hydrateRoot`, including a shared build year to prevent footer mismatches across a year boundary.

For a local built preview, run `npm run build` then `npm start`, and use `http://127.0.0.1:3001`. Add that origin to `ALLOWED_ORIGINS`. The integrated `npm run dev` setup uses the development origins from your `.env`.

No deployment is performed by local development or validation commands.

Earlier verification directories document earlier designs and are retained as historical evidence.
