# Recruiter scan and quota recovery — 15 October 2026

Verification is limited to code, generated HTML, and HTTP, as requested. No browser automation or screenshots were used.

## Changes

- Removed the duplicate Page chapters row; desktop header and hidden mobile navigation share the existing chapter definition.
- Unified the hero availability line and replaced numeric public fragments with semantic slugs across all 38 projects. Legacy numeric fragments translate to the new location client-side.
- Case study tabs now open on Product Preview and expose only one alternate System Architecture tab. Duplicate contribution tabs were removed. Source contribution notes remain available to the assistant and full archive.
- Added deterministic Request Trace success and upstream-timeout scenarios, with illustrative timings, token balances, reduced-motion completion, native controls, and screen-reader completion announcements. It makes no network requests. The simulated Gemini token scenario is distinct from the live OpenAI cost allowance.
- Reframed the flagship projects as UGC Content Studio, LendFlow, DevGraph, and AI News Automation; retained repository identity, original-name search aliases, and actual stack information.
- Added explicit login/public-access badges and Render hosting notes without inventing credentials, measured wake times, or account-free dashboards.
- Reworked experience bullets around implementation mechanisms and existing outcomes, retaining the supplied employment dates and metrics. Grouped skills by backend/API, applied AI, persistence, product engineering, and delivery capabilities.

## Source accuracy

The current default-branch commits still match the [four previously reviewed commits](../recruiter-2026-10-15/sources.json). Requested claims about atomic UGC accounting, generation webhooks, banking RBAC/concurrent state guards, compound indexes, sub-second latency, guaranteed delivery, and scheduled background ingestion are not established by those implementations and were not published as achievements. The digest's main entry calls a daily pipeline; that does not establish a running scheduler.

## Quota correctness

`server/app.mjs` executes `generateWithQuota` from `server/quota-lifecycle.mjs`; the hero displays lines from that actual implementation. An aborted request is checked before reservation and again immediately before provider dispatch. If cancellation occurs during admission, its monthly cost reservation is released through idempotent zero-cost settlement. Daily admission remains counted to avoid creating an abuse bypass.

Provider timeouts after dispatch may still incur a charge. Such requests keep their conservative reservation rather than creating unbacked allowance. Known-usage settlement failures persist an accounting-only Redis retry job. Startup and 30-second workers use atomic leases and idempotent settlement; bounded retries move repeated failures into a dead-letter set after five attempts, with operator-visible counts and structured failure events. If even retry persistence is unavailable, the API surfaces the failure and retains the allowance. It never replays provider generation automatically.

The caption therefore describes pre-dispatch rollback and durable settlement retries rather than promising unconditional rollback on every upstream timeout.

## Verification

- ESLint and TypeScript checks pass.
- Production Vite build and browser-free React pre-rendering pass for home, archive, and 404.
- 52 application and quota recovery tests cover validation, allowance limits, abort during admission, provider uncertainty, settlement retry persistence, worker leases, startup recovery, dead letters, and accounting failures.
- 20 generated-site tests cover default preview tabs, semantic and legacy anchors, navigation duplication, ARIA targets/keyboard behavior, simulation scenarios, complete archive content, clean copy, assets, crawler parity, and 404 behavior.
- `node scripts/quota-recovery-live.mjs` passed against real Redis/Lua using isolated temporary keys: pre-dispatch rollback, retained uncertain usage, reconstructed-worker recovery, concurrent single claiming, idempotent settlement, deferred rollback, and dead letters after five failures. Zero provider calls and no production-ledger modifications. Its machine-readable proof is written to ignored `tmp/quota-recovery-verification.json`.
- `node scripts/verify-production.mjs` checks deployed HTML and all public asset hashes against the local build; its proof is written to ignored `tmp/recruiter-production-verification.json`.

Browser layout, actual clicks/focus on devices, mail-app handoff, and real provider generation remain outside this code-only verification scope.
