import snapshot from "./knowledge/source-index.json" with { type: "json" };
import { createHash } from "node:crypto";

export const sourceSnapshot = snapshot;
const stop = new Set(
  "the a an and or to of in on is are does do how what where which show me his harsh project projects code implementation for with when from this that can you it he".split(
    " ",
  ),
);
export function terms(text) {
  return (
    String(text)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .toLowerCase()
      .match(/[a-z0-9]{2,}/g)
      ?.filter((term) => !stop.has(term)) || []
  );
}
const chunks = snapshot.files.flatMap((file) => {
  const lines = file.text.split("\n");
  const result = [];
  for (let start = 0; start < lines.length;) {
    let end = Math.min(start + 32, lines.length);
    while (end > start + 1 && lines.slice(start, end).join("\n").length > 2600)
      end--;
    const text = lines.slice(start, end).join("\n");
    if (text.trim() && text.length <= 2600) {
      const id = createHash("sha256")
        .update(`${file.repo}/${file.path}@${file.commit}:${start + 1}:${end}`)
        .digest("hex")
        .slice(0, 16);
      result.push({
        id,
        repo: file.repo,
        slug: file.slug,
        title: file.title,
        path: file.path,
        commit: file.commit,
        startLine: start + 1,
        endLine: end,
        text,
        tokens: terms(text),
        heading: terms(`${file.title} ${file.path}`),
      });
    }
    if (end === lines.length) break;
    start += Math.max(1, end - start - 8);
  }
  return result;
});
const averageLength =
  chunks.reduce((n, c) => n + c.tokens.length, 0) / chunks.length;
const frequency = new Map();
for (const chunk of chunks)
  for (const term of new Set(chunk.tokens))
    frequency.set(term, (frequency.get(term) || 0) + 1);
const aliases = [
  [/\bugc\b|content studio/i, "ugc-platform"],
  [/\blendflow\b|lending|banking saas/i, "banking-saas"],
  [/banking agent|\bharness\b|transfer polic/i, "banking-agent-harness"],
  [/ticket|classifier|triage/i, "ai-support-ticket-classifier"],
  [
    /\brag\b|bm25|reciprocal|vector search/i,
    "hybrid-rag-documentation-assistant",
  ],
  [/\bportfolio\b|quota-lifecycle|quota reservation/i, "portfolio"],
];

export function retrievalQuery(messages) {
  if (typeof messages === "string") return messages;
  const users = messages.filter((message) => message.role === "user");
  const latest = users.at(-1)?.content || "";
  return terms(latest).length < 4
    ? `${users.at(-2)?.content || ""}\n${latest}`
    : latest;
}

export function retrieveCode(queryOrMessages, limit = 4) {
  const query = retrievalQuery(queryOrMessages);
  const selected = aliases.find(([pattern]) => pattern.test(query))?.[1];
  const queryTerms = [...new Set(terms(query))];
  if (!queryTerms.length) return [];
  const ranked = chunks
    .filter((chunk) => !selected || chunk.slug === selected)
    .map((chunk) => {
      let score = 0;
      for (const term of queryTerms) {
        const tf = chunk.tokens.filter((token) => token === term).length;
        const df = frequency.get(term) || 0;
        if (tf)
          score +=
            (Math.log(1 + (chunks.length - df + 0.5) / (df + 0.5)) *
              (tf * 2.2)) /
            (tf + 1.2 * (0.25 + (0.75 * chunk.tokens.length) / averageLength));
        if (chunk.heading.includes(term)) score += 2;
      }
      return { chunk, score };
    })
    .filter((item) => item.score > 1)
    .sort((a, b) => b.score - a.score || a.chunk.id.localeCompare(b.chunk.id));
  const results = [];
  for (const { chunk } of ranked) {
    if (
      results.some(
        (other) =>
          other.repo === chunk.repo &&
          other.path === chunk.path &&
          Math.max(other.startLine, chunk.startLine) <=
            Math.min(other.endLine, chunk.endLine),
      )
    )
      continue;
    const { tokens: _tokens, heading: _heading, ...source } = chunk;
    results.push({
      ...source,
      href: `https://github.com/harshgavandit/${chunk.repo}/blob/${chunk.commit}/${chunk.path}#L${chunk.startLine}-L${chunk.endLine}`,
    });
    if (results.length >= Math.min(4, limit)) break;
  }
  return results;
}

export function codeEvidence(ids, queryOrMessages) {
  const retrieved = new Map(
    retrieveCode(queryOrMessages).map((chunk) => [chunk.id, chunk]),
  );
  return [...new Set(Array.isArray(ids) ? ids : [])]
    .flatMap((id) => (retrieved.has(id) ? [retrieved.get(id)] : []))
    .slice(0, 4);
}

export function publicCodeLinks(evidence) {
  return (Array.isArray(evidence) ? evidence : []).flatMap((item) => {
    const chunk = chunks.find((chunk) => chunk.id === item.id);
    if (!chunk) return [];
    return [
      {
        label: `${chunk.title} · ${chunk.path}:${chunk.startLine}–${chunk.endLine}`,
        href: `https://github.com/harshgavandit/${chunk.repo}/blob/${chunk.commit}/${chunk.path}#L${chunk.startLine}-L${chunk.endLine}`,
      },
    ];
  });
}
