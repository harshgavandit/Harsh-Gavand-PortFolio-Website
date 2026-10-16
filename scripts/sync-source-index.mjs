import { mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { sourceAllowlist } from "./source-allowlist.mjs";

const hash = (value) => createHash("sha256").update(value).digest("hex");
const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "Harsh-Portfolio-Source-Indexer",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};
async function api(path) {
  const response = await fetch("https://api.github.com/" + path, {
    headers,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok)
    throw new Error(`Public source metadata unavailable (${response.status}).`);
  return response.json();
}
const repositories = [],
  files = [];
for (const entry of sourceAllowlist) {
  const repository = await api(`repos/harshgavandit/${entry.repo}`);
  if (
    repository.private ||
    repository.owner.login.toLowerCase() !== "harshgavandit"
  )
    throw new Error(
      "Only explicitly allowlisted public repositories can be indexed.",
    );
  const commit = (
    await api(
      `repos/harshgavandit/${entry.repo}/commits/${repository.default_branch}`,
    )
  ).sha;
  if (!/^[a-f0-9]{40}$/.test(commit))
    throw new Error("Invalid source revision.");
  repositories.push({
    repo: entry.repo,
    slug: entry.slug,
    title: entry.title,
    commit,
    url: repository.html_url,
    files: entry.files.length,
  });
  for (const path of entry.files) {
    if (
      !/^[a-zA-Z0-9_./-]+\.(?:ts|js|mjs|py|prisma)$/.test(path) ||
      path.includes("..") ||
      /node_modules|\.env|secret|credential/i.test(path)
    )
      throw new Error("Invalid allowlisted source path.");
    const url = `https://raw.githubusercontent.com/harshgavandit/${entry.repo}/${commit}/${path}`;
    const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!response.ok)
      throw new Error(
        `Source unavailable: ${entry.repo}/${path} (${response.status}).`,
      );
    const text = (await response.text()).replace(/\r\n/g, "\n");
    if (
      Buffer.byteLength(text) > 65000 ||
      /sk-(?:proj-)?[a-zA-Z0-9_-]{24,}|gh[pousr]_[a-zA-Z0-9]{30,}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(
        text,
      )
    )
      throw new Error("Source excluded by size or credential check: " + path);
    files.push({
      repo: entry.repo,
      slug: entry.slug,
      title: entry.title,
      commit,
      path,
      sha256: hash(text),
      text,
    });
  }
}
const snapshot = {
  version: 1,
  indexedAt: new Date().toISOString(),
  digest: hash(
    JSON.stringify(
      files.map(({ repo, path, commit, sha256 }) => ({
        repo,
        path,
        commit,
        sha256,
      })),
    ),
  ),
  repositories,
  files,
};
if (Buffer.byteLength(JSON.stringify(snapshot)) > 800000)
  throw new Error("Source corpus exceeds its deployment budget.");
await mkdir(new URL("../server/knowledge/", import.meta.url), {
  recursive: true,
});
await writeFile(
  new URL("../server/knowledge/source-index.json", import.meta.url),
  JSON.stringify(snapshot, null, 2) + "\n",
);
await writeFile(
  new URL("../src/data/sourceSummary.json", import.meta.url),
  JSON.stringify(
    {
      version: snapshot.version,
      indexedAt: snapshot.indexedAt,
      digest: snapshot.digest,
      fileCount: files.length,
      repositories,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  `Indexed ${files.length} explicitly selected public files from ${repositories.length} repositories. Snapshot ${snapshot.digest.slice(0, 12)}.`,
);
