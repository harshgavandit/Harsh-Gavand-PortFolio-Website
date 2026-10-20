# Hosted project additions — 21 October 2026

The requested additions were Healthcare MCP & OpenAI and Multi-Agent Customer Support. The owner clarified that AI Support Ticket Classifier is not deployed and requested that it remain on GitHub only.

## Verified deployments

| Project | Live website | Verification |
| --- | --- | --- |
| Healthcare Explorer — MCP & OpenAI | https://healthcare-mcp-openai.vercel.app/ | Filtered the synthetic directory, loaded the selected profile, and inspected the schema. Public API checks confirmed 10 generated profiles and five tables. A real MCP initialization and tool-list request exposed four tools. AI requests without a code returned 401. |
| Multi-Agent Customer Support | https://harsh-multi-agent-customer-support.streamlit.app/ | A real hosted conversation returned ORD-1003's seeded invoice and pending payment. An ORD-1006 request created a simulated refund review; approving the test session's item cleared the queue and appended the decision. A new session was empty; Resume restored the original conversation and decision. |

The Streamlit HTTP probe used a fresh anonymous cookie jar for its routing redirects. No signed-in browser cookies or credentials were exported. Website, GitHub repository, pinned README, and implementation links returned 200 for both projects. Unchanged JPEG captures show the actual live applications: Healthcare at 1265 × 712 and Streamlit at 1280 × 720. SHA-256 hashes and checks are in [the public report](../public/verification/deployments-2026-10-21.json).

## Portfolio changes

- Added both projects to the existing shared flagship card and case-study system, alongside UGC and AgriConnect. Included features, full stack, contributions, scoped outcomes, real screenshots, and live/source links.
- Labelled Healthcare's access-code requirement on the card and case-study introduction. The directory, generated profiles, schema, and MCP discovery were tested; protected OpenAI responses were not tested.
- Labelled the support app as a simulation with a public review queue. No real refund or payment occurred. Its sessions and approvals reset when the server sleeps or restarts.
- Removed project 38 from the catalog and curated references, removed its indexed repository and source-list entry, and kept all other indexed files at their original immutable revisions. The standalone GitHub repository was not modified.
- Preserved the portfolio's own triage sandbox and changed its source link to the portfolio implementation. Hid the now-empty additional-work disclosure.
- Preserved older dated deployment reports as historical evidence; the 20 October decision not to feature Healthcare has been superseded by this explicitly labelled explorer card.

No clinical validation, real patient outcomes, refund volume, speed improvements, cost reductions, or commercial adoption were inferred. Dataset counts and synthetic workflow results describe the verified demonstrations only.

## Validation

- TypeScript, ESLint, and the production build passed. The build generates 14 case studies and a 38-project archive.
- All 130 regression tests and all 32 generated-page checks passed. Checks cover the two unique main cards, correct screenshots and hashes, access notices, source/live links, case-study routes, the removed classifier, and the preserved portfolio triage tool.
- The required real-provider release benchmark passed 48/48 responses and 8/8 source-retrieval checks against the updated runtime and source fingerprint. Historical evaluation reports were preserved; the current release result is `src/data/aiQuality.json`.
- Existing shared card CSS and responsive breakpoints were retained. Fresh portfolio desktop/mobile browser checks could not finish because browser access was disabled in Work settings after the deployed-app workflow checks and screenshot captures. The live-app checks above were completed before that restriction.
