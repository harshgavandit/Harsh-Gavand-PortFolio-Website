export const chapters = [
  { id: "hero", label: "Introduction", navLabel: "Intro" },
  { id: "projects", label: "Selected Work", navLabel: "Work" },
  { id: "experience", label: "Experience & Impact", navLabel: "Experience" },
  { id: "skills", label: "Architecture & Skills", navLabel: "Skills" },
  { id: "contact", label: "Contact", navLabel: "Contact" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

export const recruiterPrompts = [
  {
    label: "Backend & API architecture",
    prompt: "Summarize Harsh's backend & API architecture experience",
  },
  {
    label: "AI / LLM integration",
    prompt: "How does Harsh integrate AI/LLMs into production web apps?",
  },
  {
    label: "Backend project walkthrough",
    prompt:
      "Walk me through Harsh's backend projects, their architecture, and the main tradeoffs.",
  },
];

export const curatedArchive = [
  {
    projectId: 33,
    year: "2026",
    feature: "Deterministic transfer policy and later-turn confirmation",
  },
  {
    projectId: 37,
    year: "2026",
    feature: "BM25 + vector retrieval with Reciprocal Rank Fusion",
  },
  {
    projectId: 38,
    year: "2026",
    feature: "Validated classification with redaction and review fallback",
  },
  {
    projectId: 31,
    year: "2026",
    feature: "Semantic answer reuse with source-page retention",
  },
  {
    projectId: 30,
    year: "2026",
    feature: "MCP discovery and bounded read-only SQL tools",
  },
  {
    projectId: 35,
    year: "2026",
    feature: "Separate conversational intake and approval graphs",
  },
  {
    projectId: 36,
    year: "2026",
    feature: "Async transcription → generation → speech playback",
  },
  {
    projectId: 29,
    year: "2026",
    feature: "Validated cart state across four ADK agents",
  },
];

export const engineeringPrinciples = [
  {
    title: "Define the contract",
    description:
      "Start with the product flow, API inputs, authorization boundary, and data ownership.",
    evidence: "UGC · Clerk-scoped project endpoints",
  },
  {
    title: "Keep state explicit",
    description:
      "Model the states a request can enter, including provider failures, retries, and incomplete work.",
    evidence: "Banking · pending / approved / rejected",
  },
  {
    title: "Bound external work",
    description:
      "Validate before a provider call. Limit usage and keep decisions that matter in application code.",
    evidence: "Banking harness · policy + confirmation",
  },
  {
    title: "Verify the delivery",
    description:
      "Check the API, generated assets, source references, and deployment response before calling work complete.",
    evidence: "Portfolio · pre-render + HTTP checks",
  },
];

export const heroArchitecture = [
  {
    title: "React / Next.js client",
    detail: "Typed interfaces, request state, and accessible interactions.",
    tag: "INTERFACE",
    stack: "React · TypeScript",
    projectId: 14,
  },
  {
    title: "Node.js / FastAPI gateway",
    detail:
      "Authentication, validated inputs, and request admission before external work.",
    tag: "API BOUNDARY",
    stack: "Express · FastAPI",
    projectId: 38,
  },
  {
    title: "AI & workflow layer",
    detail:
      "Provider requests, agent handoffs, and explicit processing states.",
    tag: "ORCHESTRATION",
    stack: "Google AI · OpenAI · LangGraph",
    projectId: 35,
  },
  {
    title: "Persistence & media",
    detail:
      "Relational and document records, source identity, and stored media URLs.",
    tag: "DATA",
    stack: "PostgreSQL · MongoDB · Cloudinary",
    projectId: 14,
  },
];

// Executed quota lifecycle from server/quota-lifecycle.mjs.
export const productionCode = [
  "const estimate = reservationFor(request);",
  "const reservation = await quota.reserve(estimate.amount);",
  "let providerDispatched = false;",
  "let actual;",
  "let result;",
  "try {",
  "  signal.throwIfAborted();",
  "  providerDispatched = true;",
  "  result = await generate(request, { signal });",
  "  actual = usageCost(result.usage, estimate);",
  "  await quota.settle(reservation, actual);",
  "} catch (error) {",
  "  await quota.releaseOrEnqueueRetry(reservation, {",
  "    providerDispatched,",
  "    actual,",
  "  });",
  "  if (actual === undefined) throw error;",
  "}",
  "return result;",
];

// The executable illustrative port in examples/quota_lifecycle.py.
export const pythonQuotaCode = [
  "async def generate_with_quota(request, quota, generate, check_disconnect):",
  "    async with quota.reserve(request) as reservation:",
  "        await check_disconnect()",
  "        reservation.mark_dispatched()",
  "        result = await generate(request)",
  "        await reservation.settle(result.usage)",
  "    return result",
];
