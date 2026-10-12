# Harsh Gavand — Portfolio

React + TypeScript portfolio with a calm white/soft-blue design, visual selected-project gallery, four detailed case studies, all 26 original projects, and a Gemini portfolio assistant. Includes an engineering profile, experience timeline, categorized skills, workflow, and contact draft preparation.

## Development

Use Node.js **22.18 or newer** (built-in TypeScript stripping is required by the server's shared portfolio data). Use a currently maintained Node LTS release.

```sh
npm ci
npm run dev
```

`npm run dev` starts the API at `127.0.0.1:3001` and Vite at `127.0.0.1:5173`. Vite proxies `/api` to the backend. Both ports must be available. `npm run dev:ui` and `npm run dev:api` can be run separately.

## Gemini assistant

The assistant uses **`gemini-3.5-flash-lite`**, verified with a real generation request on 12 October 2026. `gemini-3.8-flash` was also listed for the supplied key but timed out during the 30-second probe. Model availability and quota can change; listing a model alone is not proof of generation access.

Set `GEMINI_API_KEY` in the service environment or an ignored `.env.local` / `.env` in the repository. Local development also reads the existing `D:\PortFolio-Harsh\.env`; it never copies or serves that file. Process variables take precedence, then repo `.env.local`, repo `.env`, and the local parent file. Restart the API after changing environment variables.

Use [.env.example](.env.example) for non-secret configuration. Never prefix the key with `VITE_` or put it in browser code. Production deliberately does not load the parent-directory env file.

The browser sends bounded conversation history to same-origin `/api/chat`. The server supplies published profile, About, experience, skills, all 26 project index entries, and the five most relevant project details. Gemini returns text and references; the server maps references to existing portfolio links. Chat is held in page memory only. This service has no conversation logging or database. Messages and portfolio context are sent to Google, whose handling is governed by the selected Gemini service terms.

Controls include suggestions, follow-up questions, a 2,000-character input limit, loading, stop, retry, clear, résumé/contact references, and keyboard dismissal. Provider quota, invalid configuration, timeout, and incomplete output become clear user-facing errors. Default server limits are ten requests per client and sixty globally per ten minutes, with at most three simultaneous generations. Limits are in memory and reset on server restart; scale-out hosting requires a shared limiter.

## Validation

```sh
npm run lint
npm run type-check
npm test
npm run build
```

Tests cover preservation of the original catalog/assets/SEO plus assistant input validation, origins, limits, trusted context, source mapping, and provider failure handling. The local HTTP tests need loopback networking. Current Gemini and UI evidence is recorded in `verification/gemini-2026-10-12/README.md`; older browser results are in `verification/README.md`.

## Content and assets

- `src/data/projects.json`: preserved original project descriptions, contributions, technologies, and links.
- `src/data/portfolio.ts`: typed case studies and shared public profile content. Personal details come from the updated September 2026 resume.
- `public/Harsh_Gavand_Resume.pdf`: exact supplied updated resume. All resume links use this stable URL.
- `public/projects`: actual captured public demo pages in responsive WebP sizes. Other visuals are labeled implementation maps, not screenshots.
- `src/index.css`, `src/calm.css`, `src/enhancements.css`: tokens, light presentation, gallery, responsive chat, focus styles, and motion behavior.
- `src/components/Assistant.tsx`: native chat dialog and conversation lifecycle.
- `server`: Gemini generation, portfolio knowledge, validated links, HTTP contracts, and production static serving.

Fonts are self-hosted. There are no analytics, external font requests, or image services required at runtime. Chat uses the server's Gemini connection; portfolio content remains browsable when AI is unavailable.

## Contact behavior

The form prepares a `mailto:` draft. It does not claim to send a message. The visitor reviews and sends the draft through their email application. Copy-email and direct email links are available when no default mail client is configured.

## Hosting

For the complete portfolio **including the assistant**, use a Node web service:

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Environment: `NODE_ENV=production`, `GEMINI_API_KEY` (secret), `GEMINI_MODEL=gemini-3.5-flash-lite`, and `ALLOWED_ORIGINS` set to the exact public origin (no trailing slash). Include comma-separated aliases only if they actually serve this site.
- Let the host provide `PORT`. For a Render service behind its single trusted reverse proxy, set `TRUST_PROXY=1`; leave it `0` when directly exposing Node.
- Health endpoint: `/api/health`. It confirms configuration presence and model name, not generation quota.

The Node service serves `dist`, assets, résumé, API routes, and the SPA fallback. A static-only host cannot run `/api/chat`; the existing Render Static Site configuration must become a web service or use a separately configured backend. No hosting account changes are performed by this implementation. Keep the published origin aligned with canonical/social/sitemap metadata if changing the URL.

For a local built preview, run `npm run build` then `npm start`, and use `http://127.0.0.1:3001`. Add that origin to `ALLOWED_ORIGINS`. The integrated `npm run dev` setup uses the development origins from `.env.example`.

No deployment is performed by local development or validation commands.

## Presentation and motion

The selected-work gallery combines real demo captures with clearly labeled architecture snapshots. It links to the existing full case studies and manual walkthroughs. The hero retains the supplied portrait and adds an assistant entry. `MotionPreferences` retains the manual control and OS reduced-motion subscription. Earlier cinematic assets remain in the repository, but the current light design uses stable surfaces and restrained transitions.
