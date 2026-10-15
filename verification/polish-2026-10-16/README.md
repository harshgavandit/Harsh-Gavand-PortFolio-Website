# Portfolio polish source review

Production target: **https://harshgavand.dev** on Vercel. The user explicitly confirmed retaining this canonical origin; the supplied audit's Render-domain advice referred to a retired deployment.

The four project repositories were read again on 16 October 2026. Their main commits match the earlier [source manifest](../recruiter-2026-10-15/sources.json). This is portfolio copy verification, not a certification of those applications.

| Project | Verified mechanisms | Claims deliberately excluded |
| --- | --- | --- |
| UGC | Clerk identity, account-scoped project lookup, Prisma credit increment/decrement, caught-error restoration, isGenerating/error fields, provider-operation polling, Cloudinary URLs | Durable queue/status enum, transactional or idempotent ledger, universal refund guarantee, atomic account-balance screenshot, 1080p output |
| LendFlow | Borrower foreign key, DECIMAL principal/rate fields, pending/approved/rejected status enum, lookup/save review handlers, JWT accounts, role-oriented views | A REPAID enum value, strict RBAC on every loan mutation, SQL aggregation guarantees, concurrency guards or prevention of double approval |
| DevGraph | Required creation name/owner checks, Mongoose references/population, separate personal/discovery state and local filtering | Universal ObjectId middleware, single-round-trip or measured latency promises, compound-index or OAuth claims |
| News | GUID/video-ID duplicate checks, SQLAlchemy records/commits, Optional digest result on model error, recipient/SMTP validation, multipart email | A public live demo, exactly-once/concurrency-safe ingestion or SMTP delivery, measured uptime or automatic retry guarantees |

The trace now starts with a completed happy path. Native pressed-state scenario buttons expose pre-dispatch rollback and post-dispatch timeout separately. Upstream usage of unknown cost remains reserved, preserving the application's conservative accounting. `generateWithQuota` passes its request and AbortSignal explicitly into the provider callback, and the code excerpt mirrors the executed implementation.

The existing architecture list was already labelled and interactive; it remains an ordered list of named buttons. Header motion control now mounts directly rather than inside another utility wrapper. Personal résumé links and files remain absent; the genuine Django Resume Builder project is retained.

Verification is limited to source, build and HTTP checks, as requested. Browser visual/device and assistive-technology review remains manual. No paid model calls are needed for these checks.

## Local quality gates

Verified with Node 24.22.0: lint and TypeScript checks pass, all 75 application tests pass, the production build and three-route pre-render succeed, and all 23 pre-render/HTTP tests pass. The HTTP fixtures require loopback networking, which the restricted execution sandbox initially denied; the same tests pass when local networking is permitted.

Regression checks cover the unbroken `releaseOrEnqueueRetry` identifier, request/AbortSignal forwarding, accounting-safe trace scenarios, labelled architecture stages, the studio preview's source-backed credit costs, header/list semantics, linked ARIA tabs, keyboard navigation logic, all generated asset references, and the absence of personal document links.

The existing shared-workspace Speed Insights component was preserved and its missing production dependency installed so the application compiles. Hosted metrics collection still requires the project's Vercel dashboard setting and normal visitor traffic.
