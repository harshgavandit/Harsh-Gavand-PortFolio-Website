export interface CaseEvidence {
  context: string;
  ownership: string;
  decision: { choice: string; alternative: string; reason: string };
  verifiedBehavior: string[];
  verification: { label: string; href: string }[];
  limitations: string[];
  failure: { trigger: string; handling: string };
  sources: { label: string; href: string }[];
}

const ugc =
  "https://github.com/harshgavandit/ugc-project/blob/ca5bdf57dbe84b5db6d62cbcbaea9733801b8270";
const lending =
  "https://github.com/harshgavandit/Banking_App_SaaS/blob/47760d995abc5633f589bb57b7978f5c7444b359";
const repositories =
  "https://github.com/harshgavandit/GitHub_Replica/blob/c899592fbf6548fe8e0e71969c231868f91489a3";
const news =
  "https://github.com/harshgavandit/AI_News_To_Email_Generator/blob/0608f9a99dec2308ae9dcdebce840e5ce958445e";
const harness =
  "https://github.com/harshgavandit/banking-agent-harness/blob/2b8b094bc80bef18f75b1e50c5235c77d5a246c9";

/**
 * Implementation decisions below are source analysis, not reconstructed author
 * interviews. Ownership follows the portfolio's stated contribution scope.
 * Verification links distinguish source inspection from executed synthetic checks.
 */
export const caseEvidence: Record<string, CaseEvidence> = {
  "ugc-platform": {
    context:
      "Turn product and model reference uploads into an image, then an optional short video, while tracking the account's credits and project processing state.",
    ownership:
      "full-stack generation endpoints, account-scoped project records, media integrations, and the creation/result interface.",
    decision: {
      choice:
        "Persist project status and media URLs around the provider workflow, with compensating credit increments in caught failure paths.",
      alternative:
        "Keep generation state only in the browser and treat every provider request as an immediate result.",
      reason:
        "stored processing/error fields give subsequent project reads a concrete result to display, while explicit compensation handles caught provider errors. Separate mutations still require care around interrupted or concurrent requests.",
    },
    verifiedBehavior: [
      "Source review: image generation accepts reference uploads, deducts five credits, calls the image provider, and stores the generated Cloudinary URL.",
      "Source review: video generation polls the provider operation until done, uploads its output, and updates project processing state.",
      "Source review: caught image-generation failures record project error state and attempt to restore deducted credits.",
      "Source review: project lookup combines the project identifier with the authenticated Clerk user identifier.",
    ],
    verification: [
      {
        label: "Source review: generation and recovery controller",
        href: `${ugc}/server/src/modules/projects/project.controller.ts`,
      },
      {
        label: "Source review: relational project and credit fields",
        href: `${ugc}/server/prisma/schema.prisma`,
      },
    ],
    limitations: [
      "These records establish source behavior. They do not establish a successful paid provider generation or production load test.",
      "Credit checks, deduction, provider work, and compensation are separate operations. This is not evidence of atomic billing or universal rollback; some video early returns occur after deduction.",
      "Video polling has no demonstrated bounded completion guarantee in this source snapshot.",
    ],
    failure: {
      trigger:
        "The image provider throws or returns no usable image after credits have been deducted.",
      handling:
        "The catch path stores the error when a project exists, clears its generating flag, attempts a five-credit increment, captures the exception, and returns an error response. Compensation itself can fail; no database transaction spanning the provider call is claimed.",
    },
    sources: [
      {
        label: "Generation lifecycle and account-scoped reads",
        href: `${ugc}/server/src/modules/projects/project.controller.ts`,
      },
      {
        label: "Prisma user/project schema",
        href: `${ugc}/server/prisma/schema.prisma`,
      },
    ],
  },
  "banking-saas": {
    context:
      "Organize loan applications and review outcomes across borrower, lender, and administrator interfaces using shared loan records.",
    ownership:
      "React role-oriented views, Express loan handlers, JWT account access, and relational loan/user modeling.",
    decision: {
      choice:
        "Represent review outcomes as pending, approved, and rejected values on a shared Sequelize loan record.",
      alternative:
        "Track approval only as separate interface flags or an unstructured status string.",
      reason:
        "a common enum makes application creation and approve/reject handlers write the same vocabulary. It does not by itself enforce authorized state transitions or prevent concurrent review updates.",
    },
    verifiedBehavior: [
      "Source review: application creation writes the authenticated account identifier and an initial pending status.",
      "Source review: approval and rejection look up a loan, return 404 if absent, assign an explicit status, and save it.",
      "Source review: principal and interest use DECIMAL fields and borrowerId references a user record.",
      "Source review: loan routes use JWT authentication middleware.",
    ],
    verification: [
      {
        label: "Source review: application and review handlers",
        href: `${lending}/backend/controllers/loanController.js`,
      },
      {
        label: "Source review: loan schema",
        href: `${lending}/backend/models/loanModel.js`,
      },
    ],
    limitations: [
      "Role-oriented screens do not establish complete server-side role authorization. The reviewed loan routes apply authentication without a demonstrated reviewer-role check.",
      "The source snapshot contains a hard-coded demonstration JWT secret; it is not evidence of production-ready account security.",
      "The risk classification is example amount/term logic. No regulated underwriting accuracy, funds transfer, concurrent decision safety, or live database result is asserted here.",
    ],
    failure: {
      trigger:
        "A reviewer submits an approval or rejection for a loan identifier that cannot be found.",
      handling:
        "The handler returns a 404 response before assigning a status. Other caught errors return 500; this review did not execute database failures or verify a general rollback mechanism.",
    },
    sources: [
      {
        label: "Loan controller",
        href: `${lending}/backend/controllers/loanController.js`,
      },
      { label: "Loan model", href: `${lending}/backend/models/loanModel.js` },
      {
        label: "Route authentication boundary",
        href: `${lending}/backend/routers/loanRouter.js`,
      },
      {
        label: "JWT middleware",
        href: `${lending}/backend/middleware/authMiddleware.js`,
      },
    ],
  },
  "github-replica": {
    context:
      "Make personal and suggested repositories navigable, with repository documents linked to owners and issues.",
    ownership:
      "repository discovery and search UI, Express repository handlers, and MongoDB owner/issue relationships.",
    decision: {
      choice:
        "Load personal and suggested repository feeds independently and filter the loaded personal feed by name in client state.",
      alternative:
        "Send a repository search request for every change to the search field.",
      reason:
        "filtering the existing array avoids a search request on each keystroke. The tradeoff is that results cover the loaded personal feed and can become stale until reloaded.",
    },
    verifiedBehavior: [
      "Source review: the dashboard maintains separate personal repositories, suggestions, search query, and filtered-result state.",
      "Source review: a query/state effect filters personal repository names with a case-insensitive substring match.",
      "Source review: repository creation rejects missing names and malformed owner ObjectIds before saving.",
      "Source review: repository reads populate owner and issue document references; a separate query lists records by owner.",
    ],
    verification: [
      {
        label: "Source review: loaded-feed search state",
        href: `${repositories}/frontend-main/src/components/dashboard/Dashboard.jsx`,
      },
      {
        label: "Source review: repository validation and queries",
        href: `${repositories}/backend-main/controllers/repoController.js`,
      },
    ],
    limitations: [
      "Client-side feed reuse is not a shared cache, a benchmark, or proof of large-dataset scalability.",
      "The reviewed dashboard snapshot uses localhost API URLs. A public URL alone does not verify a working deployed repository journey.",
      "A visibility field and valid owner identifier do not establish complete privacy enforcement or authorization. Live database and multi-user access paths were not exercised for this case study.",
    ],
    failure: {
      trigger:
        "A create request omits the repository name or supplies a malformed owner identifier.",
      handling:
        "The create handler returns 400 before constructing and saving a repository. Other caught repository errors return a server-error response; database recovery was not executed in this source review.",
    },
    sources: [
      {
        label: "Repository dashboard",
        href: `${repositories}/frontend-main/src/components/dashboard/Dashboard.jsx`,
      },
      {
        label: "Repository controller",
        href: `${repositories}/backend-main/controllers/repoController.js`,
      },
      {
        label: "Repository document relationships",
        href: `${repositories}/backend-main/models/repoModel.js`,
      },
    ],
  },
  "news-automation": {
    context:
      "Collect articles and transcripts, persist source identities, generate digest entries, and compose a source-linked email with stage-level run results.",
    ownership:
      "source collection and repository methods, digest orchestration, and plaintext/HTML email composition and delivery integration.",
    decision: {
      choice:
        "Separate collection, content processing, digest generation, and email delivery, with a results dictionary and per-stage counts.",
      alternative:
        "Treat the entire daily job as one opaque success/failure operation.",
      reason:
        "stage results preserve where processing stopped and distinguish digest failures from delivery failures. They aid inspection but do not provide durable retries or exactly-once execution.",
    },
    verifiedBehavior: [
      "Executed locally: the actual digest_to_html formatter and EmailDigestResponse.to_markdown method rendered two synthetic entries and retained their source links.",
      "Source review: repository methods check stored GUIDs or video IDs before creating source records.",
      "Source review: the daily runner records scraping, processing, digest, email, duration, and overall success fields.",
      "Source review: digest processing counts failed or absent model results; email setup validates recipient and sender configuration before SMTP use.",
    ],
    verification: [
      {
        label: "Executed synthetic formatter sample — HTML",
        href: "/evidence/news-digest.html",
      },
      {
        label: "Executed synthetic formatter sample — plaintext",
        href: "/evidence/news-digest.txt",
      },
      {
        label: "Execution provenance and boundaries",
        href: "/evidence/provenance.txt",
      },
      {
        label: "Source review: daily runner",
        href: `${news}/app/daily_runner.py`,
      },
    ],
    limitations: [
      "The sample text is explicitly synthetic. No scraper, model, ranking, database, scheduler, or SMTP send was executed to produce it.",
      "Identity lookup before insert is a source-level duplicate check, not proof of exactly-once ingestion under concurrency.",
      "The source snapshot's model integration and the deterministic email formatter are separate verification boundaries; this sample proves formatting only.",
    ],
    failure: {
      trigger:
        "No recent digests are available, article ranking returns no result, or email configuration is missing.",
      handling:
        "Generation/configuration raises ValueError and send_digest_email returns a success:false error result. Other exceptions reach the daily runner's outer error handler; a successful formatter sample does not prove email delivery.",
    },
    sources: [
      {
        label: "Daily pipeline stage results",
        href: `${news}/app/daily_runner.py`,
      },
      {
        label: "Source-identity repository methods",
        href: `${news}/app/database/repository.py`,
      },
      {
        label: "Digest processing and failure counts",
        href: `${news}/app/services/process_digest.py`,
      },
      {
        label: "HTML formatter and SMTP validation",
        href: `${news}/app/services/email.py`,
      },
      {
        label: "Plaintext digest model",
        href: `${news}/app/agent/email_agent.py`,
      },
      {
        label: "Email stage error result",
        href: `${news}/app/services/process_email.py`,
      },
    ],
  },
  "banking-agent-harness": {
    context:
      "Explore how a conversational banking agent can propose transfers while deterministic Python tools control validation, explicit confirmation, and simulated transaction outcomes.",
    ownership:
      "ADK integration, deterministic transfer policy and confirmation state, mock transaction execution, usage budgets, and redacted audit events.",
    decision: {
      choice:
        "Stage a validated transfer in session state and require an allowlisted confirmation in a later invocation before executing it.",
      alternative:
        "Rely on a system-prompt instruction or a model-supplied skip-confirmation flag.",
      reason:
        "confirm_transfer reads the actual staged record, invocation identifier, and user text, then revalidates current policy. The execution gate can be inspected and tested independently of model responses.",
    },
    verifiedBehavior: [
      "Executed locally: initiating a valid synthetic request leaves the mock balance unchanged; explicit confirmation in a later invocation produces SUCCESS and updates the mock balance from 200000 to 199000.",
      "Executed locally: repeat confirmation returns NO_PENDING_TRANSFER; confirmation within the initiating invocation returns CONFIRMATION_REQUIRED.",
      "Executed locally: a blocked mock beneficiary returns REJECTED with unchanged balance, and a separate session cannot confirm the first session's proposal.",
      "Source review: amount validation checks finite positive values and decimal precision, confirmation rechecks current balance/policy, and SUCCESS/PENDING/FAILED outcomes come from a separate mock executor.",
    ],
    verification: [
      {
        label: "Executed deterministic scenarios — JSON transcript",
        href: "/evidence/banking-harness.json",
      },
      {
        label: "Execution provenance and boundaries",
        href: "/evidence/provenance.txt",
      },
      {
        label: "Source review: additional confirmation/policy tests",
        href: `${harness}/tests/test_banking.py`,
      },
    ],
    limitations: [
      "This is an in-memory banking simulation. No real accounts, banking API, payment rail, or durable transaction ledger are connected.",
      "The executed scenarios call real deterministic functions with a synthetic ToolContext fixture. They do not verify an LLM conversation, ADK browser flow, Upstash quota integration, or live provider availability.",
      "Pending approvals use session state, while mock accounts and transactions are process-local. Cross-process persistence and production concurrency are outside the verified behavior.",
    ],
    failure: {
      trigger:
        "The agent attempts confirmation during the original invocation, without a matching staged session proposal, or after deterministic validation rejects the request.",
      handling:
        "The tool returns an explicit confirmation-required, no-pending-transfer, or rejected status. The executed rejection and confirmation checks leave the mock balance unchanged; policy is revalidated again before execution.",
    },
    sources: [
      {
        label: "Transfer tools and later-turn gate",
        href: `${harness}/app/tools/banking_tools.py`,
      },
      {
        label: "Deterministic transfer policy",
        href: `${harness}/app/services/policy_service.py`,
      },
      {
        label: "Pending-transfer state",
        href: `${harness}/app/services/transfer_service.py`,
      },
      {
        label: "Controlled mock executor",
        href: `${harness}/app/services/transaction_executor.py`,
      },
      {
        label: "Mock account and transaction data",
        href: `${harness}/app/mock_data.py`,
      },
      { label: "Banking tests", href: `${harness}/tests/test_banking.py` },
    ],
  },
};
