# Calm light portfolio redesign

Verified locally on 5 October 2026 against the production build at http://127.0.0.1:4175/. This revision has not been deployed.

## Visual changes

The portfolio uses white page backgrounds, pale blue section and card surfaces, slate text, and restrained blue accents. Inter is the shared body and heading font. The content width is capped at 1160px, with responsive spacing, readable descriptions, rounded cards, subtle borders, and small shadows.

The navbar, hero, all four featured case studies, About, Experience, 22-project archive, Skills, workflow, Contact, footer, and unknown-route page share the light palette. Project cards retain their technology lists, contribution descriptions, details, and destination URLs. Source and live-demo links are presented as clear buttons.

Portrait parallax, pointer-driven card tilts, magnetic buttons, moving hero light, and dramatic image reveals were removed. The supplied portrait is shown in natural color with its name and location beneath it. Brief entry transitions and user-controlled walkthroughs remain. The reduced-motion preference now updates immediately when the system setting changes, through a media-query subscription; the existing pause control remains available.

Presentation styles are centralized in `src/calm.css`, loaded after the existing structural and component styles. Root tokens in `src/index.css`, the favicon, and the browser theme-color metadata use the same palette.

## Fresh automated verification

- `npm run lint`: passed, zero ESLint warnings.
- `npm run type-check`: passed.
- `npm test`: all five tests passed. These verify the original 26-project catalog fingerprint, link formats and identifiers, exact resume PDF, responsive project assets, SEO metadata, and unaltered supplied portrait.
- `npm run build`: passed. JavaScript 335.57 kB (109.90 kB gzip); CSS 75.41 kB (15.57 kB gzip).
- `git diff --check`: passed.

## Fresh production-browser verification

The installed Chromium browser was driven with Playwright after the Codex in-app browser automation runtime failed to initialize. No dependencies were added to the application.

- Seven viewport widths: 320, 375, 430, 768, 1024, 1440, and 1920px. Each had equal viewport and document widths, with no overflowing main-content elements in the recorded inspection.
- Computed backgrounds confirm white body and root surfaces, with pale blue About and workflow sections.
- Desktop and mobile screenshots were visually inspected for typography, spacing, card layout, navigation, and contact presentation.
- Nine interaction groups passed: search/category filters/empty reset; complete archive expansion with heading focus; keyboard disclosures; walkthrough chapter/play controls; workflow stage and keyboard controls; contact validation/draft generation/edit invalidation/copy; mobile menu focus trap/Escape/section navigation; motion pause and live system reduced motion; unknown-route return and HTTP-served resume PDF.
- No captured page errors or console errors during the run.
- No email was sent. The contact check inspected the generated mailto draft.

## Accessibility scope

Axe checks at 1440px and 375px each reported 30 passing rules and zero violations for WCAG 2 A/AA and 2.1 AA tags. The raw results retain incomplete color-contrast checks involving screenshot overlays, animated elements, and the decorative workflow diagram. This is scoped automated and keyboard verification, not a complete accessibility certification or cross-browser certification.

## Evidence and reproduction

- `light-theme/responsive.json`: measured viewport dimensions and computed colors.
- `light-theme/accessibility.json`: complete scoped axe results, including incomplete checks.
- `light-theme/interactions.json`: nine passed interaction groups and captured runtime errors.
- `light-theme/*.png`: desktop sections, mobile hero/navigation/projects/skills/contact.
- `scripts/verify-light-theme.mjs`: repeatable local browser verification.

Run the normal application checks, then start `npm run preview -- --host 127.0.0.1 --port 4175`. The browser script requires Playwright to be available. Set `PLAYWRIGHT_MODULE` to its installed package directory and optionally `CHROMIUM_EXECUTABLE` to an installed Chromium executable. `PORTFOLIO_URL` can override the default local preview URL. Run `node scripts/verify-light-theme.mjs`.

Project data, profile content, business interactions, routes, and external destinations are preserved. External destination availability was not re-audited in this revision.
