# Recruiter portfolio refactor — 15 October 2026

This report covers source, build, generated HTML, and HTTP verification. No browser automation, screenshots, live layout measurements, or device interaction tests were performed for this refactor, following the user's instruction to handle browser review themselves. Older reports describe older presentations.

## Delivered structure

- Five homepage chapters with matching navigation and heading numbers from `src/data/recruiter.ts`.
- Four immediately readable case study cards with engineering decisions, outcomes, source actions, and keyboard-accessible Architecture Flow / Product Preview / Implementation Highlights tabs.
- A hero architecture widget, source-matched request/quota code excerpt, and engineering profile. The hero's count describes four end-to-end systems without claiming unverified production adoption.
- Eight curated repositories in a native disclosure and all 38 projects on a separate pre-rendered `/archive` route. Search and all existing category collections remain available there.
- Experience, education, recognition, portrait, résumé, contact draft flow, and assistant retained. About content is merged into experience; engineering principles are merged into skills.
- Header/floating assistant with Ctrl/Command+K and three recruiter prompts. Provider, request validation, quota, cancellation, and source-reference behavior remain covered by existing tests.
- One responsive stylesheet, explicit image dimensions, lazy images, two self-hosted font subsets, visible focus styles, 180ms transitions, reduced-motion handling, and no delayed text reveals. Retired WebGL/Framer implementations and dependencies removed.

## Editorial provenance

The request included illustrative technology and reliability claims that do not match the linked repositories. The published copy follows the reviewed implementation instead. [sources.json](sources.json) records the four reviewed commit IDs and paths.

- UGC: Prisma/PostgreSQL, Clerk, Google AI, and Cloudinary. Credit restoration is described without an idempotency or durable-queue guarantee.
- Banking: React/JavaScript, Express, and Sequelize/SQL. No Plaid, Appwrite, multi-bank aggregation, or measured layout-shift claims.
- GitHub Replica: React, Express, MongoDB/Mongoose, and client-side filtering. No unsupported OAuth or debounce claim.
- News digest: local Ollama/llama3, SQLAlchemy repositories, and multipart SMTP output.

UGC uses a gallery asset from its repository. Banking and GitHub retain existing public-page captures. The digest's visual describes the implemented email formats; it does not fabricate a delivered message or inbox capture. The exact supplied résumé and original portrait assets remain unaltered.

## Verification

- `npm run lint`: passed, zero warnings.
- `npm run type-check`: passed.
- `npm test`: 39 passed, covering catalog identities, reviewed stack corrections, source provenance, original assets, retrieval, assistant validation/errors, and quota admission/settlement.
- `npm run build`: Vite production client plus React pre-rendering of home, archive, and 404 passed.
- `npm run test:prerender`: 18 passed, covering five chapters, matching navigation, four visible case studies, disclosure nesting, tab relationships/key handling, image attributes, clean copy/URLs, exact code excerpt lines, contrast tokens, complete archive HTML, archive GET/HEAD, crawler parity, every HTML/CSS asset, JavaScript syntax/serving, IDs/anchors, metadata, and 404 behavior.
- Core text/muted/accent tokens against base/card/raised surfaces: minimum contrast 7.79:1. This is a token calculation, not a whole-page accessibility certification.
- API tests use synthetic generators and mock provider responses. No paid model call is needed for these checks. Loopback tests were run with local network access after Windows sandbox EACCES errors.

`node scripts/verify-production.mjs` checks deployed generated content, crawler parity, archive routing, asset SHA-256 against the local production build, 404 behavior, and API health. It writes an ignored machine-readable report to `tmp/recruiter-production-verification.json`. A successful health response confirms the endpoint responds; it does not by itself prove a real provider generation.

## Manual review boundary

Browser layout, actual tab clicks, mobile navigation/focus behavior, contact/mail application handoff, and live AI output remain for the user's browser review. Code and HTTP checks do not establish screenshot fidelity, zero layout shift, Core Web Vitals, or physical-device performance.
