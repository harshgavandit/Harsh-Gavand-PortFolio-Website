# Signal Studio implementation plan

**Goal:** Make the current portfolio feel like a considered interactive exhibition while making real engineering evidence easier to inspect.

**Brief:** The user authorized autonomous design, implementation, testing, iteration and GitHub delivery. Preserve all 26 projects, four case studies, resume, employment information, recognition, contact and assistant contracts. Keep native scrolling, motion preferences, keyboard access and a usable graphics fallback. Reuse the existing React, Three.js and Framer Motion dependencies.

**Design decision:** An editorial graphite and warm ivory composition, restrained citrus light, larger deliberate typography, an original kinetic frame sculpture and asymmetric project exhibits. Choose this over a minor cosmetic pass or an effects-heavy presentation, because the present weaknesses are hierarchy, repeated framing and page pacing.

**Observed baseline:** At 1280 x 720 the default page is approximately 11,000px tall. The hero has redundant metadata and an abstract orbital object. Experience and About contain useful evidence, while the 1,920px workflow repeats conceptual material. Current audit captures are in verification/signal-2026-10-15.

## Implementation

- [x] Rebuild Hero and StudioScene composition. Replace studioRenderer's orbital model with shared rounded-frame geometry that assembles into three distinct arrangements. Retain mouse drag, viewpoint buttons, lazy import, visibility pause, motion preferences and disposal.
- [x] Add deliberate pointer and scroll response, progressive section reveals and hover treatment without hiding content from reduced-motion users.
- [x] Recompose project exhibits with asymmetric sizing and more useful labels. Keep case-study disclosures, source links, engineering index, deep fragments and skill navigation.
- [x] Reorder experience before the assistant introduction; integrate the redundant engineering bridge into the process disclosure. Compact workflow with an active explanation and an optional full six-step story. Preserve its stage selection, keyboard controls and scroll mode.
- [x] Refine section pacing, typography, surfaces, fixed-header offsets and narrow-screen navigation, contact and assistant presentation in the existing active stylesheet.
- [x] Capture the actual new WebGL object as its local still. Test graphics loss, motion off, keyboard interactions, all content flows and responsive widths 320-1920px.
- [x] Run regression tests, lint, type-check, production build, accessibility scan and client credential checks. Document evidence and limits, independently review changes, fix findings, and prepare verified GitHub delivery.

## Review focus

- Deep fragments must open their disclosure and clear the fixed header.
- The new sculpture must render a complete stable still when motion or graphics are unavailable.
- Manual workflow selection must hold until scroll mode is explicitly resumed.
- Compacting the page must retain access to every original case study, workflow step and project entry.
- Touch scrolling, mobile menu cleanup and contact/assistant focus must continue to work at 320px.

## Execution record

- Reused the existing checkout and dependencies; no provider or quota code changed. Native details preserve the complete archive, process, technical layers and project disclosures.
- Independent review found phone workflow labels and the expanded preview needed refinement. Three-column 58px phone controls and sticky preview from 651px upward resolve both; browser measurements confirmed them.
- The user directed social icons to the header corner and requested footer formatting. Header social links now participate in the mobile focus trap; the responsive footer clears the assistant.
- Existing automated suite: 36 passed. Browser evidence: 50 passed checks; 11 responsive widths. Production build and local Node preview verified. See verification/signal-2026-10-15/README.md for exact limits.
- Delivery follows the user’s standing authorization to commit and push all completed code to the existing GitHub main branch. The commit history records publication.
