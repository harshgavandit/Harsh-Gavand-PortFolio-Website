# Cinematic portfolio implementation — 26 September 2026

The cinematic implementation is present in the working tree. Final build validation passed; the final browser acceptance pass remains partially blocked by the account usage limit in automatic approval review.

## Implemented

- Real portrait from the user-supplied `Harsh Photo.jpeg`, copied unchanged to `public/portrait/harsh.jpeg` (60,762 bytes). CSS supplies the frame, grayscale treatment, depth, lighting, reveal, and parallax; no generated person or altered image file is used.
- Shared spring-based pointer tilt and lighting for portrait and project mockups. Touch input does not trigger pointer tilt.
- A small, lazily loaded WebGL engineering-grid light. Rendering is capped near 30 fps, uses a bounded canvas resolution, stops offscreen/when hidden, and is omitted at mobile initialization or when motion is disabled. A CSS grid remains as fallback.
- Global motion control plus OS reduced-motion handling across reveals, magnetic interactions, portrait, workflow, and project walkthroughs.
- Four contribution-based project walkthroughs with manual chapters and explicit play/pause/replay. Playback ends after one sequence and pauses offscreen, on tab hiding, or when motion is disabled. Real screenshots and explicitly labeled implementation maps are preserved.
- A compact featured-project index and a six-stage interactive workflow. Workflow selection supports arrow keys, Home, End, manual override, and explicit resume of scroll storytelling.
- All 26 original project records, existing links, contact draft behavior, resume, experience, and supporting content remain preserved.

## Fresh terminal validation — final build

- `npm run lint`: passed, zero warnings.
- `npm run type-check`: passed.
- `npm test`: 5 passed, 0 failed, including catalog preservation, resume integrity, and exact supplied-photo SHA-256.
- `npm run build`: passed with Vite 7.3.6.
- `git diff --check`: passed (Git reports only LF-to-CRLF normalization notices).

Final output: main JavaScript 340.88 kB / 112.04 kB gzip; lazy WebGL chunk 2.97 kB / 1.51 kB gzip; CSS 52.83 kB / 11.77 kB gzip. No new runtime dependencies were added. These bundle figures are not a Lighthouse or field-performance score.

## Browser checks completed during this implementation

Production preview was exercised in the in-app Chromium browser:

- Real photo and desktop/mobile layout visually inspected. A native CDP screenshot verified the 375 px layout.
- Global pause removes the WebGL canvas, disables automatic walkthrough playback, and uses immediate scrolling. Manual project chapters still work.
- Project chapters display the corresponding existing contribution text. An explicit playback completed all three chapters and reached Replay walkthrough / Walkthrough complete.
- Workflow selection advances to Backend / APIs; scrolling preserves manual selection; Resume scroll story restores automatic following. End key selects Deployment and focuses its control. Global pause disables scroll following.
- Mobile menu traps initial focus, makes main content inert, and restores focus to Open navigation after Escape.
- Desktop axe A/AA run: 30 passing rules, zero violations; color contrast retains a manual-review item. This was performed before final small CSS/index/map refinements.
- No warnings or errors were captured in the inspected production session.
- Document widths matched scroll widths at 320, 375, 430, 768, 1024, 1440, and 1920 px. Some decorative portrait outline bounds extend outside their section but are clipped; no document-level horizontal overflow was measured. The final compact portrait layout was subsequently inspected at 375 px.

## Incomplete acceptance checks

Automatic approval review rejected the attempted final mobile axe and OS reduced-motion browser check with an account usage-limit message. The command did not run; do not treat it as a passing audit. The browser remained in a temporary 375 x 812 testing viewport when review was blocked.

Remaining work after browser tools become available:

1. Reload the final production build; complete mobile axe and OS reduced-motion checks.
2. Verify final walkthrough node mappings and the featured-project index in the browser.
3. Record final performance measurements (Lighthouse scores have not been measured).
4. Capture final desktop/mobile evidence and reset temporary browser viewport overrides.

No deployment, push, or commit was performed. Prior verification files describe earlier iterations; this document is the current cinematic-pass status.
