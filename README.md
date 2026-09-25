# Harsh Gavand — Portfolio

Project-first React + TypeScript portfolio built with Vite. Features four detailed case studies, all 26 original projects, an engineering profile, experience timeline, categorized skills, workflow, and contact draft preparation.

## Development

Use Node.js 22 LTS or newer.

```sh
npm ci
npm run dev
```

## Validation

```sh
npm run lint
npm run type-check
npm test
npm run build
npm run preview
```

The tests verify preservation of the original project catalog, valid project URLs, resume and image assets, and SEO metadata. Browser verification results and external-link limitations are recorded in `verification/README.md`.

## Content and assets

- `src/data/projects.json`: preserved original project descriptions, contributions, technologies, and links.
- `src/data/portfolio.ts`: typed case studies and profile content. Current personal details come from the updated September 2026 resume.
- `public/Harsh_Gavand_Resume.pdf`: exact copy of the supplied updated resume. All resume links use this stable URL.
- `public/projects`: actual captured public demo pages in responsive WebP sizes. Diagrams in other case studies are clearly labeled implementation maps, not screenshots.
- `src/index.css`: design tokens, responsive layouts, focus styles, and reduced-motion behavior.

Fonts are self-hosted. There are no analytics, external font requests, or image services required at runtime.

## Contact behavior

The form prepares a `mailto:` draft. It does not claim to send a message. The visitor reviews and sends the draft through their email application. Copy-email and direct email links are available when no default mail client is configured.

## Hosting

Build command: `npm ci && npm run build`

Publish directory: `dist`

For Render Static Sites, add a rewrite from `/*` to `/index.html` so direct navigation supports the client-side 404 page. `public/_redirects` supports hosts that read that convention; Render requires the dashboard rewrite setting. Existing site URL is used for canonical, social, sitemap, and structured data metadata.

No deployment is performed by local development or validation commands.
