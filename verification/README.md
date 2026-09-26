# Implementation verification

> Current cinematic revision: see [cinematic-2026-09-26.md](cinematic-2026-09-26.md) for the latest implementation and partial browser-verification status. The results below describe the earlier redesign.

Implemented and verified locally on 25 September 2026, with a fresh brief audit, keyboard improvements, and production-browser recheck on 26 September 2026. Environment: Node 26.5.0, npm 12.0.1, and the Codex in-app Chromium browser. Production preview: http://127.0.0.1:4173/. This is local verification; no deployment was performed.

## Automated checks

- `npm run lint`: passed with zero warnings.
- `npm run type-check`: passed with strict TypeScript checking.
- `npm test`: four tests passed, zero failed. Checks cover preservation of the original 26-project catalog, unique project IDs and HTTPS destinations, exact resume and image assets, and SEO metadata.
- `npm run build`: passed with Vite 7.3.6. Output JavaScript: 325.64 kB (107.14 kB gzip); CSS: 30.99 kB (7.39 kB gzip). Fonts are self-hosted.
- `git diff --check`: passed.
- The dependency installation following the Vite upgrade reported zero vulnerabilities. No Lighthouse performance or accessibility score was measured.

## Browser verification

The production build was exercised, including the following flows:

- Layout at viewport widths 320, 375, 430, 768, 1024, 1440, and 1920 pixels. Document scroll width equals document client width at every size: no horizontal overflow. See the fresh measurements in `responsive.json`. Both lazy-loaded project screenshots were also verified complete with nonzero natural width, and visually inspected in their sections.
- Correct section order: hero, featured projects, about, experience, additional projects, skills, workflow, contact.
- Mobile navigation opens and closes, traps keyboard focus, makes background content inert, restores focus on Escape, and navigates to the selected section.
- Four featured case studies and all 22 additional projects are accessible. Show more exposes all archive entries and disappears when complete.
- After keyboard activation of Show more, focus moves to the first newly revealed heading: Deep Learning Project at 12 visible entries, and DRF Advanced Project when the final batch brings the count to 22. Reset filters restores six entries and focuses the search field. These focus corrections were added and verified on 26 September.
- Category filtering, technology/name search, no-results state, and reset work. Searching WebRTC returns Zoom Clone.
- Case-study disclosures open by click and close using the keyboard.
- Contact draft generation produces the expected encoded email recipient, subject, and body. The page explicitly states that nothing has been sent. Editing invalidates the previous draft; copying the email address works. No email was sent during testing.
- Empty contact submission focuses the required name field, marks name/email/message invalid, and creates no draft link.
- The styled unknown-route page returns to the portfolio.
- Reduced-motion emulation disables smooth scrolling and hero mesh transforms.
- No warning or error console messages were observed during the production checks.

## Accessibility

Desktop (1280 px) and mobile (375 px) axe runs each recorded 31 passing rules and zero reported violations in the configured A/AA audit. See `accessibility.json`. Color contrast retains a manual-review item where automated computation is inconclusive; these results are not a complete accessibility certification. Keyboard navigation, mobile focus management, headings, form labels, and reduced motion were also checked.

## Updated resume

The supplied two-page PDF replaces `public/Harsh_Gavand_Resume.pdf` without re-encoding. The source file, public copy, and PDF served over HTTP have identical SHA-256 hashes:

```text
e01a0147dc57cfb330c74c642c57687cec8657cede39440a76cabbc590dc195b
```

The served response was HTTP 200, `application/pdf`, 114,292 bytes. Both PDF pages were rendered and inspected. Profile information was reconciled with the supplied resume.

## Follow-up implementation

The repeated redesign brief was compared against the existing implementation on 26 September. All original project data remains preserved. The featured presentation was extracted into the reusable `ProjectCaseStudy` component, and keyboard focus behavior was corrected for archive expansion and empty-state reset. Lint, type-check, all four tests, and the production build pass after these changes. Fresh desktop/mobile axe results still report zero violations, and the production browser has no captured warnings or errors.

## External destinations

See `link-checks.json` for the HTTP observations. All 26 original GitHub project links returned HTTP 200. Four of six original demo links returned HTTP 200. Zoom Clone and the PERN demo timed out; the Zoom browser visit also failed after its hosting wake-up screen. Their original destinations are preserved. HTTP availability does not establish authenticated workflows or the complete behavior of those external applications.

Real public Banking and GitHub Replica screens were captured for the portfolio. UGC and the backend digest use explicitly labeled implementation diagrams instead of invented product screenshots.

## Reproduction

```sh
npm ci
npm run lint
npm run type-check
npm test
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

Optional external-link recheck: `python scripts/check-links.py`. Hosting availability can change after this verification.

