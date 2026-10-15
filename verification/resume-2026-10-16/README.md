# Résumé and portfolio refinement verification

Production origin remains `https://harshgavand.dev` on Vercel. The user's latest attachment and pasted specification explicitly restore résumé access, replacing the earlier instruction to remove it.

## Attached document

- Source: `Harsh Gavand Resume.docx.docx`, opened read-only and exported by Microsoft Word as `public/resume.pdf`.
- Source SHA-256: `266fa364960ed0b75c37b5ddb8b93ffecfd66d7cfaa385bc8e9bd76a1d7d509a`.
- PDF SHA-256: `0980850be4aeccbdab139d5968342081d4460163735da46183f0c916180039af`.
- Two tagged, unencrypted pages. Both page images were checked for legibility, clipping, and overlap. Text extraction matches all source text after normalizing whitespace, Unicode compatibility forms, and automatically rendered bullet glyphs. Ten hyperlink annotations remain.
- The original document's content and layout are preserved, including the existing project paragraph continuing onto page two. The editable Word source and QA page images remain outside the published assets.

## Implementation

Résumé links appear in the desktop header, mobile navigation drawer, hero, contact, and assistant's validated source mapping. Native external-link behavior uses a new tab and `noopener noreferrer`. Contact copy feedback is visible and announced through the existing status region.

The hero defaults to Request Lifecycle Trace and has Implementation as its second tab. Scenario durations are illustrative. Pre-dispatch abort releases the reservation; unknown upstream usage stays reserved. The actual backend only enqueues settlement retry when usage is known, so the timeout panel does not claim an unknown-cost request enters that worker.

Flagship summaries are concise, architectural bullet leads use semantic strong emphasis, repeated card footer text is removed, and each five-stage diagram supports pointer, click, and keyboard-focus activation. The selected stage exposes a linked contract/detail status callout. Experience keeps the supplied HRP metrics; no Globetrek metrics are invented. Skills use four capability groups while preserving the existing technology coverage.

Background demo warm-up is best effort: deduplicated HTTPS Render origins, idle/timeout scheduling, credentials/referrers omitted, failure isolation, Save-Data support, and abort/cancellation on cleanup. No warm-up requests run in server rendering or the tests.

The existing static `/archive/index.html` output and Vercel routing already support direct requests. A catch-all SPA rewrite and another provider's `_redirects` file are unnecessary and would weaken the real 404 behavior. Canonical, robots, sitemap, and social metadata remain on the custom domain.

## Quality gates

Node 24: lint and TypeScript pass; all 76 application tests and 24 prerender/HTTP tests pass. Production build prerenders the homepage, the 38-project archive, and the real 404. Tests cover PDF bytes/MIME, link safety, default trace state, ARIA targets, keyboard navigation logic, stage controls, demo-origin filtering and failure isolation, generated asset delivery, and canonical metadata.

Website verification is code/build/HTTP only, following the user's existing browser-review preference. Browser console, visual device review, real demo warm-up behavior, and assistive-technology testing are not claimed. No paid model calls are made.
