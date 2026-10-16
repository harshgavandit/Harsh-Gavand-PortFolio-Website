import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { sourceAllowlist } from "./source-allowlist.mjs";

// Release bootstrap: index only committed, allowlisted portfolio files so their
// immutable links can be published together with the generated corpus/report.
// The default path always fetches published public revisions from GitHub.
const localPortfolio = process.argv.includes("--committed-portfolio");
const root = fileURLToPath(new URL("../", import.meta.url));
const git = (...args) =>
  execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 1000000,
  }).trimEnd();
if (
  localPortfolio &&
  !/^https:\/\/github\.com\/harshgavandit\/Harsh-Gavand-PortFolio-Website(?:\.git)?\/?$/i.test(
    git("remote", "get-url", "origin"),
  )
)
  throw new Error(
    "Committed portfolio indexing requires the expected public repository origin.",
  );

const hash = (value) => createHash("sha256").update(value).digest("hex");
let previous;
try {
  previous = JSON.parse(
    await readFile(
      new URL("../server/knowledge/source-index.json", import.meta.url),
      "utf8",
    ),
  );
} catch {
  /* Initial index. */
}
let reused = 0;
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
  const commit =
    localPortfolio && entry.slug === "portfolio"
      ? git("rev-parse", "HEAD")
      : (
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
    const cached = previous?.files?.find(
      (file) =>
        file.repo === entry.repo &&
        file.commit === commit &&
        file.path === path &&
        hash(file.text) === file.sha256,
    );
    let text;
    if (localPortfolio && entry.slug === "portfolio") {
      text = execFileSync("git", ["show", `${commit}:${path}`], {
        cwd: root,
        encoding: "utf8",
        maxBuffer: 1000000,
      }).replace(/\r\n/g, "\n");
    } else if (cached) {
      text = cached.text;
      reused++;
    } else {
      const url = `https://raw.githubusercontent.com/harshgavandit/${entry.repo}/${commit}/${path}`;
      const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
      if (!response.ok)
        throw new Error(
          `Source unavailable: ${entry.repo}/${path} (${response.status}).`,
        );
      text = (await response.text()).replace(/\r\n/g, "\n");
    }
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
  `Indexed ${files.length} explicitly selected public files from ${repositories.length} repositories (${reused} unchanged files reused). Snapshot ${snapshot.digest.slice(0, 12)}.`,
);
