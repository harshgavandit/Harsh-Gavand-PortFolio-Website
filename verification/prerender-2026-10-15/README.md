# Production HTML pre-rendering — 15 October 2026

The live Node service was returning a 3,016-byte client shell with an empty `<div id="root"></div>`. Its public hostname is `https://harsh-gavand-portfolio-website-ai.onrender.com/`; existing canonical metadata pointed to the older hostname.

## Implementation

- `npm run build` now automatically runs `postbuild`. Vite builds a temporary server entry and React renders the shared portfolio components into the production HTML. This uses existing dependencies without a headless browser download, network service, or provider credential.
- `src/main.tsx` hydrates pre-rendered pages with `hydrateRoot`. Local Vite development retains `createRoot`. The server and client share the rendered year so a static footer does not mismatch at a year boundary.
- The homepage includes every section and a native disclosure containing all 38 project records, with their descriptions, contributions, features, technologies, challenges, outcomes, and source links. Search and pagination do not determine which projects are present in the initial response.
- The complete directory, project notes, résumé, and email links work as HTML. When JavaScript is disabled, the contact form and controls that require JavaScript are hidden; the contact form cannot fall through to an unintended GET submission.
- Canonical, Open Graph, Twitter, JSON-LD, robots, and sitemap use the current production origin. `SITE_URL` can override it at build time; otherwise `RENDER_EXTERNAL_URL` is used when present. An HTTPS origin without credentials, path, query, or fragment is required.
- The generated 404 page is served with HTTP 404 and `noindex, follow`. `/index.html` redirects to `/`. Static assets retain their existing MIME types and immutable caching. The temporary server build remains outside public `dist`.
- Render's existing Node service already runs `npm ci --include=dev && npm run build`, starts with `npm run start`, and deploys `main` on commit. No dashboard settings or credentials need changing.

## Code-level validation

The user requested code-level verification and will perform the final browser review. The following checks are automated code and HTTP checks; they do not substitute for that visual review.

| Command | Result |
| --- | --- |
| `npm run lint` | Passed |
| `npm run type-check` | Passed |
| `npm test` | 38 tests passed |
| `npm run build` | Passed, including automatic HTML rendering and catalog completeness checks |
| `npm run test:prerender` | 11 tests passed |

Production checks verify complete initial HTML, all 38 records, identical responses for Googlebot / LinkedInBot / ATS-style user agents, every referenced HTML/CSS asset, fonts and responsive image variants, JavaScript syntax for all chunks including the 3D renderer, section IDs and anchor targets, metadata origins, asset MIME/cache behavior, inaccessible source/env files, redirects, and real 404 responses. They make no paid model calls.

The existing client build retains Vite's warning about the separately loaded Three.js renderer exceeding 500 kB. This is a warning; the renderer remains a lazy-loaded chunk and its HTTP response and syntax are checked. User-agent simulations establish readable server responses, not that any external crawler has already recrawled the page or refreshed its preview cache.

Implementation references: [Vite pre-rendering / SSG](https://vite.dev/guide/ssr.html#pre-rendering-ssg), [React renderToString](https://react.dev/reference/react-dom/server/renderToString), and [React hydrateRoot](https://react.dev/reference/react-dom/client/hydrateRoot).
