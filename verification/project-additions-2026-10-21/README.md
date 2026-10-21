# Stock Prediction Portal and AI Brief

Both projects appear in homepage Selected Work using the existing deployed-project card, with an actual live screenshot, expandable features/contribution/outcome, complete stack, live/source links, and a focused case study.

- Stock Prediction Portal: https://stock-prediction-portal-kohl.vercel.app
- AI Brief: https://ai-news-to-email-generator.vercel.app

The stock catalog entry retains ID 20 and `stock-prediction-portal-python-ml`. The news entry retains ID 17 and `news-automation`; its older local Ollama notes and formatter-only preview have been replaced by the deployed FastAPI/OpenAI workflow. Existing names remain aliases. Neither project is duplicated.

## Evidence

Public repositories, pinned implementation files, live pages, and health endpoints were checked on 21 October 2026. Capture hashes, source revisions, dimensions, link responses, and workflow observations are in [the deployment record](../../public/verification/project-additions-2026-10-21.json).

The stock landing and dashboard-to-login handoff were exercised without creating an account or running a prediction. The news reading room loaded RSS stories; its OpenAI filter and composer controls were checked. Digest generation and email delivery were not exercised for this portfolio update. Technical descriptions were checked against the linked source.

## Validation

- Lint and TypeScript: passed.
- Application tests: 130 passed.
- Production build: passed; 15 focused case-study routes prerendered.
- Prerender/assets/SEO/ARIA checks: 32 passed.
- AI release benchmark: 48/48 real-provider responses and 8/8 retrieval checks; the release fingerprint matches the updated project context.
- Browser: both cards, disclosures, images, case-study navigation, architecture selection, and keyboard tab switching checked. The homepage had no horizontal overflow at 390px; temporary viewport sizing was reset.

Linked application source, authentication, secrets, and deployments were not modified.
