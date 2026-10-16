# Portfolio evidence

The public [provenance note](../../public/evidence/provenance.txt) is the authoritative
description of what was executed and what was only reviewed. It accompanies the
synthetic news email and banking harness transcript.

Run the deterministic reproduction with a Python environment containing Pydantic 2
and Markdown 3.7:

```powershell
python docs/evidence/reproduce.py --news-source 'PATH/TO/AI_News_To_Email_Generator' --harness-source 'PATH/TO/Banking_Agent_Harness'
```

No `.env` file is loaded. No provider, scraper, database, SMTP, Redis, or bank
connection is used. The source checkouts are read only. The loader skips startup
imports and compiles the original email data classes and formatter functions from
their AST. It executes the original banking tool/service modules with synthetic
context fixtures, default approval duration, and an explicitly controlled mock
executor result. Read the script and provenance note before extending the claims.

Verified on 16 October 2026:

- The source email formatter produced two synthetic source-linked entries in HTML
  and plaintext, using the original `EmailDigestResponse` model.
- Actual banking function calls exercised successful confirmation, repeat
  confirmation, blocked-beneficiary rejection, same-turn confirmation rejection,
  and separate-session pending-state isolation. Assertions passed.
- UGC, LendFlow, and DevGraph case records were inspected against controller,
  schema, and interface source; their production behavior was not exercised by
  this script.

The news checkout contains local provider changes. The formatter and selected
digest model methods match the linked committed methods; the provider changes
were excluded from execution. Source hashes identify the exact files inspected.
