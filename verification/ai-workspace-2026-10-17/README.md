# AI workspace release checks — 17 October 2026

The `/ai/` workspace adds a code guide, a structured role comparison, and a fictional support-ticket classifier. The existing text and voice assistant share the code guide's versioned source evidence. No Agri Samaj application code or community roadmap was changed.

## Local release evidence

- Lint and TypeScript checks passed.
- Application suite: 114 passed, 0 failed.
- Production build and prerender completed successfully.
- Prerender and HTTP checks: 28 passed, 0 failed, including the new route, its three linked tab panels, canonical metadata, and source-corpus non-exposure.
- Live provider evaluation: 12 of 12 controlled synthetic cases passed; the four expected-repository retrieval checks passed. See `evaluation.json` for the exact model, snapshot, runtime fingerprint, assertions, timings, and allowance accounting.
- Median request time in that local HTTP evaluation was 2.486 seconds. This is not a production latency metric or a comprehensive semantic-accuracy score.
- Published output renders the current runtime fingerprint and the measured 12/12 and 4/4 results. React's server-rendered text separators were normalized when checking these labels.

## Source and execution boundaries

The checked-in index contains 23 allowlisted files from six verified public GitHub repositories, pinned to immutable commits. Retrieval is BM25-style lexical search, not vector retrieval, and does not read visitors' files or automatically fetch upstream changes. Only selected, server-resolved excerpts are returned to clients. The index was scanned for suspicious credential assignments before publication.

The classifier is a bounded Node.js adaptation of the separately linked FastAPI/LangGraph project, not a deployment of that Python runtime. It classifies synthetic tickets and executes no business actions. Security and suspicious-instruction cases require human review; no operational review queue is created.

Role comparison cites published evidence, exposes gaps, and generates no hiring score. Pattern redaction is intentionally limited and does not guarantee removal of every personal identifier. Forms ask for public job descriptions or fictional tickets; submitted inputs and results are not persisted by the portfolio. Provider requests use `store: false`.

All tools reuse the existing OpenAI credentials, shared admission limits, transactional quota settlement, and recovery mechanisms. CI runs deterministic tests without provider secrets or paid model requests. Explicit live evaluation is a separate release step.

## Review limitation

Browser access is disabled in Work settings. No visual browser, physical microphone, or speaker verification is claimed for this release. Code, prerendered HTML, HTTP, and real-provider checks are the available evidence. Production smoke checks are run after the connected Vercel deployment and are reported separately from the local evaluation dataset.
