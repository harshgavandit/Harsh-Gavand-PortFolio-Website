# Gemini assistant and visual update — 12 October 2026

## Delivered behavior

The portfolio retains its calm white/soft-blue identity, all 26 original project records, four full case studies, walkthroughs, archive filters/search, résumé, portrait, experience/skills, contact draft behavior, and client-side 404. A new visual gallery links into the existing detailed case studies. Actual demo captures and clearly labeled architecture maps supply project previews.

A native responsive dialog now provides a real Gemini assistant, suggested prompts, multi-turn conversation, validated project/section links, loading, cancellation, retry, clear, and accessible input labels. History is held in page memory only. Messages and public context go to Google; the app does not store or log conversations.

## Model selection

The configured key was read from `D:\PortFolio-Harsh\.env` without printing or copying it. The Gemini model-list request returned HTTP 200. Both candidate model names were listed:

- `gemini-3.5-flash-lite`: HTTP 200 with the requested short text in 1,922 ms. The implemented structured portfolio adapter then succeeded in 2,246 ms.
- `gemini-3.8-flash`: did not complete within the 30-second probe. This is a timeout observation, not evidence that the model can never work.

Selected model: **gemini-3.5-flash-lite**. There is no silent model fallback. Availability and provider quota can change.

The final same-origin HTTP verification through the running Node service returned HTTP 200 in **1,706 ms**, identified the AI News To Email Generator, and returned its canonical repository link. The full safe response is recorded in [live-api.json](live-api.json).

## Automated evidence

- `npm test`: **20 passed, 0 failed**. Covers preserved project catalog/hash, portrait/resume/assets/SEO, input size and alternating roles, allowed origins, request limits, credential-safe errors, missing configuration, static/SPA serving, source/env file denial, portfolio retrieval, server headers/context, provider quota/configuration/timeout/incomplete-output handling, and canonical source validation.
- `npm run lint`: passed.
- `npm run type-check`: passed.
- `npm run build`: passed after final styling changes.
- `git diff --check`: passed.
- The configured secret was checked against built JS/CSS and package files: zero occurrences. `.env` files are ignored; `.env.example` contains no credentials.
- `npm run dev`: started Vite at 5173 and the configured Node service at 3001. `/api/health` returned HTTP 200 through Vite's proxy and the final preview. These health results establish configuration/proxy availability; real generation is established separately above.

## Browser evidence

Verified in the Codex in-app browser against the built portfolio at `http://127.0.0.1:4180/`:

1. Suggested AI-project question returned a live Gemini answer with valid repository and section links.
2. A follow-up role description requiring Python, FastAPI, SQL, Docker, Kubernetes, and five years of experience returned supported matches and explicitly flagged the last two requirements for verification.
3. An education/salary question returned the published degree/university/CGPA and stated that salary was not published.
4. Escape closed the dialog, restored focus to its launcher, and restored document scrolling. The hero entry reopened it. A section source closed the dialog and navigated/focused the Experience section.
5. Isolated fixture testing (no Gemini calls) verified a usage-limit error with contact/retry controls, successful retry, Stop response, and Clear chat. Fixture answers were explicitly labeled as test data and are not counted as Gemini evidence.
6. Gallery links reached the correct case study. Archive search/no-results/reset worked. Show more exposed all 22 archive entries and moved focus to the first newly displayed project. Manual motion-off control worked. Mobile navigation opened and selecting Skills closed it and navigated correctly.
7. No page horizontal overflow at 320, 375, 430, 768, 1024, 1440, and 1920 px. Gallery becomes one column on phones and two columns on larger screens. See [responsive.json](responsive.json).
8. Chat and composer stayed within 320×640, 375×500, 768×900, and 1440×1000 viewports. The short-height test approximates available space but does not test a real on-screen keyboard. See [chat-responsive.json](chat-responsive.json).
9. Scoped axe checks on new gallery/entry controls: 13 passing rules, zero configured violations after a caption contrast correction; two incomplete ARIA checks. Chat: 15 passing rules, zero configured violations, one incomplete contrast check. Tags: WCAG 2 A/AA and 2.1 AA. These are scoped results, not complete WCAG or screen-reader certification. The library was removed by reload after testing.

## Accepted screenshots

- [Desktop hero](desktop-hero.png)
- [Desktop project gallery](desktop-projects.png)
- [Live Gemini project answer](desktop-chat.png)
- [Final education/unknown-salary answer](desktop-chat-final.png)
- [Mobile gallery](mobile-projects.png)
- [Mobile menu](mobile-menu.png)
- [Mobile project conversation](mobile-chat.png)
- [Mobile final answer](mobile-welcome.png) — filename retained from intended capture; actual content is the final answer.

## Runtime and hosting

The local final preview serves frontend and `/api/chat` from one Node process. No additional runtime package was needed. Node 22.18+ is required for shared TypeScript portfolio data.

For public hosting, the complete app requires a Node **web service** with `npm ci && npm run build`, `npm start`, `NODE_ENV=production`, server-side `GEMINI_API_KEY`, the selected model, and the exact public `ALLOWED_ORIGINS`. A static-only Render site cannot run the backend. Full instructions are in [README](../../README.md) and [.env.example](../../.env.example).

No production hosting account was changed and no production deployment is claimed. The verified source and evidence are included in the GitHub update requested by the user; the final reply records the pushed commit and remote synchronization result. The parent env file remains outside the Git repository.

Limits are in memory per server instance and reset on restart. Shared hosting across multiple instances needs a shared limiter. Generative answers may be imperfect despite grounding; this is why the UI offers portfolio sources and an AI disclosure. External project demos and emails were not re-audited or submitted during this implementation.
