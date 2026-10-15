# Engineering Studio redesign — 15 October 2026

## Scope and design decisions

Reviewed the running hero, project discovery, About, experience, skills, workflow, contact and assistant surfaces. The previous presentation combined cyan/violet glow, a clipped framed sculpture, a dense initial project dashboard and repeated long case studies. The new direction uses graphite surfaces, warm ivory type, a citrus accent, open sculpture composition, clearer editorial hierarchy and technical depth revealed on demand.

The 26-project catalog, four case studies, supplied images and resume, employment dates, skills, recognition and backend contracts are retained. Globetrek bullets were clarified from the existing resume content without adding metrics. The recognition label now spans its own row, with three aligned entries below it.

## Implementation

- Rebuilt the hero's typography, copy hierarchy, calls to action and 3D framing.
- Replaced the first project interaction with four native, keyboard-operable exhibits. Full walkthroughs and implementation details remain inside each exhibit. The searchable engineering index remains available through its own disclosure.
- Direct project fragments reveal the correct case study. Skill evidence opens the index and selects its project.
- Unified the material palette across the page, walkthroughs, workflow, contact form and assistant. Removed the duplicate floating social control; social links remain in the footer and mobile menu.
- Matched the navigation's CSS and JavaScript desktop breakpoint at 900px. Preserved Escape, focus trapping and background inert cleanup. Navigation no longer highlights About while reading unrelated later sections.
- Corrected the high-DPI canvas's CSS size, reduced sculpture geometry and material cost, removed transmission rendering, and capped decorative drawing at 30 fps. Visibility and reduced-motion controls remain in place.
- A WebGL failure hides the failed canvas and reveals the decoded local still. Viewpoint controls disable while discipline information remains usable.
- Fixed narrow-screen intrinsic grid widths in the engineering index and assistant introduction. Mobile text fields use 16px type to avoid focus zoom on phones.
- Added fixed-header offsets for experience chapters and supplemental section fragments.
- Excluded temporary backup and verification directories from Vite's watcher after a locked backup file caused an EBUSY crash.

## Verification

Final local commands passed:

- `npm test`: 36 passed, 0 failed. HTTP tests ran with localhost access; provider and quota dependencies are controlled fixtures.
- `npm run lint` and `npm run type-check`: passed.
- `npm run build`: passed. The dynamically loaded renderer is approximately 547 kB minified / 138 kB gzip and still triggers Vite's 500 kB advisory. It remains separate from the main JavaScript chunk.

Browser evidence is in [browser-checks.json](browser-checks.json). It records 42 passing checks against the running local application for case-study keyboard opening, chapters and closing, index search/tabs/empty state, skill-to-project selection, archive search/reset/pagination, mobile menu resize/Escape/inert cleanup, contact draft generation/invalidation, assistant prefill/clear/Escape, manual/system motion controls, forced WebGL loss and still-image recovery, direct project fragments, workflow and engineering layer controls, and navigation state.

Responsive bounds were checked at **320, 390, 600, 768, 820, 1024, 1440 and 1920 pixels**. The final check found no horizontal document overflow or out-of-bounds visible headings, paragraphs, form inputs, buttons or summaries at those widths. The expanded engineering index was additionally exercised at 320 pixels.

Axe WCAG 2 A/AA and WCAG 2.1 AA tag scans reported **zero detected violations** on the desktop page, mobile page and open mobile assistant. Page scans retained incomplete ARIA/contrast checks and the dialog retained incomplete contrast checks; these are not a claim of full accessibility conformance. Keyboard flows were exercised separately. No browser console errors were observed in the final inspected tab; the graphics driver emitted shader precision warnings and Framer Motion emitted its expected reduced-motion diagnostic during that test.

An independent source review found an experience-fragment header overlap, which was fixed and checked in the browser. No additional concrete source regressions were reported by that review.

The local UI and API were started as hidden background processes. The proxied `/api/health` returned HTTP 200 with configuration present. A health response does not prove live provider connectivity.

The final `dist` output was also loaded through the Node server at port 3001. The expected hero and dynamically imported WebGL renderer were present, with no browser console errors in that production-preview tab. A scan of the built JavaScript/CSS found neither configured server secret in client assets. `git diff --check` passed.

## Screenshots

Before:

- [Desktop hero](01-before-desktop.png)
- [Project entry](02-before-projects.png)
- [About](03-before-about.png)
- [Mobile hero](04-before-mobile.png)

After:

- [Desktop hero](12-final-desktop-hero.png)
- [Mobile hero](10-final-mobile-hero.png)
- [Project exhibits](13-final-project-exhibits.png)
- [Recognition alignment](07-recognition-aligned.png)
- [Globetrek bullets](08-globetrek-bullets.png)
- [Skills](15-final-skills.png)
- [Workflow](14-final-workflow.png)
- [Mobile assistant](11-final-mobile-assistant.png)
- [WebGL fallback](09-webgl-fallback.png)
- [Assistant introduction at 320px](16-final-intelligence-320.png)
- [Built application through Node](17-production-preview.png)

## Evidence limits

This report covers local verification. No deployment, live Redis invariant test or fresh paid OpenAI generation was performed during this redesign. The existing assistant/quota tests passed and its dialog controls were exercised, but live service availability is not established by these fixtures. No physical-device, Safari/Firefox, exhaustive screen-reader, or hardware performance benchmark was performed. The 30 fps renderer cap is an implementation limit, not a measured guarantee for every device. These captures show the local Chromium-based preview. GitHub delivery is recorded separately in the repository history.
