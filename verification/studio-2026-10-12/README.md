# Engineering studio redesign — 12 October 2026

## Reference analysis
Inspected https://www.yashmahamulkar.dev/ in a live browser. Observed a dark/orange orbital hero with a black-hole visual, animated role text, a project log, expandable project flight records, category controls for skills, and an AI terminal launcher. Opened the ReScapeAI flight record and inspected its preview, stack, project links, and mission notes. The visual concept inspired depth, discovery, and layered interactions; no reference code or artwork was copied. The new direction is a unique white/blue engineering studio aligned with Harsh's Full-Stack and AI identity.

## Delivered
- Procedural Three.js sculpture, orbital rings, satellites, stacked system layers, pointer-responsive orientation, and selectable Interface / Systems / Applied AI compositions.
- Hero scroll parallax, scroll-triggered section reveals, pointer-tilt project cards, perspective previews, navigation indicators, skill micro-interactions, and dimensional workflow.
- New user-supplied photograph in About, copied unchanged to public/portrait/harsh-studio.jpg. SHA-256: d588f408c446e4cef1588f8bf0ae3cf1f2cb6a0ef5b052ee910903c51d5c2686. Original photograph retained.
- All original 26 project records, four case studies, experience, skills, resume, contact draft functionality, and Gemini assistant preserved.
- Updated README, including the Render build command with --include=dev.

## Verification
- TypeScript, ESLint, production build, and git diff --check passed.
- 21 regression tests passed, including catalog, resume and both portrait fingerprints, API validation, origin checks, limits, provider errors, and static serving. Initial loopback tests were blocked by the execution sandbox; rerunning with local socket access passed.
- npm reported an existing source-map-js advisory during installation. Applied the compatible patch; npm then reported zero vulnerabilities.
- Browser verified the production build at http://127.0.0.1:4180/: real WebGL canvas, new image, and Gemini-generated answer with canonical project source links. mobile-assistant.png records the live answer.
- Checked widths 320, 375, 430, 768, 1024, 1440, and 1920; no horizontal document overflow. Details in responsive.json. Desktop gallery uses two columns; phone gallery uses one.
- Desktop/mobile axe WCAG 2 A/AA and 2.1 AA scans: 30 passing rules, zero violations. Three incomplete rule categories require human judgment; this is not complete accessibility certification.
- Verified keyboard activation of discipline controls, mobile navigation closure and About focus, assistant Escape dismissal, and archive search for Agentic.
- Instrumented WebGL draw calls: manual motion pause held draw count at zero; enabling animation produced draws; offscreen count remained 1782 before/after observation.
- Emulated OS reduced motion: motion off, system-following control disabled, discipline controls still update. Forced WebGL context loss: CSS fallback remained visible and controls/content remained available. Removed instrumentation/emulation by reloading.

## Performance and limitations
Three.js is a separately loaded chunk triggered near the hero viewport; pixel ratio capped at 1.5; no external 3D model/texture downloads or postprocessing. Rendering stops offscreen, when hidden, and when paused. Geometry, materials, listeners, observers and the WebGL context are disposed on unmount.

Production build: main JS 351.58 kB / 114.83 kB gzip; lazy 3D chunk 533.72 kB / 133.77 kB gzip; CSS 100.49 kB / 20.87 kB gzip. Vite reports the expected >500 kB warning for the separately loaded Three.js chunk. No measured FPS, Lighthouse/Core Web Vitals, physical mobile GPU or Safari/Firefox certification is claimed. Browser evidence is Chromium-based. Render's deployed version was not verified as part of this redesign.

## Evidence
- desktop-hero.png: 3D hero and controls
- desktop-projects.png: staggered perspective gallery
- desktop-portrait.png and mobile-portrait.png: new photograph
- mobile-hero.png and mobile-assistant.png: mobile presentation and live AI response
- webgl-fallback.png: graceful context-loss fallback
- responsive.json, axe-desktop.json, axe-mobile.json: automated browser observations
