# Portfolio assistant and visual update

Confirmed direction: preserve the calm white/soft-blue portfolio, existing content and functionality; improve project discovery and add a real Gemini assistant. The user authorized reuse of the local Gemini key, model testing, and end-to-end implementation.

## Implementation

1. Verify a small text response against the key's available Flash models. Prefer a stable low-latency model which actually succeeds; do not silently fall back across models.
2. Add a small Node HTTP service for same-origin `/api/chat` and production static hosting. Use server-only environment configuration, bounded requests, timeouts, per-client and global request limits, and safe error responses. Keep all secrets out of Vite variables and source control.
3. Share the existing portfolio data with the assistant. Supply public profile, experience, skills, project index, and relevant project detail as context. Return plain text plus server-validated portfolio links. State unknown facts honestly; do not invent experience, metrics, availability, or role-fit scores.
4. Add a responsive, keyboard-accessible chat dialog with suggested questions, conversation history, source links, loading, cancel, retry, and clear actions. Disclose that submitted messages go to Google Gemini; keep history in memory only.
5. Add a visual selected-project gallery which links into the existing full case studies, preserving walkthroughs, filters, all 26 projects, contact behavior, and résumé. Use existing actual screenshots and clearly labeled architecture visuals.
6. Test backend contracts and failure states, run existing preservation tests/lint/typecheck/build, and verify desktop/mobile UI and a real browser-to-Gemini conversation. Document configuration and the production-hosting change.

## Constraints and deployment

No new database, credentials copied into source, scraped reference assets, invented achievements, or public chat history. Production requires a Node web service rather than only static hosting. Deploying or changing a hosting account is not implied by local verification. The supplied parent-directory `.env` is read only for local development; production uses service environment variables.

## Acceptance

- A live Gemini answer through the local UI with valid related portfolio links.
- Explicit empty/invalid input, quota/upstream error, timeout, cancellation, and retry behavior.
- No client bundle contains the configured key.
- Existing project catalog/assets/links unchanged and critical interactive flows preserved.
- Responsive gallery/chat at mobile and desktop widths, keyboard dismissal/focus behavior, reduced motion retained.
