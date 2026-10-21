# Harsh Gavand — Full-Stack & AI Engineer

A React + TypeScript portfolio organized around engineering decisions: six homepage sections, five primary public project cards, eleven more deployed projects in a native disclosure, dedicated private internal-work evidence, and a searchable 40-repository catalog at [/archive](https://harshgavand.dev/archive/). Agri Samaj remains a separate community project outside the archive.

[Live portfolio](https://harshgavand.dev/) · [Refactor verification](verification/recruiter-scan-2026-10-15/README.md) · [Recent AI repository sources](verification/github-projects-2026-10-15/sources.json)

## Recruiter review path

The homepage connects Harsh's professional profile to application screenshots, technical contributions, and selected engineering work. Project cards and case studies explain features, architecture, challenges solved, technology choices, and supported outcomes. Skills provides the AI workspace link and the condensed technology list under **View full stack**. Contact offers direct email, Copy Email, résumé, GitHub, and LinkedIn actions. Assistant access is available from the corner launcher, navigation, and Ctrl/Command+K.

Seventeen static case studies show product features, contributions, engineering work, architecture, complete technology stacks, and live/GitHub links. The selected projects include AgriConnect, UGC, deployed AI and RAG applications, Healthcare Explorer, and the Streamlit customer-support workflow. The catalog preserves active project identities and legacy fragments. Stock Prediction Portal and AI Brief use the same homepage cards, expandable project notes, architecture stages, complete stacks, and focused case studies as the other deployed applications. Their live/source links and screenshot provenance are recorded in `public/verification/project-additions-2026-10-21.json`.

AgriConnect's featured card and case study include a keyboard-accessible gallery of admin dashboard, TOTP security status, catalogue moderation, AI assistance, and marketplace/map screenshots. The first view highlights platform operations; each screenshot opens at full size. Capture provenance and validation are recorded in [the gallery verification notes](verification/agriconnect-gallery-2026-10-21/README.md).

RAG Book Assistant and Next Word Prediction use the same featured-card renderer, real deployed screenshots, expandable project notes, technology tags, live links, GitHub links, and case studies. Their Streamlit deployments and screenshot provenance are recorded in `public/verification/streamlit-projects-2026-10-21.json`. The RAG app uses OpenAI document retrieval with page sources; the next-word app runs its trained LSTM directly on the server.

Project cards, case studies, the catalog, and gallery captions focus on implemented features, engineering contributions, and supported outcomes. Access banners and review-style disclaimers are omitted from project presentation. Dated verification reports retain the original checks and source boundaries. The redundant “Also built” strip is removed; existing project URLs and the catalog route remain available.

Explicit local AI evaluations use a separate Redis quota namespace per run, with a request cap tied to the fixed test dataset and at most a $0.10 accounting allowance. They retain reservation and settlement checks without consuming visitors' production allowance. Transient transport and 502/503/504 failures may retry once and are recorded in the report; incorrect answers are not retried. Remote production smoke checks continue to use the site's normal limits. Banking-answer grading checks actual validation rules and separate confirmation, without requiring a generic project label.

UGC, LendFlow, and DevGraph screenshots show their generation, lending, and repository workspaces. AI Brief shows the deployed RSS reader and personalized digest workflow. Recorded banking scenarios retain the original tool results and ledger values, with presentation copy explaining confirmation and validation. Capture provenance and reproduction details remain available in [evidence reproduction](docs/evidence/README.md); dated verification reports distinguish recorded checks from external integrations.

The linked UGC public route uses `/demo`. Render-hosted LendFlow and DevGraph also accept `/?demo=1` so direct links work without depending on a dashboard-level SPA rewrite. Their authenticated application routes stay separate from the public fixtures. GlobeTrek’s confirmed full-time work includes quotation building, invoice generation, and automated email tools. The unsupported HRP page-load percentage was removed; no measurement baseline was invented. Linked application backends, authentication secrets, hosting configuration, and the community roadmap remain outside this release at the owner’s request.

## Experience and structure

The homepage has one shared chapter definition in `src/data/recruiter.ts`: Intro, Experience & Impact, Selected Work, Architecture & Skills, About & Recognition, and Contact. Header, mobile, and no-JavaScript navigation follow this order. The redundant footer navigation and Engineering Field Notes presentation are removed at the owner's request. Navigation, section headings, and project/skills cards use plain labels without decorative numbering.

The hero introduces the developer and links to selected work. Shared project cards provide real application captures, engineering focus, live/source links, and expandable features, contributions, outcomes, and the complete stack. Case studies include keyboard-operable architecture stages. Project descriptions focus on architecture, implementation ownership, technical challenges, and supported outcomes.

Agri Samaj and UGC lead the five primary public cards. Eleven additional deployed cards retain complete screenshots, notes, links, and native no-JavaScript access in an expandable group. Eight curated archive rows are distinct from all sixteen public cards; DevGraph replaces the duplicate Banking Agent Harness row. Previously shared project fragments reveal their enclosing disclosures after hydration. The complete catalog has search and All / Latest AI / AI & ML / APIs & Tools / Web & SaaS filters. No invented performance, scale, financial, or clinical outcomes are added.

Experience uses one shared record per employer: five Globetrek bullets with fourteen core tools and four HRP bullets with ten core tools. Missing GIS measurement details and the employment arrangement during university remain developer-only TODO comments. Education, the supplied portrait, and recognition have their own section; each hackathon appears once. The assistant opens from the corner launcher, header or mobile navigation, or Ctrl/Command+K. It offers six starter questions and nine additional questions grouped by project walkthroughs, AI/backend decisions, and engineering approach. After an answer, the complete question bank remains available through “Ask another question.” The chat response contract remains unchanged; quota cancellation and settlement recovery are described below.

The attached résumé is exported to `public/resume.pdf`, linked from the desktop header, mobile menu, hero, contact section, and assistant sources. The original Word document remains outside the repository. The two-page PDF preserves its text, formatting, and hyperlinks and was visually checked before publication. Contact also provides a Copy Email control with visible and live-region feedback.

Availability is remote-only worldwide. The hero lists Mumbai (UTC+5:30) and EU/UK/APAC/US overlap; About emphasizes async-first international collaboration; Contact includes full-time, contract, and EOR roles with flexible working hours. These presentation labels are maintained in `src/data/availability.ts`. The primary recruiter address is `harshgavand2@gmail.com`; the earlier address remains an alternate. The supplied neon HG artwork is used in the header and favicon through small web derivatives.

The introduction positions the work around reliable full-stack applications, backend APIs, and production AI workflows. A disclosed stack panel groups 43 evidenced tools and patterns into six categories with visible labels and decorative logo marks. Peripheral coursework and AI IDE names are omitted. WebRTC remains backed by the linked conferencing project, and TensorFlow by the deployed next-word model. Brand marks use one self-hosted SVG sprite; source metadata and license notices are in `public/stack`, and no runtime icon CDN or icon font is required.

Experience includes shipment banners and role highlights. The Skills navigation leads to the AI workspace link and condensed technology list. PromptWars participation text is supplied by the owner; no competition ranking or public repository link is invented.

Quota lifecycle handling remains implemented in `server/quota-lifecycle.mjs`. An optional Python context-manager illustration is available in `examples/quota_lifecycle.py`; it is not a second deployed backend. Run its standard-library tests with `python -m unittest discover -s examples -p "test_*.py" -v`; a FastAPI host must propagate post-dispatch disconnect cancellation to the injected provider task.

Render-hosted applications receive best-effort background GET requests after browser idle, with a 500ms fallback. Origins come only from HTTPS Render application URLs in the catalog and are deduplicated. Requests omit credentials and referrers, failures stay isolated, and cleanup cancels pending work. Visitors using Save-Data are excluded. Warm-up helps sleeping applications become available sooner; no third-party requests run during server rendering.

## Development

Use Node.js **24.x LTS**, pinned in `package.json` and `.nvmrc`. This supports the server's shared TypeScript data and keeps deployments on one major version while receiving patch updates. Install with `npm ci`, then run `npm run dev`. This starts the API at `127.0.0.1:3001` and Vite at `127.0.0.1:5173`; both ports must be available. Vite proxies `/api`. The UI and API can also run separately through `npm run dev:ui` and `npm run dev:api`.

## OpenAI assistant

### AI workspace

`/ai/` is a pre-rendered public workspace, linked from Skills and the existing text/voice assistant. It provides a code-grounded technical guide, a structured role comparison, and a live support-ticket triage workflow. Core portfolio content and the community project's application remain unchanged.

The guide retrieves bounded excerpts using BM25-style lexical scoring over **23 selected public files from five repositories**. Each excerpt has an immutable commit, content hash, exact line range, and canonical GitHub link. The model may cite only identifiers from that request's retrieved set. The browser receives selected excerpts, not the complete corpus. This is lexical code retrieval, not an embedding/vector database; retrieval and model grounding have separate limitations. Repository code is treated as untrusted reference data and is never executed.

`npm run ai:index` refreshes the explicit allowlist in `scripts/source-allowlist.mjs`. It verifies repositories are public, resolves commits, rejects oversized/suspicious files, and writes `server/knowledge/source-index.json` plus public metadata in `src/data/sourceSummary.json`. Builds and visitor requests work offline from that snapshot and require no GitHub credentials. `GITHUB_TOKEN` is optional for the refresh command's API allowance and is never bundled. Private workspace files, company systems, document uploads, and Agri Samaj's application are excluded. The interface shows the indexed commits/date; upstream changes are not automatically represented.

`POST /api/ai/recruiter` accepts a bounded public job description and compares up to five requirements against published professional/project records. Supported/partial findings need server-resolved evidence references. A capability guard rejects unrelated citations and keeps duration, production operations, and stack-only evidence partial. Empty support is downgraded to “not shown”; unknown source identifiers are rejected. There is no fabricated fit score, protected-characteristic inference, or hiring decision. AI-generated explanations can still be wrong and should be checked against their sources.

`POST /api/ai/triage` runs real model classification behind deterministic output validation and review rules. Common email, phone, payment-number, and credential patterns are redacted before dispatch; this is not a complete PII detector, so the UI asks for fictional inputs. Security-compromise tickets and instruction-overriding attempts require human review. The triage workflow never creates a ticket, changes an account, issues a refund, or queues a real approval. It adapts the classification pattern to the portfolio's Node API; it does not pretend to host the separate FastAPI/LangGraph application's runtime.

All routes share existing admission, OpenAI configuration, daily/monthly allowances, cancellation, conservative reservation/settlement, and durable recovery. No new Vercel secrets or services are needed. Per-request panels show measured server time, provider token usage when available, request identifier, and conservative allowance charge. This is a safety-margined application allowance, not an invoice. Production logs contain operational metadata only, never user text, code excerpts, tickets, or job descriptions.

### Service operation and loading

`GET /api/ai/metrics` exposes seven UTC calendar days of anonymous aggregate successes, failures, cache hits, provider-backed latency buckets, tokens, and conservative allowance use. Atomic Redis counters expire after 31 days. No visitor input, IP address, transcript, or raw response is recorded in metrics. The UI labels p95 as a histogram upper bound, not an SLA. Monitoring fails independently from generation and begins with this release.

Only four exact public, single-turn implementation questions are cacheable. Cache keys include the source snapshot, prompt version, and complete selected request context; entries expire after six hours and citations are revalidated on read. Admission still runs before cache lookup. Cache hits make no provider call and reserve no provider cost. A cache outage falls back to the normal admitted, budgeted generation path.

The homepage keeps the corner assistant launcher while loading its dialog on interaction. Secondary case-study, archive, and AI routes are split into client chunks. Static rendering injects the actual page components so crawler-readable HTML remains complete on every route. The mobile launcher is a 48px control with an accessible label.

`npm run ai:sources:check` checks upstream revisions for changes to allowlisted files; the weekly read-only Source freshness workflow fails when a refresh is required. Ordinary refreshes use public GitHub source. To publish a portfolio implementation change and its generated snapshot together, commit the implementation locally, then run `npm run ai:index -- --committed-portfolio`, evaluate, commit the generated evidence, and push both commits. That explicit bootstrap mode reads only committed allowlisted files from the verified portfolio origin; never publish its report without the referenced commit.

### Repeatable AI quality checks

`npm run ai:eval -- --live` explicitly runs the versioned synthetic evaluation set through a temporary local HTTP server with the real provider and existing shared budget. The default is 24 distinct synthetic cases repeated twice (48 responses). Public-answer caching and production monitoring are disabled during the local benchmark. Its fixed local evaluation admission allowance does not change production limits. `npm run ai:eval -- --live --url=https://harshgavand.dev` runs three bounded production smoke checks. There are no paid model calls during ordinary tests, builds, pull-request CI, or page loading.

Results in `src/data/aiQuality.json` and `verification/audit-polish-2026-10-17/evaluation.json` include sample count, checks, timestamps, model, timings, allowance use, source version, and a cross-platform runtime fingerprint. The page labels these as controlled release checks, not production traffic or comprehensive semantic accuracy. Expectations are source-derived synthetic fixtures, not independently human-labelled ground truth. The report also includes p95 latency, tokens, a ticket-class confusion matrix, and negative checks against incorrect refund claims. Automated checks cover required sources, refusal/missing facts, requirement gaps, ticket categories, and review rules. Raw synthetic outputs remain in ignored `tmp/ai-evaluation/` for manual inspection. If AI runtime/source files change, the interface marks old results as belonging to an earlier revision. `node scripts/check-ai-release.mjs` blocks release verification unless the runtime/source fingerprints match, all checks pass, and at least 24 unique cases run twice. The evaluator rejects changes to the runtime during a run.

The read-only GitHub Actions verification workflow runs lint, TypeScript, deterministic tests, production build, prerender/HTTP checks, and the AI release gate on pushes and PRs. Official actions are pinned to immutable revisions. No API secrets are exposed to PR workflows.

The corner assistant supports **Text chat** and an opt-in **Voice assistant**, introduced as **Harsh’s AI voice assistant**. Visitors can play a static welcome, record a question (20 seconds maximum), and receive a short spoken answer alongside the full text and canonical sources. Recording begins only after clicking **Ask by voice**. Stop, mute, replay, mode changes, dialog dismissal, and backgrounding the page stop active capture/playback; text chat remains available after microphone or audio failure. This is a turn-based voice interaction, rather than an always-listening realtime connection.

Voice requests use same-origin `POST /api/voice/chat`, with the existing origin checks and shared admission/quota controls. The browser sends validated mono 16kHz PCM WAV, not a trusted duration field. The server rejects malformed, silent, and oversized audio before provider calls. The pipeline uses `gpt-4o-mini-transcribe` → the existing `gpt-6-luna` knowledge-grounded response → `tts-1` / `nova` speech. No additional environment variables or dependencies are required. Audio and transcripts are not persisted by this service; OpenAI receives the recording and messages under the account’s applicable provider data controls.

One voice turn reserves up to **$0.10882** of the existing shared monthly allowance, then refunds unused stages and settles conservative actual usage. The bound includes a 2x pricing margin, transcription’s 16k input/2k output context caps, the existing text bound, and a 900-character speech cap. Unknown provider usage retains that stage’s estimate; failed settlement enters the existing durable recovery queue. Speech failure still returns the written answer. Rates are fixed in `server/voice.mjs`; review them when changing models or provider pricing. The static welcome makes no per-visit API call and is generated explicitly with `node scripts/generate-voice-welcome.mjs`.

`node scripts/voice-live.mjs --live` performs an explicitly paid check against a local running API using synthetic public speech. Add `--url=https://harshgavand.dev` to check production. It never opens a physical microphone, prints credentials, or persists personal audio; temporary synthetic inputs and outputs stay in ignored `tmp/voice/`.

The assistant uses **`gpt-6-luna`** through the OpenAI Responses API. Requests use standard processing, `reasoning.effort=none`, a 1,000-token output cap, strict structured output, and `store=false`. There are no paid retrieval tools or embedding API calls; relevant project content is retrieved locally from the existing portfolio data.

Configure `OPENAI_API_KEY` and `OPENAI_MODEL=gpt-6-luna` in the service environment. Local development reads the existing `D:\PortFolio-Harsh\.env`, after any repository `.env.local` or `.env`; process variables take precedence. Restart the API after environment changes. Never prefix the key with `VITE_` or put it in browser code. Production deliberately does not load the parent-directory env file.

The browser sends bounded conversation history to same-origin `/api/chat`. Retrieval ranks the full project catalogue internally, but the provider receives compact profile/experience/skill records, at most four selected project briefs, relevant limitations, and bounded implementation excerpts. It does not receive every project, stack, or architecture diagram for each question. OpenAI returns text and references; the server maps references to existing portfolio links. Chat is held in page memory only. This service does not store conversation text. Redis stores aggregate allowance counters, anonymous reservation records, anonymous service counters, and versioned answers to four explicitly public sample questions. Custom questions, job descriptions, tickets, and audio never enter the answer cache. Messages and portfolio context are sent to OpenAI; `store=false` disables stored Responses, while provider retention follows the account's applicable data controls.

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

The build automatically runs a browser-free React pre-render step for the homepage, archive, case studies, and 404 page. Client code hydrates the same component tree and build year. No API call, credential, running server, or headless browser is needed during the build. HTML is readable before JavaScript runs, including all sixteen public cards, forty archive entries with complete notes, and native disclosures.

The tests cover original project identities and assets, source metadata, assistant validation and failure contracts, quota admission, pre-dispatch rollback, durable retries, dead letters, crawler user agents, archive routing, every referenced HTML/CSS asset, JavaScript chunk syntax, unique IDs and anchors, chapter numbering, tab relationships and keyboard movement, copy/link cleanup, image attributes, and disclosure nesting. Local HTTP tests require loopback networking. Browser layout and device interaction review is a separate manual check; this refactor was verified at the code and HTTP levels at the user's request.

## Content and presentation

- `src/data/projects.json`, `src/data/recentProjects.json`, `src/data/communityProjects.json`, and `src/data/platformProjects.json`: 39 active project records, including 11 recent AI repositories; Agri Samaj stays outside the 38-item archive.
- `src/data/portfolio.ts`, `src/data/workPresentation.ts`, and `src/data/deploymentShowcase.ts`: shared profile, experience, featured projects, and case studies.
- `src/data/recruiter.ts`: chapter numbers, curated archive, architecture widget, code excerpt, prompts, and principles.
- `src/recruiter.css`: graphite, ivory, and citrus tokens; high-contrast text; responsive layouts; focus states; 180ms transitions and reduced-motion support.
- `src/components/RequestTrace.tsx` and `src/lib/requestTrace.ts`: a completed happy path, pre-dispatch rollback, and uncertain upstream timeout scenarios. The source component describes cost reservations, pre-dispatch cancellation, and unknown-usage retention without fabricated timing or token-billing figures. It remains unmounted after the owner removed the Field Notes section.
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

| Variable                   | Value                                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------------- |
| `SITE_URL`                 | `https://harshgavand.dev` (also the built-in default)                                     |
| `ALLOWED_ORIGINS`          | `https://harshgavand.dev` (also the production default); comma-separate only real aliases |
| `OPENAI_API_KEY`           | Existing OpenAI project key; keep secret                                                  |
| `OPENAI_MODEL`             | `gpt-6-luna`                                                                              |
| `UPSTASH_REDIS_REST_URL`   | Existing HTTPS Upstash REST endpoint                                                      |
| `UPSTASH_REDIS_REST_TOKEN` | Existing writable REST token with EVAL access; keep secret                                |
| `AI_DAILY_REQUEST_LIMIT`   | `200`                                                                                     |
| `AI_MONTHLY_BUDGET_USD`    | `1.00`                                                                                    |
| `CRON_SECRET`              | Random secret of at least 32 characters                                                   |

Use the existing quota database: the namespace remains `portfolio-ai:v1`, so moving hosts does not reset spending or lose queued settlements. Never put secrets in `VITE_*` variables. Vercel supplies its runtime environment; no manual `PORT`, `TRUST_PROXY`, `VERCEL` or start command is required. Node 24 is already pinned. `.env.example` contains placeholders only.

Vercel calls `/api/quota-reconcile` daily at 04:15 UTC (09:45 India time), automatically passing `CRON_SECRET` as a bearer token. Missing or incorrect authorization returns 401 without Redis or provider work. Cron runs only on production deployments. The assistant also reconciles during admitted requests, so recovery progresses between daily invocations. Dead letters still require operator review. `/api/health` reports model, allowance limits and configuration presence; presence alone does not prove Redis connectivity or a successful model request.

Metadata defaults to `https://harshgavand.dev`. Optional build-time `SITE_URL` overrides canonical, Open Graph, Twitter, JSON-LD, robots and sitemap output consistently; only an HTTPS origin is accepted. Development uses `createRoot`; generated pages use `hydrateRoot`, including a shared build year. Old verification reports remain historical records and are not rewritten to imply they tested the current host.

For a local built preview, run `npm run build` then `npm start`, and use `http://127.0.0.1:3001`. Add that origin to `ALLOWED_ORIGINS`. The integrated `npm run dev` setup uses the development origins from your `.env`.

No deployment is performed by local development or validation commands.

Earlier verification directories document earlier designs and are retained as historical evidence.

## Verified deployed applications — 20 October 2026

The main Projects section now includes Docwise, the voice adventure assistant, ADK Shopping, the semantic-cache symposium assistant, and the PDF symposium assistant alongside the existing featured work. The banking harness card now opens its deployed ledger workflow. All six use the same shared card and case-study components as UGC and AgriConnect, with original website screenshots, source/live links, expandable features, contributions, and clearly scoped outcomes.

The review covered 30 Vercel deployment attempts across 10 projects in the India-time day. Finance and Healthcare retain their repository entries but were not promoted as public AI applications because their AI endpoints require a private code. See [the review](verification/deployment-showcase-2026-10-20.md) and the [sanitized public results](public/verification/deployments-2026-10-20.json) for workflows, source boundaries, and link checks. Corpus counts and synthetic cart/transfer calculations are verification evidence, not adoption, revenue, or performance claims.

## Web Analytics

Vercel Web Analytics uses `@vercel/analytics/react`, mounted once in the shared `Portfolio` component. React Router's pathname supplies page views for the homepage, archive and other routes; hash-only chapter navigation does not send another page view. Development uses the SDK's debug mode, and production uses its hosted collection script. The component renders no HTML, preserving pre-rendering and hydration.

Enable Web Analytics in the Vercel project's Analytics panel, then deploy. No additional application environment variable or tracking ID is required. Visit the production site normally to generate real traffic and view visitors/page views in the Vercel dashboard. The integration adds page-view tracking only; contact fields and AI conversations are not sent as custom analytics events.

## Speed Insights

Vercel Speed Insights uses `@vercel/speed-insights/react`, mounted once beside Web Analytics in the shared `Portfolio` component. React Router's pathname identifies the route for performance measurements on the homepage, archive and other routes. The component renders no HTML, preserving pre-rendering and hydration.

Enable Speed Insights in the Vercel project's Speed Insights panel, then deploy the updated application. Visit the deployed site and navigate between pages to collect real performance measurements, then view them in the Vercel dashboard. No additional application environment variable or tracking ID is required. Local build checks do not verify hosted data collection.

## Dependency and deployment tooling

The linter uses ESLint 10 flat configuration in `eslint.config.js`, with compatible TypeScript, React, hooks, and Fast Refresh checks. The lockfile excludes the retired ESLint 8 dependency chain.

Vercel uses the repository's `vercel.json` install/build commands. `node scripts/run-npm.mjs` invokes npm with supported environment settings: legacy `cache-dir` is translated to npm's `cache` setting when no explicit cache is configured, and pnpm-only `store-dir` is omitted. This changes only the npm subprocess; it does not modify your system or deployment environment variables. Warnings are not suppressed. For the same behavior locally, use `node scripts/run-npm.mjs ci --include=dev` and `node scripts/run-npm.mjs run build`.

## Hosted project additions — 21 October 2026

Healthcare Explorer and Multi-Agent Customer Support now use the main shared project cards with real deployed screenshots, source/live links, complete stacks, and scoped contributions/outcomes. Healthcare browsing is public; AI chat requires a private access code. Streamlit uses seeded orders and simulated approvals, with a public review queue and process-local session state.

The standalone AI Support Ticket Classifier was removed from the catalog, curated references, and indexed source listing at the owner's request. Its GitHub repository was not modified. The portfolio's separate Node.js triage workflow remains available and links to its own implementation. See [the review](verification/deployment-showcase-2026-10-21.md) and [sanitized checks](public/verification/deployments-2026-10-21.json). Earlier dated reports describe their original review scope.

### Precision polish, 22 October 2026

The Agri Samaj card and case study use the owner-supplied English homepage image at its original 1917 × 1102 dimensions. The PNG is copied without alteration; its digest and origin are recorded in `public/verification/agri-samaj-screenshot-2026-10-22.json`.

Case studies expose the existing implementation decision and reliability behavior alongside stage-specific architecture descriptions. The complete data flow remains readable in a native disclosure without JavaScript. DevGraph returns to its archive entry, and legacy Field Notes fragments resolve to Skills. The dark design, existing project order, assistant shortcuts, ARIA controls, and removed-section choices are preserved.

Validation for this pass is build/prerender, TypeScript, ESLint, and focused link/content inspection. The full test suite and browser verification were not run, as requested. Application/provider behavior and the versioned AI evidence records are unchanged.

The link reachability record for this pass is `public/verification/portfolio-links-2026-10-22.json`. The Zoom archive entry keeps its GitHub source but omits the live-site button because the existing Render service returned HTTP 503. LinkedIn blocked automated requests and three Streamlit links timed out; those destinations were not treated as missing.
