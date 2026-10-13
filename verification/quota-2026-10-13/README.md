# Persistent AI credit protection verification

13 October 2026. Daily admission and monthly cost allowances use persistent Upstash Redis, shared by every application instance. The production namespace is fixed as `portfolio-ai:v1`.

## Behavior

- Defaults: 200 admitted attempts per UTC day and $1.00 conservative cost allowance per UTC calendar month.
- Atomic admission checks both caps and reserves a worst-case cost before generation. Counters cannot be oversubscribed by concurrent requests.
- Completed responses reconcile provider-reported token usage once. Invalid/missing usage, cancelled requests, provider failures and settlement outages retain the reservation.
- Integer micro-dollar accounting, 2x margin over GPT-6 Luna Standard pricing, uncached input pricing, no reasoning, maximum 1,000 output tokens.
- Missing/invalid credentials, storage failure, corrupt state and read-only tokens reject admission with no OpenAI call. No memory or local-file fallback.
- Daily/monthly denial returns HTTP 429 with a reset interval. The client hides immediate retry for these cases and offers contact.
- Counters and reservation IDs contain no conversation text or IP addresses. Neither Redis nor OpenAI credentials appear in client assets or public responses.

## Automated evidence

- `npm test`: 36 passing tests covering existing portfolio preservation, HTTP safeguards, zero generation on quota rejection, request ordering, provider errors, conservative cost calculations, UTC boundaries, safe store failures and invalid pricing settings.
- ESLint, TypeScript and production build passed.
- `redis-invariants.json`: live Redis Lua test with 24 concurrent admissions through two quota instances; exactly 5 accepted under a five-request allowance. Reconstructed instances stayed blocked. Monthly cutoff, duplicate settlement and UTC rollover passed. No OpenAI calls. Test keys use isolated UUID namespaces and expire.
- `http-process-restart.json`: two separate Node processes with a shared isolated Redis namespace. First HTTP chat admitted; after process replacement the next chat returned HTTP 429 / daily_limit, with zero generator calls in the second process. No OpenAI calls.
- `live-openai-accounting.json`: real local GPT-6 Luna answer through /api/chat in 3,277 ms, daily counter increment 1. Reservation $0.005056 reconciled to $0.000719 (the ledger's conservative 2x-priced amount, not the provider invoice). Verified source links returned.
- Private status CLI successfully read aggregate remaining daily/monthly allowance without printing secrets.

## Deployment boundary

The user supplied valid Upstash REST credentials in the existing `D:\PortFolio-Harsh\.env`. The first token lacked EVAL permission; the replacement passed live writes and scripts. No sample env file was created.

Chrome disconnected during Render configuration. The user chose to configure/check Render manually and requested the completed local implementation be pushed. Render needs `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `AI_DAILY_REQUEST_LIMIT=200`, and `AI_MONTHLY_BUDGET_USD=1.00`. The existing auto-deploy is triggered by the GitHub push; if its Redis variables are absent or invalid, the new code pauses AI requests while the portfolio remains available.

Browser UI verification of the exhausted-budget fixture was blocked by browser URL policy. No workaround was attempted. The rejection is verified at the HTTP/server layer; the client change passed type-check/build and is included for the user's manual browser check.

## Practical limits

This allowance covers this application's calls from activation onward, not the account's credit balance, other API clients, prior use, taxes or future pricing changes. Redis outages conservatively reduce availability rather than permit unaccounted calls. Do not flush/delete active ledger keys or switch the backing database. Per-IP/short-window burst limits remain process-local; the persistent daily/monthly caps remain global across instances sharing Redis.

## Sources

- [GPT-6 Luna Standard pricing](https://developers.openai.com/api/docs/models/gpt-6-luna)
- [Render free-instance filesystem limitations](https://render.com/docs/free)
- [Upstash Redis REST commands](https://upstash.com/docs/redis/features/restapi)
