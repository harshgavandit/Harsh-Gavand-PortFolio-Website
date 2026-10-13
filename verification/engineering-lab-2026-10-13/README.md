# Engineering Lab redesign — 13 October 2026

## Reference observations and design decisions

Inspected Prince Singh's [home](https://www.princesinghdev.com/), [dashboard](https://www.princesinghdev.com/dashboard), [AskDSA showcase](https://www.princesinghdev.com/lab/askdsa), [experience](https://www.princesinghdev.com/experience), and [stack](https://www.princesinghdev.com/stack). Browser exploration covered the home composition, dashboard onboarding and sidebar, project showcases, and the AskDSA low-level architecture tab. This was design research, not verification of every reference demo or its AI backend.

Useful patterns were category-based project discovery, persistent engineering navigation, architecture alongside product explanations, technical notes, and contextual AI entry points. This implementation adapts those patterns to an original light palette, cobalt 3D sculpture, glass panels, compact identity, and an embedded workspace. Harsh's work leads the page; no oversized name banner returns. No reference branding, achievements, telemetry, or project content was copied.

## Implementation

- Existing React / TypeScript / Vite, Three.js, Framer Motion, and Node / Gemini stack reused; no dependencies added.
- `DeveloperLab` provides all 26 projects, category filters, search and empty states, project selection, keyboard detail tabs, existing source/demo links, and full case-study anchors.
- `ProjectArchitecture` provides selectable implementation nodes, contribution inspection, optional guided tour, reset, and reduced-motion/offscreen/hidden-tab controls. Non-featured projects explicitly show technology maps rather than undocumented architectures.
- `PortfolioIntelligence` and project buttons prefill the real assistant for visitor review. Server knowledge now includes the relevant existing case-study notes. API keys stay on the server; existing origin checks, limits, timeouts, source validation, and safe failures remain in place.
- Hero, navigation, experience, skills, about, archive and contact receive the final `lab.css` treatment. Skills link back to matching dashboard projects.
- Source content, original assets, all project records, resume, metadata and existing contact behavior are preserved.

## Verification

Fresh final command run: lint passed, TypeScript passed, **21 tests passed / 0 failed**, production build passed, `git diff --check` passed. Tests include catalog preservation, assets and SEO, HTTP validation and rate limiting, production static serving, provider failure handling, trusted context, source mapping, and the added case-study context assertions.

Browser checks:

- WebGL hero rendered; discipline controls and dashboard interactions explored.
- Dashboard search, empty state, category filter (12 AI projects), UGC and AI digest selection, architecture nodes, tour/pause, and keyboard tab navigation exercised. Engineering tab displayed the selected project's challenge, implementation, and outcome.
- A real UGC-specific Gemini question returned an answer and canonical source references. Evidence: `assistant-live.txt` and `assistant-live.jpg`. This confirms that request worked locally; it does not guarantee future provider quota or public deployment configuration.
- Responsive DOM checks at 320, 375, 430, 768, 1024, 1440, and 1920 px found no horizontal document overflow (`responsive.json`). Mobile menu and project navigation were exercised.
- axe WCAG 2 A/AA and 2.1 A/AA: desktop **33 passes / 0 violations**, mobile **33 passes / 0 violations**. The reports retain incomplete checks for conditional ARIA references and layered color contrast; these automated scans are not a complete accessibility certification.
- Emulated system reduced motion: architecture tour disabled, and zero running Web Animations at the observed state.
- Forced WebGL context loss: hero switched to `data-scene="fallback"` and disabled unavailable rotation controls. Reload restored normal rendering. Low-power early-loading guard inspected in source; no physical low-power device benchmark was run.
- Browser console inspection after normal reload reported no errors in the captured log window.

## Build and performance limits

Production output: main JavaScript 377.58 kB / 122.51 kB gzip; CSS 164.01 kB / 33.71 kB gzip; lazy Three.js renderer 550.17 kB / 138.10 kB gzip. The build retains Vite's >500 kB warning for the independently loaded renderer. Self-hosted font files are 22.29 and 48.26 kB.

The renderer is lazy, limits DPR, pauses offscreen/in background, and skips constrained devices. Existing layered CSS is retained to limit regression risk. No Lighthouse score, real-device frame-rate result, network-throttling score, or production load test is claimed. External demos and source URLs were preserved, not exhaustively revalidated. This report records local verification before the GitHub delivery. Production deployment behavior was not verified.

## Visual evidence

- `hero-desktop.png`: project-first hero and 3D canvas.
- `dashboard-desktop.png`: interactive project workspace.
- `architecture-desktop.jpg`: selected architecture inspection.
- `intelligence-desktop.png`: contextual AI section.
- `assistant-live.jpg`: successful local provider response.
- `mobile-architecture.jpg`: mobile architecture view.
- `axe-desktop.json`, `axe-mobile.json`, `responsive.json`: machine-readable browser evidence.
