# Engineering Atelier — redesign verification

Completed 13 October 2026 in the existing React/TypeScript/Vite portfolio.

## Design research and decisions

Reference: https://www.yashmahamulkar.dev/ (inspected in the browser on 12–13 October 2026). Observed a dark star field, orange orbital/black-hole centerpiece, animated role text, compact navigation, categorized skills, and a project log opening detailed flight-record dialogs. Inspected the ReScapeAI project dialog; reference-project.jpg records the interaction. These observations describe the visible experience, not an assertion about its implementation libraries.

The adaptation uses a distinct light engineering atelier: cool white surfaces, ink typography, cobalt accents, a procedural kinetic knot, oversized personal wordmark, an exploded interface/systems/AI exhibit, and alternating project presentations. Existing project details and native dialog interactions remain accessible from each exhibit. No reference-site code, assets, personal achievements, or project claims were copied.

Technical references consulted:
- https://threejs.org/manual/pages/responsive.html — constrain drawing-buffer resolution and respond to layout changes.
- https://threejs.org/manual/pages/rendering-on-demand.html — avoid unnecessary rendering when visual state is static.
- https://www.w3.org/WAI/WCAG22/Techniques/css/C39 — honor the system reduced-motion setting.

## Implementation

- Hero.tsx: new editorial composition, staggered title reveal, scroll-reactive wordmark, portfolio/contact/assistant entry points.
- studioRenderer.ts: procedural cobalt torus-knot sculpture, reflective materials, orbit paths, AI core, and layered platform. Discipline selection changes orientation and the assembly; pointer drag and accessible rotation buttons remain available.
- StudioScene.tsx: revised scene presentation and a 1.7 KB local SVG fallback, replacing the larger poster in the hero. Removed React 18's unsupported camel-case fetchPriority attribute.
- EngineeringBridge.tsx: interactive three-layer CSS 3D exhibit with descriptive content, pressed-state buttons, scroll perspective, and reduced-motion support.
- atelier.css: isolated final visual theme for hero, exhibit, gallery, profile, experience, archive, skills, workflow, contact, and responsive layouts.
- SpatialAtmosphere.tsx: removed the unused decorative raster download.
- Work.tsx: gave the named gallery an explicit group role.

Existing project and profile data, experience, education, recognition, résumé and portrait files, routes, public links, filters, walkthroughs, contact preparation, and Gemini server implementation are preserved. No dependency additions or hosting changes.

## Automated verification

- npm test: 21 passed, 0 failed. Includes project fingerprint, résumé and portrait integrity, SEO, assistant input validation, API contracts, and mocked Gemini behavior. The first sandbox run blocked loopback sockets; the approved loopback-enabled rerun passed.
- npm run type-check: passed.
- npm run lint: passed.
- npm run build: passed; 2,065 transformed modules.
- git diff --check: passed.

Final production bundle (Vite output):
- Main JS: 364.51 KB / 118.39 KB gzip.
- Dynamically imported Three.js scene: 550.17 KB / 138.10 KB gzip.
- CSS: 141.70 KB / 29.33 KB gzip.
- Self-hosted font files: 22.29 KB and 48.26 KB.

Vite reports its standard warning for the scene chunk above 500 KB. The scene is already dynamically imported near the viewport. Its render loop pauses offscreen and when the document is hidden, and uses a capped pixel ratio; paused/reduced-motion mode renders on demand. These are implementation safeguards, not a measured mobile performance score. No Lighthouse or physical-device frame-rate claim is made.

## Browser verification

Local browser preview used http://127.0.0.1:5181/. This verifies the local implementation, not a public deployment.

- Actual WebGL canvas rendered the kinetic sculpture.
- Systems selector changed the scene state to discipline 1 and updated the caption.
- Rotation button worked; the existing drag implementation was retained.
- Engineering layer selector changed the active plate and description to The foundation.
- Project viewer opened UGC, advanced to Banking App SaaS, closed with Escape, and restored focus to the launching button.
- Mobile menu navigated to Skills; AI/LLM selected correctly and ArrowRight switched to DevOps/Cloud.
- Archive search for Agentic returned Agentic AI System. An unmatched query returned zero results. Clearing restored the archive.
- Contact form prepared the expected mailto draft with test values; nothing was sent. Test input was removed by reload.
- Assistant dialog opened with its expected controls and provider disclosure. No fresh Gemini generation was requested during this visual redesign.
- Manual motion pause set data-motion=off. Emulated prefers-reduced-motion also disabled motion and disabled the manual override, as intended. Browser emulation was reset after testing.
- Simulated WebGL context loss switched the scene to fallback, disabled rotation controls, and displayed the loaded SVG (natural width 848). A page reload restored WebGL. The first hot-reload check had stale image state; final evidence is from a clean page load.
- Responsive DOM checks at 320, 375, 430, 768, 1024, 1440, and 1920 CSS pixels found no horizontal document overflow. See responsive.json. Mobile visual inspection also used 390 × 844.
- Desktop/mobile axe scans: 32 passing rules and zero violations in the configured WCAG 2 A/AA and WCAG 2.1 A/AA tag set. Final mobile audit was run with motion paused to avoid measuring an in-progress opacity transition. Small layer index contrast was corrected during QA. Two rule categories retain incomplete/manual-review results: hidden-dialog ARIA reference and contrast involving layered/transparent imagery. These scans are not full accessibility certification.

## Evidence inventory

- desktop-hero.jpg: redesigned hero and signature.
- desktop-engineering.jpg: interactive exploded engineering layers.
- desktop-projects.jpg: featured-project presentation.
- desktop-profile.jpg: portrait and preserved profile.
- desktop-experience.jpg: professional experience.
- desktop-contact.jpg: contact form and footer.
- mobile-hero.jpg: narrow-screen introduction.
- mobile-skills.jpg: keyboard-selected skill category.
- mobile-assistant.jpg: retained assistant dialog.
- webgl-fallback-mobile.jpg: SVG fallback following context loss.
- reference-project.jpg: reference-site project detail interaction.
- responsive.json: seven-width overflow observations.
- axe-desktop.json / axe-mobile.json: final accessibility scan results.

## Run locally

From the repository, use npm run dev for the API and UI together. The default ports are 3001 and 5173. For UI-only preview on an alternative port, use npm run dev:ui -- --host 127.0.0.1 --port 5181 --strictPort. AI generation requires the existing API and server-side provider configuration described in the root README.
