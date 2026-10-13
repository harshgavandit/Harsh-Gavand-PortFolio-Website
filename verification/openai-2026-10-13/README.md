# OpenAI GPT-6 Luna assistant verification

Verified on 13 October 2026. This migration replaces the active Gemini integration with `gpt-6-luna` using `https://api.openai.com/v1/responses`.

## Configuration and safeguards

- The existing `D:\PortFolio-Harsh\.env` supplies the local key. No sample environment file is used. The parent file is outside the Git checkout; repository environment files are ignored and the key is not copied into source or client assets.
- Standard service tier, reasoning disabled, maximum 1,000 output tokens, strict JSON schema, and `store=false`.
- Existing local retrieval covers the 26-project index, five relevant project records, case-study contribution/architecture notes, professional profile, experience, and skills. No paid file-search tools or embedding requests.
- Existing request validation, origin checks, ten requests per client and sixty globally per ten minutes, three concurrent requests, cancellation, and 25-second provider timeout remain active. Limits are per process, reset on restart, and are not a billing cap.
- Provider error details and credentials are never returned to visitors. Incomplete, refused, malformed, and invalid-source outputs produce a recoverable error.
- Client disclosure identifies OpenAI. The site does not persist conversations; provider retention follows applicable OpenAI account data controls.

## Evidence

- Real direct generation: HTTP 200 from OpenAI, `gpt-6-luna`, 4,901 ms, returning portfolio AI/backend projects.
- Browser chat: real response through Vite's same-origin `/api/chat` proxy with canonical source links.
- Browser follow-up: database/delivery architecture question returned the SQLAlchemy repository and Docker/email notes, and explicitly acknowledged unspecified database engine, provider, and scheduling details.
- Browser grounding check: request to invent salary and AWS certification was declined and directed to Contact Harsh. See `02-grounding-check.txt`.
- `01-local-chat.png` records the working chat and provider disclosure.
- Mobile chat at 390 x 844 had no horizontal overflow; the dialog measured 370.4 px wide. Clear chat resets the conversation, and Escape dismisses the dialog. See `03-mobile-chat.png`.
- Production browser assets were checked against the configured key and contain no match.
- API health through both local ports confirms `assistantConfigured=true` and `model=gpt-6-luna`.
- 24 automated tests passed, including public content preservation, HTTP input/origin/rate/static-file controls, provider errors, request schema, structured output validation, and canonical sources. Sandbox networking initially blocked loopback tests; rerunning with loopback access passed.
- ESLint, TypeScript and production build passed.

## Production

The existing Render Node service already had `OPENAI_API_KEY` and `OPENAI_MODEL` configured. Its secrets were not revealed or copied. Pushing application commit `6d074a110556edb32e9ec9099d245ccfd28c524f` triggered the existing automatic deployment.

- Public origin: `https://harsh-gavand-portfolio-website-ai.onrender.com`.
- Hosted `/api/health`: HTTP 200, `assistantConfigured=true`, `model=gpt-6-luna`.
- Hosted `/api/chat` with the public Origin header: HTTP 200 in 5,818 ms, returning the experience summary and canonical project/section links. See `04-production-api.json`.
- Production browser chat: submitted an AI news digest architecture question through the deployed UI; returned the published pipeline and working source links. See `05-production-chat.png` and `06-production-chat.txt`.
- No browser console errors during this production check.
- Final production bundle: JS 375.47 kB (121.68 kB gzip), CSS 177.86 kB (36.60 kB gzip).
- This service uses a free Render instance. Its dashboard states idle instances may take 50 seconds or more to wake; these tests used a warm instance. No hosting plan changes were made.

## Official references

- [GPT-6 Luna](https://developers.openai.com/api/docs/models/gpt-6-luna)
- [Structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Text generation](https://developers.openai.com/api/docs/guides/text)
