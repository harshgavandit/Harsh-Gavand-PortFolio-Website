import { caseStudies, type CaseStudy } from "./portfolio.ts";

export const harnessStudy: CaseStudy = {
  projectId: 33,
  shortName: "Banking Agent Harness",
  problem:
    "Keep model-selected actions inside deterministic transaction rules.",
  summary:
    "A banking simulation that validates model-selected transfers in Python, requires a separate confirmation turn, and checks results against an in-memory ledger.",
  engineering: [
    "Policy before execution: Validate beneficiaries, balance, and transfer limits in Python before a mock transaction is allowed.",
    "Confirmation state: Require explicit confirmation in a later invocation, and invalidate pending approval when transfer details change.",
    "Observable outcomes: Separate successful, failed, and pending mock execution; redact audit details and bound agent usage.",
  ],
  contributions: [],
  previewNote:
    "Replay transfer scenarios with sample accounts and an in-memory ledger. No real funds are moved.",
  accessMode: "Read-only policy replay",
  accessDescription:
    "Explore deterministic mock transfer outcomes without an account or API key",
  takeaway:
    "Model intent is untrusted input; policy and confirmation remain application decisions.",
  recovery:
    "Changed transfer details invalidate pending confirmation; execution results are checked against the mock ledger.",
  diagram: {
    title: "From agent intent to a confirmed transaction",
    nodes: [
      "Agent tool intent",
      "Deterministic policy",
      "Later-turn confirmation",
      "Mock execution",
      "Result validation",
    ],
    details: [
      "Tool arguments describe a requested action, not permission",
      "Validate beneficiary, amount, balance, and daily limits",
      "Pending details must match a later explicit confirmation",
      "Only permitted, confirmed requests reach the mock ledger",
      "Inspect mock execution status and redact the audit record",
    ],
    contracts: [
      "Model-selected tool → structured intent",
      "Transfer intent → allow or reject",
      "Pending intent + later confirmation → permission",
      "Permitted request → mock transaction",
      "Mock transaction → checked ledger result",
    ],
    caption:
      "A local banking simulation, with deterministic controls around model-selected tools.",
    chapterNodes: [[0, 1], [2], [3, 4]],
  },
};

export const communityStudy: CaseStudy = {
  projectId: 39,
  shortName: "Agri Samaj — Open-Source Community Platform",
  problem: "A shared digital home for the Agri Samaj community.",
  summary:
    "An open-source Marathi–English platform built specifically for the Agri Samaj community. It helps people discover local businesses, support community entrepreneurs, access publications and announcements, and stay connected through shared community services.",
  engineering: [
    "Community workflows: Built a bilingual Next.js platform with business discovery, five-step entrepreneur registration, saved drafts, application tracking, and administrative approvals.",
    "Access & document privacy: Bound protected routes to active database accounts and roles, validated upload ownership, and kept verification documents in private storage.",
    "Relational publishing: Modeled business applications, categories, publications, announcements, and audit logs in PostgreSQL through Prisma, exposing approved directory fields to public visitors.",
  ],
  contributions: [
    {
      label: "Product",
      description: "Marathi–English business discovery and community content.",
    },
    {
      label: "Backend",
      description:
        "Validated routes, account-scoped registration, approvals, and private files.",
    },
    {
      label: "Data",
      description:
        "Prisma/PostgreSQL models, migrations, rate limits, and audit logs.",
    },
  ],
  previewNote:
    "Browse the live directory and community content without an account. Business registration and administrative tools require sign-in.",
  accessMode: "Open Source · Live Community Platform",
  accessDescription:
    "Public Marathi–English community website, deployed on Vercel",
  takeaway:
    "Bilingual community services backed by relational workflows, server-side access checks, and private document storage.",
  recovery:
    "Invalid or unowned uploads are rejected before registration is saved. Drafts let applicants complete the process over multiple sessions.",
  diagram: {
    title: "Community application to an approved public listing",
    nodes: [
      "Marathi–English UI",
      "Session & validation",
      "Application workflow",
      "Prisma / PostgreSQL",
      "Approved directory",
    ],
    details: [
      "Business discovery, a five-step registration form, and account dashboards",
      "HttpOnly JWT session, active account/role checks, Zod payload validation, and rate limits",
      "Draft persistence, applicant ownership, upload ownership checks, and administrative decisions",
      "Relational business/category records, application states, audit logs, and private upload references",
      "Approved-only business queries with search, category/location filters, and bounded pagination",
    ],
    contracts: [
      "Visitor or applicant input → localized application request",
      "Account + validated payload → permitted route action",
      "Owned application + private uploads → draft or submitted record",
      "Application decision → persisted business state",
      "Approved records → public business fields only",
    ],
    caption:
      "Community discovery and entrepreneur onboarding with separate public and private data paths.",
    chapterNodes: [[0], [1, 2], [3, 4]],
  },
};

export const workStudies = [...caseStudies, harnessStudy, communityStudy];
export const featuredStudies = [
  caseStudies[0],
  caseStudies[1],
  communityStudy,
  harnessStudy,
  caseStudies[3],
];
export const sampleWorkspaceURLs: Record<string, string> = {
  "ugc-platform": "https://ugc-project-harsh.vercel.app/demo",
  "banking-saas": "https://banking-app-saas.onrender.com/?demo=1",
  "github-replica": "https://github-replica.onrender.com/?demo=1",
};
export const primaryStack = [
  "React",
  "TypeScript",
  "Python",
  "Node.js",
  "PostgreSQL",
  "Docker",
];
