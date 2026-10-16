// Capability matching is a conservative guard, not a semantic truth oracle.
// Exact technologies are kept distinct: JavaScript cannot substantiate Java.
const catalogue = {
  react: /\breact(?:\.js)?\b/i,
  typescript: /\btypescript\b/i,
  javascript: /\bjavascript\b/i,
  python: /\bpython\b/i,
  node: /\bnode(?:\.js|js)?\b/i,
  express: /\bexpress(?:\.js)?\b/i,
  django: /\bdjango\b/i,
  fastapi: /\bfastapi\b/i,
  next: /\bnext(?:\.js|js)?\b/i,
  postgres: /\bpostgres(?:ql)?\b/i,
  sql: /\bsql\b|relational database/i,
  mongo: /\bmongo(?:db|ose)?\b/i,
  redis: /\bredis\b|\bupstash\b/i,
  docker: /\bdocker\b/i,
  kubernetes: /\bkubernetes\b|\bk8s\b/i,
  aws: /\baws\b|amazon web services/i,
  gcp: /\bgcp\b|google cloud/i,
  llm: /\bllms?\b|\bopenai\b|\bgemini\b|\blitellm\b|\bgenai\b|AI API|AI integration/i,
  rag: /\brag\b|retrieval.augmented/i,
  gemini: /\bgemini\b|google ai|google genai/i,
  openai: /\bopenai\b/i,
  prisma: /\bprisma\b/i,
  sequelize: /\bsequelize\b/i,
  jwt: /\bjwt\b/i,
  clerk: /\bclerk\b/i,
  rbac: /\brbac\b|role.based access/i,
  kafka: /\bkafka\b/i,
  java: /\bjava\b(?!script)/i,
  go: /\bgolang\b|\bgo\b(?= experience| development| services| programming|\s*$)/i,
  rust: /\brust\b/i,
  ruby: /\bruby\b|\brails\b/i,
  graphql: /\bgraphql\b/i,
  testing: /\btesting\b|\bpytest\b|\bvitest\b/i,
  cicd: /ci\s*\/\s*cd|github actions/i,
  k6: /\bk6\b/i,
  grafana: /\bgrafana\b/i,
  quotations: /\bquotations?\b|quotation.build/i,
  invoices: /\binvoic(?:e|ing)\b/i,
  email: /email.automation|automated email|email.sending/i,
};
export const capabilityKeys = (text) =>
  Object.entries(catalogue)
    .filter(([, pattern]) => pattern.test(String(text)))
    .map(([key]) => key);
export function supportedEvidence(row, sources) {
  const requested = capabilityKeys(row.requirement);
  const relevant = sources.filter(
    (source) =>
      requested.length &&
      requested.some((key) => source.capabilities.includes(key)),
  );
  const covered = new Set(relevant.flatMap((source) => source.capabilities));
  const missing = requested.filter((key) => !covered.has(key));
  if (!relevant.length || missing.length)
    return {
      assessment: "not_shown",
      evidence: [],
      explanation: missing.length
        ? `Published evidence does not establish ${missing.join(", ")} for this requirement.`
        : "The cited records do not establish this requirement. Please discuss the relevant experience directly with Harsh.",
    };
  const duration =
    /\b(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten)[+\s-]*years?\b/i.test(
      row.requirement,
    );
  const operational =
    /production|at scale|cluster|millions?|sla|slo|on.call/i.test(
      row.requirement,
    );
  const implementation = new Set(
    relevant
      .filter(
        (source) => source.kind === "employment" || source.kind === "project",
      )
      .flatMap((source) => source.implementationCapabilities || []),
  );
  const handsOn = requested.every((key) => implementation.has(key));
  const assessment =
    row.assessment === "not_shown"
      ? "not_shown"
      : duration || operational || !handsOn || row.assessment === "partial"
        ? "partial"
        : "supported";
  return {
    assessment,
    explanation: duration
      ? "Related technology is shown; the requested duration is not established by the cited records."
      : operational
        ? "Related implementation is shown; the requested production scale or operating responsibility needs direct verification."
        : !handsOn
          ? "The technology is listed, but the cited workflow does not establish hands-on use for every requested capability."
          : row.explanation,
    evidence: assessment === "not_shown" ? [] : relevant,
  };
}

export function factualContradictions(answer, query) {
  const text = String(answer).replace(/[’‘]/g, "'").toLowerCase();
  const findings = [];
  const claims = text
    .split(/[.!?;\n]/)
    .filter(
      (sentence) =>
        !/\b(?:not|never|cannot|can't|doesn't|isn't|no guarantee|without guaranteeing)\b/.test(
          sentence,
        ) && !/before.{0,40}(?:dispatch|provider)|pre.dispatch/.test(sentence),
    );
  if (
    /quota|reservation|abort|cancel/i.test(query) &&
    claims.some((sentence) =>
      /(?:always|every|guarantee[sd]?).{0,100}(?:refund|release|zero usage)|(?:refund|release).{0,100}(?:always|every dispatch)|provider usage is zero/.test(
        sentence,
      ),
    )
  ) {
    findings.push(
      "Unconditional post-dispatch refunds are not established by the quota implementation.",
    );
  }
  if (
    /ugc|content studio/i.test(query) &&
    claims.some((sentence) =>
      /(?:guarantee|100%|zero.loss|exactly.once).{0,80}(?:credit|refund|generation)|(?:atomic|transactional).{0,50}(?:provider request|credit refund)/.test(
        sentence,
      ),
    )
  ) {
    findings.push(
      "The UGC source does not establish atomic provider-and-credit transactions.",
    );
  }
  return findings;
}
