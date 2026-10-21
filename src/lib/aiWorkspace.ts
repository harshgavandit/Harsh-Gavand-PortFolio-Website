export type CodeEvidence = {
  id: string;
  repo: string;
  title: string;
  path: string;
  commit: string;
  startLine: number;
  endLine: number;
  text: string;
  href: string;
};
export type Execution = {
  requestId: string;
  model: string;
  elapsedMs: number;
  inputTokens: number | null;
  outputTokens: number | null;
  allowanceCostUsd: number;
  sourceSnapshot: string;
  completedAt: string;
  cache?: "hit" | "miss";
  cacheCreatedAt?: string;
};
export type GuideResult = {
  answer: string;
  sources: { label: string; href: string }[];
  evidence?: CodeEvidence[];
  execution?: Execution;
};
export type RecruiterResult = {
  summary: string;
  requirements: {
    requirement: string;
    assessment: "supported" | "partial" | "not_shown";
    explanation: string;
    evidence: { id: string; label: string; href: string }[];
  }[];
  execution: Execution;
};
export type TriageResult = {
  category: string;
  priority: string;
  summary: string;
  rationale: string;
  needsReview: boolean;
  status: string;
  actionsExecuted: number;
  redactedInput: string;
  redactedFields: string[];
  execution: Execution;
};
export const ticketSamples = [
  {
    label: "Duplicate charge",
    text: "My subscription was charged twice this month. Both charges are for the same plan. Please help me get the duplicate charge reviewed.",
  },
  {
    label: "Account security",
    text: "Someone has taken over my account and changed my password. I no longer have access and I can see activity I did not authorize.",
  },
  {
    label: "Feature request",
    text: "Could you add dark mode and remember my preference across visits? This would make the application easier to use in the evening.",
  },
  {
    label: "Ambiguous request",
    text: "Something is not working, but I am not sure what happened. Can someone help me figure it out?",
  },
];
export const roleSample =
  "We are hiring a full-stack engineer with React, TypeScript, Node.js or Python, relational database design, and experience integrating AI APIs. The role also requires production Kafka operations and five years of Go experience.";
export const codeSampleGroups = [
  {
    label: "Start here",
    questions: [
      {
        label: "Which projects best show your full-stack and AI skills?",
        prompt:
          "Which of Harsh's projects best demonstrate full-stack and applied AI engineering? Explain his contributions and key architecture decisions, and link to the relevant work.",
      },
      {
        label: "What have you delivered in your professional roles?",
        prompt:
          "What did Harsh personally deliver at GlobeTrek and HRP Enterprises? Explain his responsibilities, the business problems he worked on, and his published contributions.",
      },
      {
        label: "How do you design backend APIs and databases?",
        prompt:
          "How does Harsh design backend APIs and databases? Use UGC Content Studio to explain request validation, authentication, data modeling, and ownership checks, with code references.",
      },
      {
        label: "How do you validate critical workflows and failure handling?",
        prompt:
          "How is the Banking Agent Harness tested? Explain beneficiary checks, transfer validation, later-turn confirmation, session isolation, and failure handling using its implementation and tests.",
      },
    ],
  },
  {
    label: "Project walkthroughs",
    questions: [
      {
        label: "How does UGC Content Studio generate content from an upload?",
        prompt:
          "Walk through UGC Content Studio from asset upload to AI generation and media delivery. Explain the request flow, processing states, and credit handling, with code references.",
      },
      {
        label: "How does LendFlow handle borrower and lender workflows?",
        prompt:
          "How does LendFlow handle borrower, lender, and administrator workflows? Explain authentication, loan creation, review, and lifecycle states using the available code.",
      },
      {
        label: "When does the ticket classifier ask for human review?",
        prompt:
          "How does the support-ticket classifier validate AI output, redact personal information, and decide when a ticket needs human review? Show the relevant implementation.",
      },
      {
        label: "How does the RAG project combine BM25 and vector search?",
        prompt:
          "How does the RAG project combine BM25 and vector search with Reciprocal Rank Fusion, and retain source references in its answers? Show the relevant code.",
      },
    ],
  },
  {
    label: "Reliability & safety",
    questions: [
      {
        label:
          "Where does the portfolio release a quota reservation when a client aborts?",
        prompt:
          "Where does the portfolio release a quota reservation when a client aborts? Explain cancellation, settlement, and recovery with code references.",
      },
      {
        label: "How does UGC refund credits when generation fails?",
        prompt:
          "How does UGC refund credits when generation fails? Walk through the failure path and its tests with code references.",
      },
      {
        label:
          "How does the banking agent harness require later-turn confirmation?",
        prompt:
          "How does the banking agent harness validate transfer policy and require later-turn confirmation before ledger execution? Show the relevant code and explain what happens when transfer details change.",
      },
      {
        label: "How does the portfolio keep AI usage within its budget?",
        prompt:
          "How does the portfolio enforce request limits and shared AI spending budgets before calling a model? Explain admission, quota reservation, and settlement using code references.",
      },
    ],
  },
];
