# Signal Studio — 15 October 2026

## Scope and critique

Reviewed the running portfolio, its React components, the active typography and style layers, Three.js renderer, Framer Motion behavior, navigation, four project case studies, engineering index, experience, skills, About/recognition, archive, workflow, contact and assistant. The goal is to help a recruiter or collaborator understand Harsh's actual work while giving the presentation a distinctive interactive identity.

The baseline had useful content and functional technical depth. Its weaknesses were broad hero copy, competing labels around an orbital sculpture, similarly weighted project cards, repeated process messaging, and a long default reading path. The 1280px-wide baseline contained an approximately 11,000px main journey, including a 1,920px workflow. Screenshots below document this audit run; older reports were not used as audit evidence.

## Changes

- “Engineering what's next” introduces the full-stack and AI focus directly, with a clearer identity, calls to action and editorial type hierarchy.
- An original kinetic sculpture uses eleven shared rounded metal frames with a citrus light accent. Interface, Systems and Applied AI morph the frames into three arrangements. Pointer response, drag rotation, viewpoint buttons and a restrained scroll response remain optional.
- The renderer uses a shared extrusion and standard materials, capped pixel ratio and 30fps drawing. It pauses offscreen/hidden, cleans up resources, and respects manual/system reduced motion. The matching local still is an actual capture of the sculpture; graphics failure hides the failed canvas and disables viewpoint controls while retaining the discipline descriptions.
- Asymmetric project exhibits create a stronger rhythm. Full case studies, contribution chapters, implementation notes, source/demo links, engineering-index search and keyboard tabs remain accessible. Genuine captures and implementation maps remain explicitly distinguished.
- Experience follows selected work. The full archive and complete six-stage process use native disclosures. The process keeps its selected explanation visible; expanded tablet/desktop reading restores a sticky preview. Phone stage controls use three columns and minimum 58px targets.
- Existing About, recognition, toolkit, contact and assistant surfaces share the same material and spacing refinements. No achievements or metrics were invented. All 26 project records, four case studies, resume, supplied portraits and employment information are preserved.
- Following the user's correction, GitHub and LinkedIn icon links sit at the header's right corner on desktop and phones. They participate in the mobile-menu focus trap. The footer now has a stacked identity/role, aligned copyright and back-to-top link, a deliberate phone layout, and space to clear the assistant launcher.

## Audit journey and evidence

1. **Hero and navigation — refined.** [Baseline](01-before-hero.png), [new header/hero](23-header-socials-desktop.png), [phone header](25-header-socials-mobile.png). Stronger technical identity, a simpler sculpture composition and persistent social links. Keyboard, motion and graphics-loss behavior were checked separately.
2. **Project discovery — refined.** [Baseline](02-before-work.png), [new exhibits](19-final-work.png). Unequal exhibit scale adds rhythm; native disclosures retain technical depth. Search, tabs, empty states, deep fragments, case-study closing and focus restoration passed.
3. **Experience — preserved and restyled.** [Baseline](03-before-experience.png). The authentic roles, dates and bullets remain intact; the section now comes before the assistant introduction. Chapter links retain a fixed-header offset.
4. **Skills and technical evidence — preserved.** Keyboard categories and evidence-to-index navigation passed. Every tool and project association remains in the shared content.
5. **About and recognition — preserved and refined.** [Baseline](04-before-about.png), [refined composition](22-final-about.png). Supplied portrait, education and recognition remain intact, including the earlier recognition alignment correction.
6. **Archive — compact by default.** All 22 additional projects remain in the searchable/filterable archive. Opening, searching, resetting and paginating preserve keyboard focus.
7. **Process and product layers — compact and interactive.** [Baseline](05-before-workflow.png), [phone process](13-mobile-process-320.png), [expanded tablet process](15-tablet-expanded-process.png). Every original process step and product-layer control remains accessible.
8. **Contact and footer — corrected.** [Desktop footer](24-footer-desktop.png), [phone footer](26-footer-mobile.png). Contact drafts remain reviewable mailto links, invalidate when edited, and do not claim to send email.
9. **Assistant — preserved.** [Phone assistant](18-mobile-assistant.png). Prompt opening, keyboard dismissal, local clearing and a successful sourced response were observed. The phone launcher is compact with its accessible name preserved.
10. **Motion/graphics and production delivery — verified locally.** [Graphics fallback](14-graphics-fallback.png), [built application](27-production-preview.png). Manual/system reduced motion and forced WebGL loss retain usable content.

## Verification

- `npm test`: **36 passed**, no failures. Provider and quota dependencies in the automated suite are controlled fixtures; HTTP tests used localhost networking.
- `npm run lint`, `npm run type-check`, `npm run build`, and `git diff --check`: passed.
- [Browser checks](browser-checks.json): **50 passed** across the controls and states described above.
- Final responsive checks at **320, 390, 600, 650, 768, 820, 900, 1024, 1280, 1440 and 1920px** found no document or header overflow and no out-of-bounds visible headings, paragraphs, form fields, summaries or buttons. Phone workflow labels were separately measured inside their targets.
- Axe WCAG 2 A/AA and 2.1 AA tag scans reported **zero detected violations** on the desktop page, phone page and open phone assistant. Desktop/phone scans retained incomplete ARIA and contrast checks; the dialog retained incomplete contrast checks. These scans do not establish complete accessibility conformance.
- The independent source reviewer found two workflow presentation regressions, both corrected and checked in-browser. A focused harness passed 12 lifecycle assertions using real Three.js object/geometry classes and mocked GPU rendering. It checks transforms, motion scheduling, visibility, context loss and cleanup; actual WebGL output was separately viewed in the browser.
- The local Node server rendered the final `dist` application and dynamically loaded WebGL scene, including the header social links. No console errors were observed in that production-preview tab. The proxied `/api/health` returned HTTP 200. A live assistant quick-start returned a generated answer with canonical project source links; its test conversation was cleared.
- Final client output: main JS approximately **383.39kB / 124.19kB gzip**, separate renderer **561.15kB / 142.16kB gzip**, CSS **121.56kB / 23.15kB gzip**. Vite's 500kB renderer advisory remains; the build succeeds. A scan found neither configured server secret in the three built JS/CSS files.

## Limits

Local Chromium-based preview and production-build evidence are not a hosted deployment. No hosting configuration was changed. No fresh live Redis concurrency/restart/rollover invariant test, physical-device test, Safari/Firefox run, exhaustive screen-reader audit, or hardware performance benchmark was performed during this design pass. The renderer's 30fps cap is an implementation ceiling rather than a measured guarantee on every device. Native scrolling is retained. GitHub publication is recorded separately in the commit history.
