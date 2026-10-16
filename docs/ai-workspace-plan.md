# Portfolio AI workspace

Authorized scope: implement the repository-aware technical guide, structured recruiter workspace, live support-ticket workbench, and repeatable quality checks. Preserve the current portfolio, text/voice assistant, Vercel setup, and community-project content. No Agri Samaj application changes or new services/secrets.

## Implementation

1. Index an explicit allowlist of public code files at immutable GitHub commits. Validate provenance, size, and secret exclusions; commit the snapshot so builds and requests need no GitHub credentials or network retrieval. Expose a reproducible refresh command.
2. Retrieve bounded source excerpts with exact file/line/commit citations. Ground chat and voice in the same excerpts; only server-resolved citations from the retrieved set may be returned. Include limitations and honest abstention.
3. Add recruiter matching and ticket triage routes behind existing admission, quota reservation/settlement, cancellation, and error handling. Validate every structured model response. Redact ticket identifiers before provider dispatch; never execute ticket actions.
4. Add a dedicated, prerendered AI workspace linked from the existing assistant. Provide a job-description form, ticket samples and custom input, inspectable sources, real timing/usage, and clear local-only input/privacy behavior. Maintain native labels, keyboard access, reduced motion, and mobile layout.
5. Add deterministic retrieval/contract tests and a versioned live evaluation set. Publish measured results with timestamps, model, source snapshot, sample count, and grading boundaries. Use reproducible CI checks; no invented metrics or grading claims.
6. Run lint, typecheck, full tests, build/prerender, actual provider checks, and public deployment checks. Browser review depends on the user's Work settings; do not bypass disabled browser access. Push the tested changes and verify the exact Vercel revision.
