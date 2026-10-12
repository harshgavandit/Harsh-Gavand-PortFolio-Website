# Immersive portfolio validation — 12 October 2026

## Design research and implementation

The [reference portfolio](https://www.yashmahamulkar.dev/) was inspected for its space-themed hero, project detail overlay, layered composition, and assistant entry point. Captures `01-reference-hero.png` and `02-reference-project.png` record the observed states. The project preview asset was not fully loaded in the reference capture, and reference assistant generation was not verified. No reference code, imagery, or personal content was copied.

The original direction is a light orbital engineering studio: blue reflective rings around a pearl core, floating panels, system layers, and subtle environmental depth. The scene responds to mouse dragging, discrete rotation buttons, discipline selection, and scroll. CSS perspective and Framer Motion connect the remaining sections without adding further WebGL canvases or hijacking native scrolling. The supplied portrait and all existing project/profile data remain unchanged.

Technical research included [Three.js performance guidance](https://threejs.org/manual/en/optimize-lots-of-objects.html), [Motion scroll values](https://motion.dev/docs/react-use-scroll), and [WCAG guidance on animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). Shared geometries/materials, a separate renderer chunk, capped pixel ratio, visibility-based rendering, manual motion control, and reduced-motion handling guide this implementation.

## Verification

- TypeScript, ESLint, production build, and `git diff --check`: passed.
- Regression tests: 21/21 passed with localhost networking enabled. The restricted sandbox initially blocked seven loopback HTTP tests with EACCES; the unrestricted rerun passed. These tests use controlled provider responses, not a fresh live Gemini generation.
- Desktop and mobile axe scans: zero violations for the selected WCAG 2 A/AA and 2.1 AA rule tags. Both report 32 passes and three incomplete rule groups requiring human review; this is not a complete accessibility certification. A project-number contrast issue found in the initial scan was corrected before the saved desktop result.
- Widths 320, 375, 430, 768, 1024, 1440, and 1920: no horizontal page overflow (`responsive.json`).
- Live WebGL rendering verified. Rotation changes the view with continuous motion paused. Systems and Applied AI selection change the scene description/composition.
- Forced WebGL context loss showed the original scene poster and disabled unavailable rotation controls. Discipline content remained usable. Reload restored WebGL (`06-webgl-fallback.png`).
- Emulated `prefers-reduced-motion: reduce` set document motion to `off`; emulation was cleared afterward.
- Mobile menu opens with main content inert and closes after chapter selection. Skill keyboard End selects Tools.
- Production-build project viewer: UGC opens, Next displays Banking App SaaS, Escape closes, and focus returns to the original UGC trigger. Assistant dialog opens and dismisses correctly.
- The last browser pass used the built frontend at `http://127.0.0.1:4185/`. This Vite preview does not provide the assistant API. Backend contracts were covered by tests; no Render deployment or fresh hosted Gemini generation was verified in this design pass.

## Evidence inventory

- `04-before-hero.png`: prior card-contained hero.
- `05-projects-desktop.png`: dimensional selected-project gallery.
- `06-webgl-fallback.png`: safe still composition after simulated context loss.
- `07-skills-mobile.png`: mobile toolkit interaction.
- `08-final-hero-desktop.png`: final 1440 px layout, continuous motion paused for capture.
- `09-final-hero-mobile.png`: final 375 px layout with 3D scene visible in opening viewport.
- `axe-desktop.json`, `axe-mobile.json`, `responsive.json`: automated browser check results.

## Performance and remaining limits

Production output: main JavaScript 363.43 KB / 117.88 KB gzip; separately loaded Three.js renderer 548.77 KB / 137.62 KB gzip; CSS 129.52 KB / 26.89 KB gzip. Vite reports its standard 500 KB chunk advisory for the renderer. The fallback/background PNG is about 162 KB. Fonts are self-hosted, and the 3D scene uses procedural geometry and lighting without remote models or a background video.

No mobile-device GPU benchmark, throttled performance score, exhaustive assistive-technology audit, or cross-browser matrix is claimed. Actual performance varies by device. Production hosting still requires the documented Node service and server-only Gemini environment variables.
