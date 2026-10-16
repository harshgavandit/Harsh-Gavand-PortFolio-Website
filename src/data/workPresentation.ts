import { caseStudies, type CaseStudy } from "./portfolio.ts";

export const harnessStudy: CaseStudy = {
  projectId: 33,
  shortName: "Banking Agent Harness",
  problem:
    "Keep model-selected actions inside deterministic transaction rules.",
  summary:
    "A banking simulation that puts policy checks, a separate confirmation turn, and execution verification between an AI agent and a mock ledger.",
  engineering: [
    "Policy before execution: Validate beneficiaries, balance, and transfer limits in Python before a mock transaction is allowed.",
    "Confirmation state: Require explicit confirmation in a later invocation, and invalidate pending approval when transfer details change.",
    "Observable outcomes: Separate successful, failed, and pending mock execution; redact audit details and bound agent usage.",
  ],
  contributions: [],
  previewNote:
    "Local deterministic harness output with synthetic accounts. No real funds, bank integration, or provider call.",
  accessMode: "Read-only policy replay",
  accessDescription:
    "Explore deterministic mock transfer outcomes without an account or API key",
  takeaway:
    "Model intent is untrusted input; policy and confirmation remain application decisions.",
  recovery:
    "Changed transfer details invalidate pending confirmation; execution results are checked against the mock ledger.",
  diagram: {
    title: "Agent intent to verified mock execution",
    nodes: [
      "Agent tool intent",
      "Deterministic policy",
      "Later-turn confirmation",
      "Mock execution",
      "Outcome verification",
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
      "Mock transaction → verified outcome",
    ],
    caption:
      "A local banking simulation, with deterministic controls around model-selected tools.",
    chapterNodes: [[0, 1], [2], [3, 4]],
  },
};

export const workStudies = [...caseStudies, harnessStudy];
export const featuredStudies = [
  caseStudies[0],
  caseStudies[1],
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
