# Harsh Gavand — Portfolio

React + TypeScript portfolio with a light, interactive engineering-lab design, an interactive CSS 3D model of real project layers, a searchable 26-project dashboard, four detailed case studies, and a OpenAI GPT-6 Luna portfolio assistant. Includes an engineering profile, experience timeline, project-linked skills, workflow, and contact draft preparation.

The current craft refinement puts proof of work first: selected builds lead the index, a physical-looking implementation model replaces the abstract hero sculpture, and editorial case studies reduce repeated card framing. See [the critique and current verification](verification/craft-2026-10-13/README.md). The underlying Engineering Lab presentation offers category filters, search, Overview / Architecture / Engineering tabs, selectable system nodes, and project-specific assistant prompts. The final theme is `src/lab.css`, layered after the existing styles. See [current research and verification](verification/engineering-lab-2026-10-13/README.md) for reference observations, screenshots, responsive checks, accessibility results, bundle sizes, and limitations. Earlier redesign reports remain historical evidence.

## Development

Use Node.js **22.18 or newer** (built-in TypeScript stripping is required by the server's shared portfolio data). Use a currently maintained Node LTS release.

```sh
npm ci
npm run dev
```

`npm run dev` starts the API at `127.0.0.1:3001` and Vite at `127.0.0.1:5173`. Vite proxies `/api` to the backend. Both ports must be available. `npm run dev:ui` and `npm run dev:api` can be run separately.

## OpenAI assistant

The assistant uses **`gpt-6-luna`** through the OpenAI Responses API. Requests use standard processing, `reasoning.effort=none`, a 1,000-token output cap, strict structured output, and `store=false`. There are no paid retrieval tools or embedding API calls; relevant project content is retrieved locally from the existing portfolio data.

Configure `OPENAI_API_KEY` and `OPENAI_MODEL=gpt-6-luna` in the service environment. Local development reads the existing `D:\PortFolio-Harsh\.env`, after any repository `.env.local` or `.env`; process variables take precedence. Restart the API after environment changes. Never prefix the key with `VITE_` or put it in browser code. Production deliberately does not load the parent-directory env file.

The browser sends bounded conversation history to same-origin `/api/chat`. The server supplies published profile, About, experience, skills, all 26 project index entries, and the five most relevant project details, including existing case-study architecture and contribution notes. OpenAI returns text and references; the server maps references to existing portfolio links. Chat is held in page memory only. This service does not store conversation text. Redis stores only aggregate allowance counters and anonymous reservation records. Messages and portfolio context are sent to OpenAI; `store=false` disables stored Responses, while provider retention follows the account's applicable data controls.

Controls include suggestions, follow-up questions, a 2,000-character input limit, loading, stop, retry, clear, résumé/contact references, and keyboard dismissal. Provider quota, invalid configuration, timeout, and incomplete output become clear user-facing errors. Default server limits are ten requests per client and sixty globally per ten minutes, with at most three simultaneous generations. These short-window limits remain in memory. The additional global daily and monthly allowances below are persistent and shared across server instances.

## Persistent credit protection

The entire assistant shares a **200-request daily allowance** and a **$1.00 monthly conservative cost allowance**, persisted in Upstash Redis. Daily and calendar-month windows reset at midnight UTC (05:30 India time). Both limits survive service restarts, sleep and redeploys, and apply across server instances sharing the same Redis database.

Configure these variables in your existing local `.env` and in Render's service environment:

- `UPSTASH_REDIS_REST_URL`: the HTTPS Redis REST endpoint.
- `UPSTASH_REDIS_REST_TOKEN`: the standard REST token, with EVAL/write access. The read-only token cannot enforce quotas. Keep it server-only.
- `AI_DAILY_REQUEST_LIMIT=200`
- `AI_MONTHLY_BUDGET_USD=1.00`

Redis admission uses one atomic Lua script to check both allowances, count the request, and reserve its maximum estimated cost **before OpenAI is invoked**. Concurrent calls cannot oversubscribe the remaining allowance. A successful response reconciles its reservation with provider-reported token usage, once only. Timeouts, cancellation, provider failures, incomplete responses, invalid usage metadata, and failed settlements retain the conservative reservation. Rejected admissions never call OpenAI. There is no automatic provider retry.

The cost ledger uses integer micro-dollars and a 2x margin over GPT-6 Luna Standard prices checked on 13 October 2026 ($0.10/M input and $0.50/M output). Its preflight upper bound counts the full serialized request's UTF-8 bytes, including trusted portfolio context/history/schema, plus 4,096 tokens of framing allowance and the 1,000-output-token cap. Requests over 100,000 serialized bytes or with unsupported model/tier/reasoning/tools settings are rejected. Cache discounts are ignored for conservative accounting. This is an application allowance, not an OpenAI billing balance or account-wide cap: it covers this service's calls after activation, excludes taxes and unrelated API use, and requires reviewing pricing if the model's rates change.

Missing credentials, Redis errors, malformed stored values, and read-only tokens **pause generation**. The portfolio remains accessible. Exhausted allowances return HTTP 429 and a reset interval; storage failures return HTTP 503. Chat hides immediate retry for daily/monthly exhaustion and keeps the contact link available. Never delete the quota database or its current keys to reset usage. The short-window IP limiter does not provide identity authentication; persistent global allowances protect the spending even when callers use multiple IPs.

`node scripts/quota-status.mjs` prints aggregate usage and remaining allowances without exposing credentials or chat. `node scripts/quota-live.mjs` runs explicit live Redis verification using isolated expiring test keys and **no OpenAI calls**. `node scripts/quota-http-live.mjs` also verifies rejection after a real Node process restart with a fake generator. Test keys cannot change the production ledger. The free Render filesystem cannot retain local counters, which is why this uses external Redis instead of a local file. See [verification](verification/quota-2026-10-13/README.md).

## Validation

```sh
npm run lint
npm run type-check
npm test
npm run build
```

Tests cover preservation of the original catalog/assets/SEO plus assistant input validation, origins, limits, trusted context, source mapping, and provider failure handling. The local HTTP tests need loopback networking. Current OpenAI migration evidence is recorded in `verification/openai-2026-10-13/README.md`; prior Gemini evidence is historical.

## Content and assets

- `src/data/projects.json`: preserved original project descriptions, contributions, technologies, and links.
- `src/data/portfolio.ts`: typed case studies and shared public profile content. Personal details come from the updated September 2026 resume.
- `public/Harsh_Gavand_Resume.pdf`: exact supplied updated resume. All resume links use this stable URL.
- `public/projects`: actual captured public demo pages in responsive WebP sizes. Other visuals are labeled implementation maps, not screenshots.
- `src/index.css`, `src/calm.css`, `src/enhancements.css`: tokens, light presentation, gallery, responsive chat, focus styles, and motion behavior.
- `src/components/Assistant.tsx`: native chat dialog and conversation lifecycle.
- `server`: OpenAI generation, portfolio knowledge, validated links, HTTP contracts, and production static serving.

Fonts are self-hosted. There are no analytics, external font requests, or image services required at runtime. Chat uses the server's OpenAI connection; portfolio content remains browsable when AI is unavailable.

## Contact behavior

The form prepares a `mailto:` draft. It does not claim to send a message. The visitor reviews and sends the draft through their email application. Copy-email and direct email links are available when no default mail client is configured.

## Hosting

For the complete portfolio **including the assistant**, use a Node web service:

- Build command: `npm ci --include=dev && npm run build`
- Start command: `npm start`
- Environment: `NODE_ENV=production`, `OPENAI_API_KEY` (secret), `OPENAI_MODEL=gpt-6-luna`, and `ALLOWED_ORIGINS` set to the exact public origin (no trailing slash). Include comma-separated aliases only if they actually serve this site.
- Add the four Redis/allowance variables described above. The assistant will pause if Redis is not configured or writable.
- Let the host provide `PORT`. For a Render service behind its single trusted reverse proxy, set `TRUST_PROXY=1`; leave it `0` when directly exposing Node.
- Health endpoint: `/api/health`. It reports model, allowance limits, and configuration presence. Presence alone does not verify Redis connectivity or OpenAI generation quota; a successful chat request verifies the full path.

The Node service serves `dist`, assets, résumé, API routes, and the SPA fallback. A static-only host cannot run `/api/chat`; the existing Render Static Site configuration must become a web service or use a separately configured backend. No hosting account changes are performed by this implementation. Keep the published origin aligned with canonical/social/sitemap metadata if changing the URL.

For a local built preview, run `npm run build` then `npm start`, and use `http://127.0.0.1:3001`. Add that origin to `ALLOWED_ORIGINS`. The integrated `npm run dev` setup uses the development origins from your `.env`.

No deployment is performed by local development or validation commands.

## Presentation and motion

The hero uses a CSS 3D implementation model derived from the existing AI digest and UGC case-study diagrams. Visitors can assemble or separate its layers, switch the build, and select a layer to read its published contribution notes. Layer controls support clicks, arrow keys, Home and End. Pointer movement produces a small damped perspective response on mouse devices only. Native touch scrolling is preserved; no automatic rotation, scroll hijacking, or WebGL is required.

The supplied photograph appears in About at `public/portrait/harsh-studio.jpg`; the original photograph is retained. All 26 project records, case studies, experience, resume, contact draft behavior, and portfolio assistant remain intact. `src/lab.css` is the final visual layer.

The current page does not import the earlier Three.js scene or its renderer. Those source files remain for reference, but Vite excludes them from the production output. The new model uses five DOM layers and only animates in response to interaction. System reduced motion and the manual motion toggle disable layer transitions and pointer response while preserving all information and controls.

See [the studio verification report](verification/studio-2026-10-12/README.md) for evidence and remaining limits.

## Interactive exploration

The embedded engineering dashboard replaces the earlier project-gallery modal. Its detail tabs support arrow keys and Home/End. Featured projects have implementation maps based on existing notes; other projects have explicitly labeled technology maps without invented request sequences. The six-category skills map supports keyboard navigation, links to matching projects in the dashboard, and keeps a complete toolkit disclosure available. An experience chapter rail tracks the visible role; a dimensional engineering bridge connects the hero to the work. These sections use CSS perspective and Framer Motion.

See [interactive exploration validation](verification/exploration-2026-10-12/README.md) for desktop/mobile screenshots, accessibility scans, responsive checks, and scope limits.

See [the latest immersive design evidence](verification/immersive-2026-10-12/README.md) for reference research, final desktop/mobile captures, WebGL fallback, and current validation results.
