# Public deployment showcase review

Reviewed the 20 October 2026 India-time deployment window. Vercel returned **30 deployment attempts across 10 projects** at review start. The latest version of every project was Ready; older failed attempts were superseded. Build readiness was assessed separately from application behavior.

## Featured public demos

| Project | Executed visitor workflow | Portfolio action |
| --- | --- | --- |
| Docwise / Hybrid RAG Documentation Assistant | Asked how FastMCP registers a tool; checked the answer against the expandable retrieved passage. An unrelated question returned the documentation boundary. Health reported 39 passages across 2 documents. | New main card and case study |
| AI Voice Adventure Assistant | Used the bundled synthetic Mars story recording; observed transcription, a generated story, and generated audio playback. | New main card and case study |
| ADK Shopping Assistant | Started a fresh conversation, used the built-in demo profile, added two Pixel 9 phones, checked the Python-calculated total, and completed a synthetic shipping summary. Reload restored the cart and conversation. | New main card and case study |
| Symposium RAG — Semantic Cache | Asked for the event date, confirmed a repeated API question returned `cache_hit: true` with sources, and checked an unsupported question was declined. | New main card and case study |
| Symposium PDF RAG Bot | Asked the event date and venue, expanded page references, and checked the healthy 9-passage retrieval index. | New main card and case study |
| Banking Agent Harness | Staged a ₹250 synthetic transfer without changing the balance; a separate confirmation reduced the mock balance by exactly ₹250 and showed a successful tool result. | Updated existing main card, real screenshot, hosted state description and live link |

Each public website, GitHub repository, and pinned README/implementation link returned HTTP 200. Screenshots are unchanged JPEG captures of the actual deployed websites at 1265 × 712, stored under `public/evidence/`. Their SHA-256 hashes and per-project checks are in [the machine-readable report](../public/verification/deployments-2026-10-20.json). Main cards reuse `CaseStudyCard`; the additional-work list excludes featured project IDs.

## Other reviewed deployments

- **ADK Finance Assistant:** public landing page and sample budget load. `/api/chat` returned 401 without a private access code. Not featured as a public interactive AI demo.
- **Healthcare MCP & OpenAI:** the generated patient directory loads and `/api/patients` responds; the AI view asks for an access code and `/api/ask` returned 401 without one. Not featured as an ungated AI demo.
- **AgriConnect:** already featured. The existing live website returned HTTP 200. Its authenticated commerce, payment, and administrator flows were not re-executed in this review.
- **Portfolio:** already deployed and reviewed as the host application; no duplicate project card added.

## Evidence boundaries

- All shopping contacts/addresses and banking values used the applications' synthetic demonstration data. No real purchase, payment, or transfer occurred.
- Voice testing used a bundled audio fixture, not physical microphone hardware.
- Shared public-demo rate limits still apply. A passing workflow is not an uptime or load-test guarantee.
- No adoption, revenue, conversion, cost-reduction, accuracy, or production-scale metrics were inferred. Corpus sizes and arithmetic examples describe observed behavior only.
- Vercel's shopping upload retained the older `92d5fa8` Git metadata. The inspected published hosted implementation is `a72dc49`, which contains `ADK_Shopping/cloud_server.py`. Source links use that published commit; exact uploaded-source identity was not independently established.
- The simple symposium deployment contains no Git commit in Vercel metadata. Its inspected source link is `2b66d31`; exact uploaded-source identity was not independently established. Public behavior and screenshots were verified directly.
- The original two symposium projects remain separate: one is the PDF retrieval app, the other adds persistent exact and semantic answer caching.

## Portfolio validation

- TypeScript checking, ESLint, and production build passed.
- All 128 regression tests passed. All 31 built-page checks passed, including the 12 case-study routes, assets, anchors, duplicate IDs, metadata, source/live links, capture hashes, and complete new cards.
- The required live OpenAI release benchmark passed 48/48 responses and 8/8 source-retrieval checks against the current runtime fingerprint. The current summary is `src/data/aiQuality.json`; historical audit reports were preserved.
- Browser checks covered desktop and a 390-pixel mobile viewport: no horizontal overflow, working project disclosures, case-study navigation and technology tabs, and no browser error logs on the checked case-study page. Mobile dimensions were restored after testing.
- The banking card uses a real deployment screenshot; the original interactive recorded policy scenarios remain available in its case study and their rejection-state control was exercised.
