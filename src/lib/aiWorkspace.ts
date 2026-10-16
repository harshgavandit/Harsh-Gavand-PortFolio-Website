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
export const codeSamples = [
  "Where does the portfolio release a quota reservation when a client aborts?",
  "How does UGC refund credits when generation fails?",
  "How does the banking agent harness require later-turn confirmation?",
  "How does the RAG project combine BM25 and vector search?",
];
