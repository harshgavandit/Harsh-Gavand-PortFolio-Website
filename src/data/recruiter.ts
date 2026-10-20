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
    label: "Give me a quick introduction",
    prompt:
      "Give me a quick introduction to Harsh: his professional experience, engineering strengths, and the kinds of products he has built.",
  },
  {
    label: "Which project should I explore first?",
    prompt:
      "Which of Harsh's projects should I explore first for full-stack, backend, or applied AI engineering? Explain what each one demonstrates and link me to it.",
  },
  {
    label: "What’s his professional experience?",
    prompt:
      "What did Harsh personally deliver at GlobeTrek and HRP Enterprises? Tell me about his responsibilities, end-to-end ownership, business applications, and automation work.",
  },
  {
    label: "How does he build backend APIs?",
    prompt:
      "How does Harsh design backend APIs? Walk me through project examples of request validation, authentication, data modeling, and the main engineering tradeoffs.",
  },
  {
    label: "How does he use AI and LLMs?",
    prompt:
      "How does Harsh use AI and LLMs in full-stack applications? Use examples from media generation, agent workflows, and retrieval.",
  },
  {
    label: "Which roles fit his experience?",
    prompt:
      "Which full-stack, backend, or applied AI roles fit Harsh's experience, and where are the gaps? What is his availability? I can share a job description for a closer comparison.",
  },
];

export const recruiterPromptGroups = [
  {
    title: "Project walkthroughs",
    questions: [
      {
        label: "How does UGC Content Studio work?",
        prompt:
          "How does UGC Content Studio work from asset upload to AI generation and media delivery? Walk through processing states and credit handling, and link to the case study.",
      },
      {
        label: "How does LendFlow handle lending?",
        prompt:
          "How does LendFlow handle borrower, lender, and administrator workflows? Walk through account access, shared loan data, and lifecycle states, and link to the case study.",
      },
      {
        label: "How does AgriConnect work?",
        prompt:
          "Walk me through AgriConnect: the marketplace stack, Harsh's contribution, OpenAI integration, hosted PostgreSQL migration, and deployment tradeoffs. Link to the live website, case study, and source code.",
      },
      {
        label: "What did he build for Agri Samaj?",
        prompt:
          "What did Harsh build for the Agri Samaj community? Explain the Marathi-English experience, business registration, approvals, and private uploads. Show me the live website, case study, and source code.",
      },
    ],
  },
  {
    title: "AI & backend decisions",
    questions: [
      {
        label: "How does he build AI agents?",
        prompt:
          "How does Harsh build AI agents while keeping actions within application rules? Use the Banking Agent Harness and another project to explain policy checks, confirmation, and approvals.",
      },
      {
        label: "How does his RAG search work?",
        prompt:
          "How does Harsh's RAG search combine vector and keyword retrieval? Walk through retrieval, ranking, and source references, and show me the project.",
      },
      {
        label: "How does he handle failures?",
        prompt:
          "How do Harsh's projects handle provider timeouts, cancelled requests, quota settlement, and retries? Walk me through the recovery flow in a project.",
      },
    ],
  },
  {
    title: "Engineering approach",
    questions: [
      {
        label: "How does he protect user data?",
        prompt:
          "How does Harsh protect user data? Show project examples of authentication, role-based access, ownership checks, private uploads, and input validation.",
      },
      {
        label: "How does he test and deploy?",
        prompt:
          "How does Harsh test and deploy his applications? Show concrete examples of automated tests, API checks, production builds, and deployment configuration from his projects.",
      },
      {
        label: "What would he improve next?",
        prompt:
          "What would be the most useful next improvements to Harsh's projects? Suggest the next technical improvements and explain how they would build on the current implementation.",
      },
    ],
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
    projectId: 29,
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
