import type { NoteBlock } from "./notes.ts";

// Note bodies live apart from note metadata so the article text loads only
// with the notes pages, never in the homepage bundle.
export const noteBodies: Record<string, NoteBlock[]> = {
  "reserve-then-settle-llm-budget": [
    {
      type: "p",
      text: "Anyone can open the assistant on this site and ask a question, and every answer is a paid model call. A rate limit alone does not bound cost, because one long conversation costs more than many short ones. So each request has to fit inside a daily request allowance and a monthly dollar budget, and the check has to stay correct when calls fail halfway.",
    },
    {
      type: "h2",
      id: "reserve",
      text: "Reserve the worst case before calling the model",
    },
    {
      type: "p",
      text: "Before a request is sent, the server computes the most it could possibly cost. Byte-level tokenizers cannot produce more text tokens than the request has UTF-8 bytes, so the serialized request size plus 4,096 bytes of framing is a safe upper bound on input tokens. Output is capped at 1,000 tokens by the request itself. Money is tracked in integer micro-dollars to avoid floating-point drift, with a 2× margin over list pricing so the allowance stays conservative.",
    },
    {
      type: "code",
      language: "js",
      code: "const inputBound = bytes + 4096;\nreturn { inputBound, amount: Math.ceil(inputBound / 5 + 1000) };",
    },
    {
      type: "p",
      text: "That amount is reserved by one Redis Lua script, so the check and the increment happen atomically. The script rejects the request if today's count is at the limit or the month's total plus this amount would exceed the budget. Otherwise it increments both counters, sets their expiry, and writes a per-request record holding the reserved amount and a settled flag. Every key shares a hash tag, so all of them land on the same slot in a clustered Redis.",
    },
    { type: "h2", id: "settle", text: "Settle the real cost, exactly once" },
    {
      type: "p",
      text: "After the model responds, the usage it reports is converted to micro-dollars, treating every input token as uncached. If the usage is missing or outside the reserved bounds, the full reservation is kept. A second Lua script refunds the difference between reserved and actual cost and marks the request settled, and a request already marked settled is ignored. That makes settlement idempotent, so retrying it can never refund twice.",
    },
    { type: "h2", id: "failures", text: "Decide what a failure costs" },
    {
      type: "ul",
      items: [
        "The call was never dispatched: the reservation is released by settling it at zero.",
        "The call was dispatched but its cost is unknown: the full reservation is kept, because the provider may still bill it.",
        "The cost is known but settlement failed: a retry job is added to a sorted set. Jobs back off from 30 seconds, doubling up to 5 minutes. After 5 failed attempts a job moves to a dead-letter set kept for 90 days.",
        "A Vercel cron calls the reconciliation endpoint daily at 04:15 UTC to drain the retry queue.",
      ],
    },
    {
      type: "p",
      text: "Retry records hold only accounting metadata (keys, amounts, timestamps) and never prompts or responses. The defaults are 200 requests a day and a monthly budget of $1.00, both set through environment variables.",
    },
    { type: "h2", id: "takeaways", text: "What the pattern buys" },
    {
      type: "p",
      text: "Budget checks happen before money is spent, not after. Concurrent requests cannot overspend because reserving is atomic. Each failure mode has an explicit, tested outcome instead of a silent leak. The same reserve-and-settle lifecycle also wraps the voice guide and the AI workspace tools.",
    },
  ],
  "bm25-code-grounding-portfolio-assistant": [
    {
      type: "p",
      text: "Recruiters and engineers ask the assistant on this site how a project actually works. A model answering from a project summary will guess. So answers about implementation are grounded in excerpts of real source code, and the model can cite only excerpts it was given in that request.",
    },
    { type: "h2", id: "corpus", text: "A small, pinned corpus" },
    {
      type: "p",
      text: "The corpus is an explicit allowlist of 26 files from five public repositories. An indexing script checks that each repository is public, resolves the current commit, rejects oversized or suspicious files, and writes everything to one JSON snapshot. Each file keeps its commit and content hash. Builds and visitor requests read only that snapshot, so retrieval works offline and needs no GitHub credentials at runtime.",
    },
    { type: "h2", id: "chunking", text: "Chunking with stable IDs" },
    {
      type: "p",
      text: "Files are split into windows of up to 32 lines and 2,600 characters, overlapping by 8 lines so a function is not cut off from its context. Each chunk ID is a SHA-256 hash of repository, path, commit and line range. A citation therefore always points to the same exact lines on GitHub, even after the code moves on.",
    },
    { type: "h2", id: "scoring", text: "BM25-style lexical scoring" },
    {
      type: "p",
      text: "Text is tokenized by splitting camelCase, lowercasing and dropping stop words. Chunks are ranked with the BM25 formula (k1 = 1.2, b = 0.75), plus a small bonus when a query term appears in the file's title or path.",
    },
    {
      type: "code",
      language: "js",
      code: "score +=\n  (Math.log(1 + (N - df + 0.5) / (df + 0.5)) * (tf * 2.2)) /\n  (tf + 1.2 * (0.25 + (0.75 * chunk.tokens.length) / averageLength));",
    },
    {
      type: "p",
      text: 'Two rules add precision. A question that names a project ("LendFlow", "UGC", "banking agent") is restricted to that repository. For questions about this portfolio\'s backend, a few intent rules boost the file that actually enforces the behaviour. That way a question about rate limiting reaches the Lua admission script, not just a constructor that mentions it. Overlapping chunks from the same file are removed, and at most four excerpts are returned.',
    },
    {
      type: "h2",
      id: "citations",
      text: "Citations the model cannot invent",
    },
    {
      type: "p",
      text: 'The model answers through a strict JSON schema. Its evidenceIds field is an enum built from the IDs retrieved for that request, plus "none". Any other ID is invalid output. The server then turns accepted IDs into GitHub links pinned to the commit and line range. Code excerpts are passed as untrusted reference data, never as instructions.',
    },
    { type: "h2", id: "limits", text: "Known limits" },
    {
      type: "ul",
      items: [
        "This is lexical retrieval, not embeddings or a vector database, and the assistant is instructed never to claim otherwise.",
        "The snapshot reflects the indexed commits; upstream changes appear only after re-indexing.",
        "Retrieval and answer grounding fail in different ways: a relevant excerpt does not guarantee a faithful answer.",
      ],
    },
  ],
};
