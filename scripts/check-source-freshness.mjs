import snapshot from "../src/data/sourceSummary.json" with { type: "json" };
const findings = [];
for (const repo of snapshot.repositories) {
  const response = await fetch(
    `https://api.github.com/repos/harshgavandit/${repo.repo}/commits?per_page=1`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        ...(process.env.GITHUB_TOKEN
          ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
          : {}),
      },
      signal: AbortSignal.timeout(15000),
    },
  );
  if (!response.ok)
    throw new Error(`Could not check ${repo.repo} (${response.status}).`);
  const [latest] = await response.json();
  // Only changes to selected files invalidate the index; unrelated README or
  // generated evaluation updates must not cause an endless refresh cycle.
  if (latest.sha !== repo.commit) {
    const compare = await fetch(
      `https://api.github.com/repos/harshgavandit/${repo.repo}/compare/${repo.commit}...${latest.sha}`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          ...(process.env.GITHUB_TOKEN
            ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
            : {}),
        },
        signal: AbortSignal.timeout(15000),
      },
    );
    if (!compare.ok) throw new Error(`Could not compare ${repo.repo}.`);
    const delta = await compare.json();
    const { sourceAllowlist } = await import("./source-allowlist.mjs");
    const paths = sourceAllowlist.find((item) => item.repo === repo.repo).files;
    if (
      (delta.files || []).length >= 300 ||
      delta.files?.some(
        (file) =>
          paths.includes(file.filename) ||
          paths.includes(file.previous_filename),
      )
    )
      findings.push(repo.repo);
  }
}
if (findings.length) {
  console.error(
    `Indexed code changed: ${findings.join(", ")}. Run npm run ai:index, then evaluate and publish the new snapshot.`,
  );
  process.exitCode = 1;
} else
  console.log(
    `All selected source files remain current across ${snapshot.repositories.length} public repositories.`,
  );
