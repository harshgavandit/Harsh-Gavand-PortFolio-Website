# Engineering Studio redesign implementation plan

**Goal:** A distinctive, responsive developer portfolio that makes genuine work easy to inspect, with deliberate typography, interactive 3D, and a coherent graphite/ivory/citrus design system.

**Architecture:** Preserve the React page, content sources, routes, assistant and backend. Replace the active presentation, rebuild the hero and introduce a curated project entry layer with progressively disclosed technical detail. Use existing Three.js and Framer Motion, native scrolling and native details controls.

**Execution:** Native implementation in the existing dirty checkout, explicitly authorized autonomously by the user. Preserve pre-existing source changes. No publishing, credentials, provider calls, or new product dependencies are required.

## Constraints

- Preserve the 26-project catalog, all four case studies, experience, skills, recognition, supplied portraits and resume.
- Keep assistant, search/filter, skill-to-project navigation, walkthroughs, contact drafts and source/demo links functional.
- No invented achievements or metrics. Model and Redis configuration remain unchanged.
- Reduced motion, keyboard operation, narrow screens and WebGL failure must retain usable content.

## Tasks

- [x] Capture and inspect current desktop, project, About and mobile screens; record the critique.
- [x] Rebuild hero, 3D composition and project storytelling. Reproduce menu resize behavior before fixing its breakpoint and focus behavior.
- [x] Replace visual system across navigation, projects, experience, skills, profile, archive, workflow, contact and assistant. Optimize WebGL materials and animation scheduling.
- [x] Browser checks at 320, 390, 768, 820, 1024 and 1440 pixels; navigation, search, case-study disclosures, skill links, keyboard controls, assistant prefill and contact draft. Inspect screenshots, logs and motion/fallback states.
- [x] Run tests, lint, type-check and production build. Update README and verification evidence to describe the actual result and remaining limits.

## Review focus

- An open mobile menu must close when resized to desktop and release background inert/scroll lock.
- A project hash or skill link must open its containing disclosure and retain a visible target.
- Reduced motion disables continuous animation without removing information or controls.
- Small widths must wrap long labels/email/technology lists without horizontal scrolling.
- Failed/disabled WebGL must preserve discipline controls and a visible still.

## Initial critique

The inspected desktop hero uses competing cyan/violet gradients and a clipped framed sculpture; the first selected-work view is a dense tool dashboard before the visitor sees the work. Large repeated case studies lengthen the page. The About surface mixes glow-heavy panels and low-contrast headings. Mobile pushes the interactive hero below several paragraphs and stacked actions. The redesign will use one accent, stronger type hierarchy, open negative space, a complete sculpture composition and progressively disclosed project depth.
