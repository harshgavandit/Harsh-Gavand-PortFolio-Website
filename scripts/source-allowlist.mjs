export const sourceAllowlist = [
  {
    repo: "Harsh-Gavand-PortFolio-Website",
    slug: "portfolio",
    title: "Portfolio AI backend",
    files: [
      "server/quota-lifecycle.mjs",
      "server/quota.mjs",
      "server/admission.mjs",
      "server/voice.mjs",
      "server/openai.mjs",
      "server/ai-tools.mjs",
      "server/grounding.mjs",
      "server/evidence-policy.mjs",
      "server/ai-operations.mjs",
    ],
  },
  {
    repo: "ugc-project",
    slug: "ugc-platform",
    title: "UGC Content Studio",
    files: [
      "server/src/modules/projects/project.controller.ts",
      "server/src/middleware/requireAuth.ts",
      "server/prisma/schema.prisma",
      "server/tests/generation-error.test.mjs",
    ],
  },
  {
    repo: "Banking_App_SaaS",
    slug: "banking-saas",
    title: "LendFlow",
    files: [
      "backend/middleware/authMiddleware.js",
      "backend/controllers/reviewloansController.js",
      "backend/controllers/loanController.js",
    ],
  },
  {
    repo: "banking-agent-harness",
    slug: "banking-agent-harness",
    title: "Banking Agent Harness",
    files: [
      "app/services/policy_service.py",
      "app/services/transfer_service.py",
      "app/services/transaction_executor.py",
      "tests/test_banking.py",
    ],
  },
  {
    repo: "support-ticket-classifier",
    slug: "ai-support-ticket-classifier",
    title: "AI Support Ticket Classifier",
    files: [
      "schema.py",
      "graph.py",
      "production_modules/pii_redaction.py",
      "production_modules/validate_response.py",
      "tests/test_classifier.py",
    ],
  },
  {
    repo: "rag-documentation-assistant",
    slug: "hybrid-rag-documentation-assistant",
    title: "Hybrid RAG Documentation Assistant",
    files: [
      "retrieval/hybrid_search.py",
      "pipeline/nodes.py",
      "pipeline/rate_limit.py",
    ],
  },
];
