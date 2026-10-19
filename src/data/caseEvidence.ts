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
const agriConnect =
  "https://github.com/harshgavandit/Agri-Connect/blob/9a0bb1ff88ad02c7473683afc55ef56b8e665d94";
const agri =
  "https://github.com/harshgavandit/agri-samaj-community-platform/blob/07c4b0e18d911a4668b9f696116e65236e8a29a1";

/**
 * Implementation decisions below are source analysis, not reconstructed author
 * interviews. Ownership follows the portfolio's stated contribution scope.
 * Verification links distinguish source inspection from executed synthetic checks.
 */
export const caseEvidence: Record<string, CaseEvidence> = {
  "agri-connect": {
    context:
      "Farm-product discovery, seller operations, orders, logistics, and community services often live in separate tools. AgriConnect brings these workflows into one agricultural marketplace.",
    ownership:
      "Extended the existing marketplace with configurable OpenAI workflows, validated API inputs, regression tests, hosted PostgreSQL migration, preserved administrator access, and Vercel deployment fixes. This release builds on the existing c-PRESENTS/Agri-Connect project; the upstream repository is linked below.",
    decision: {
      choice:
        "Keep a modular Express application behind same-origin API routes, with durable PostgreSQL state and server-side AI integrations.",
      alternative:
        "Split every domain into a separate service, adding deployment and coordination overhead before the product requires it.",
      reason:
        "A modular monolith keeps catalogue, commerce, organisation, and AI boundaries understandable while sharing validated contracts and one relational database. The same API can run on a persistent Node server or a Vercel function.",
    },
    verifiedBehavior: [
      "Category and visibility rules determine the public catalogue; commerce records retain seller ownership and account associations.",
      "The hosted database migration preserved 1,642 product records and existing administrator permissions; catalogue counts and record digests were compared during cutover.",
      "AI chat requires authentication. Chat history, message size, model configuration, and supported voice actions are validated on the server.",
      "The assistant uses configurable OpenAI requests for chat, translation, product search, and voice-command interpretation, with bounded timeouts and explicit fallback handling.",
      "Fourteen focused AI regression tests cover validation, authentication, provider failures, and action handling; production builds and API checks also passed for the linked release.",
    ],
    verification: [
      {
        label: "AI regression tests",
        href: agriConnect + "/tests/unit/ai-assistant.test.ts",
      },
      {
        label: "Verified release CI",
        href: "https://github.com/harshgavandit/Agri-Connect/actions/runs/39306011871",
      },
      {
        label: "Architecture & deployment notes",
        href: agriConnect + "/README.md",
      },
    ],
    limitations: [
      "The public deployment is a project demonstration. Commercial adoption, transaction volume, and farmer-income improvements have not been measured.",
      "Payment execution is configured in mock mode; production mock checkout is intentionally disabled. Real gateway and OAuth flows require provider-side setup.",
      "Periodic background work needs a persistent worker or scheduled jobs. Verification-document uploads need durable object storage before accepting real documents.",
      "The portfolio screenshot is an earlier interface capture rather than a current catalogue or activity count.",
    ],
    failure: {
      trigger:
        "An AI provider request fails, a chat request is unauthenticated, or a voice action falls outside supported commands.",
      handling:
        "The API returns a controlled error, rejects unauthenticated chat, validates action targets, and labels available fallback behaviour. The interface keeps failed responses out of subsequent conversation history.",
    },
    sources: [
      {
        label: "OpenAI configuration & request limits",
        href: agriConnect + "/backend/ai/openai.ts",
      },
      {
        label: "Authenticated AI routes",
        href: agriConnect + "/backend/modules/ai/routes.ts",
      },
      {
        label: "Marketplace persistence",
        href: agriConnect + "/backend/repositories/commerce-repository.ts",
      },
      {
        label: "Catalogue visibility rules",
        href: agriConnect + "/backend/catalog/product-visibility.ts",
      },
      { label: "Vercel API entry point", href: agriConnect + "/api/index.ts" },
      {
        label: "Original project",
        href: "https://github.com/c-PRESENTS/Agri-Connect",
      },
    ],
  },
  "agri-samaj-community-platform": {
    context:
      "Give the Agri Samaj community one place to discover local entrepreneurs, register businesses, access publications, and follow community announcements in Marathi or English.",
    ownership:
      "End-to-end Next.js interface, business onboarding and approval routes, Prisma/PostgreSQL data models, private uploads, and administration tools.",
    decision: {
      choice:
        "Separate approved public business fields from private application records and uploaded documents.",
      alternative:
        "Expose the registration record directly as a public directory entry.",
      reason:
        "Applicants can submit detailed documents without publishing them. The directory selects approved businesses, while account and upload checks control access to application data.",
    },
    verifiedBehavior: [
      "Public directory queries include approved businesses only, with search, category/location filters, and pagination limited to 50 records per request.",
      "Registration validates the payload, active category, application ownership, and attached uploads before saving.",
      "HttpOnly JWT sessions are checked against the current active database account and role.",
      "Marathi–English screens cover business discovery, registration, publications, announcements, and community administration.",
    ],
    verification: [
      {
        label: "Directory route",
        href: `${agri}/src/app/api/businesses/route.ts`,
      },
      {
        label: "Registration route",
        href: `${agri}/src/app/api/businesses/register/route.ts`,
      },
      { label: "Account & role checks", href: `${agri}/src/lib/auth.ts` },
    ],
    limitations: [
      "New business listings need administrative approval before they appear publicly.",
      "Publication content, advertising rates, and announcements are maintained by administrators; availability depends on published records.",
      "The optional census module is disabled by default and restricted to authorized teams.",
    ],
    failure: {
      trigger:
        "An applicant attaches another account's file, selects an inactive category, or tries to edit a business they do not own.",
      handling:
        "The registration route rejects invalid uploads/categories with 400 and unauthorized edits with 403 before writing the application. Missing business records return 404.",
    },
    sources: [
      {
        label: "Business registration & ownership",
        href: `${agri}/src/app/api/businesses/register/route.ts`,
      },
      {
        label: "Approved public directory",
        href: `${agri}/src/app/api/businesses/route.ts`,
      },
      { label: "Private upload checks", href: `${agri}/src/lib/uploads.ts` },
      { label: "Database schema", href: `${agri}/prisma/schema.prisma` },
      { label: "MIT license", href: `${agri}/LICENSE` },
    ],
  },
  "ugc-platform": {
    context:
      "Turn product and model reference uploads into an image, then an optional short video, while tracking the account's credits and project processing state.",
    ownership:
      "Full-stack generation endpoints, account-scoped project records, media integrations, and the creation/result interface.",
    decision: {
      choice:
        "Persist project status and media URLs around the provider workflow, with compensating credit increments in caught failure paths.",
      alternative:
        "A durable worker would claim a persisted job, store the provider operation, and resume bounded polling outside the original HTTP request. It adds worker scheduling, leases, and reconciliation; the current request-bound implementation avoids that infrastructure but cannot recover every interruption.",
      reason:
        "Persisted status and error fields let the interface recover the latest job state after a reload. Credit compensation handles caught provider errors, while interrupted or concurrent requests need separate safeguards.",
    },
    verifiedBehavior: [
      "Image generation accepts reference uploads, deducts five credits, calls the image provider, and stores the generated Cloudinary URL.",
      "Video generation polls the provider operation, uploads the result, and updates the project's processing state.",
      "Caught image-generation failures store an error and attempt to restore deducted credits.",
      "Project queries combine the project ID with the authenticated Clerk user ID to scope account access.",
    ],
    verification: [
      {
        label: "Generation & recovery controller",
        href: `${ugc}/server/src/modules/projects/project.controller.ts`,
      },
      {
        label: "Project & credit schema",
        href: `${ugc}/server/prisma/schema.prisma`,
      },
    ],
    limitations: [
      "The public demo uses saved media. Live generation requires provider credentials and account credits.",
      "Credit updates and provider requests are separate operations. Interrupted video requests can leave credits deducted; a durable reservation ledger would close that gap.",
      "Video polling currently has no timeout. A bounded worker with cancellation would prevent jobs from running indefinitely.",
    ],
    failure: {
      trigger:
        "The image provider throws or returns no usable image after credits have been deducted.",
      handling:
        "The catch handler stores the project error, clears the generating flag, attempts a five-credit refund, and returns an error response. Refunds use a separate database update, so failed compensation needs retry handling.",
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
      "React borrower and lender views, Express loan handlers, JWT authentication, and relational loan/user models.",
    decision: {
      choice:
        "Represent review outcomes as pending, approved, and rejected values on a shared Sequelize loan record.",
      alternative:
        "Track approval only as separate interface flags or an unstructured status string.",
      reason:
        "A shared status enum keeps application creation and decision handlers consistent. Authorization and concurrent decision handling still require controller guards and transactional updates.",
    },
    verifiedBehavior: [
      "New applications store the authenticated account ID and start with a pending status.",
      "Decision handlers look up the loan, return 404 when absent, and persist an approved or rejected status.",
      "Principal and interest use DECIMAL fields, with borrowerId linking each loan to its user record.",
      "JWT middleware authenticates requests to loan routes.",
    ],
    verification: [
      {
        label: "Application & decision handlers",
        href: `${lending}/backend/controllers/loanController.js`,
      },
      {
        label: "Loan schema",
        href: `${lending}/backend/models/loanModel.js`,
      },
    ],
    limitations: [
      "Loan routes authenticate accounts but need additional server-side role checks for approval and rejection.",
      "The demo uses a hard-coded JWT secret. Production deployment requires managed secrets and stronger account controls.",
      "Risk categories use example amount/term rules. The app is a lending workflow demo, with no real underwriting or funds transfer.",
    ],
    failure: {
      trigger:
        "An approval or rejection request references a loan that does not exist.",
      handling:
        "The handler returns 404 before changing the status. Other caught failures return 500; transaction-backed updates are needed for concurrent decisions and database rollback.",
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
      "Repository discovery and search UI, Express repository handlers, and MongoDB owner/issue relationships.",
    decision: {
      choice:
        "Load personal and suggested repository feeds independently and filter the loaded personal feed by name in client state.",
      alternative:
        "Send a repository search request for every change to the search field.",
      reason:
        "Filtering the loaded array avoids a network request on each keystroke. Results cover the personal feed already in memory and refresh when that feed reloads.",
    },
    verifiedBehavior: [
      "The dashboard separates personal repositories, suggestions, search input, and filtered results.",
      "Search filters loaded personal repository names with a case-insensitive substring match.",
      "Repository creation rejects missing names and malformed owner ObjectIds before saving.",
      "Repository queries populate owner and issue references; an owner-scoped query lists personal records.",
    ],
    verification: [
      {
        label: "Repository search state",
        href: `${repositories}/frontend-main/src/components/dashboard/Dashboard.jsx`,
      },
      {
        label: "Repository validation & queries",
        href: `${repositories}/backend-main/controllers/repoController.js`,
      },
    ],
    limitations: [
      "Search covers the loaded feed. Large collections would need server-side search and pagination.",
      "The public sample uses built-in data. Account-backed repository operations require a configured API endpoint.",
      "Identifier validation and visibility fields need per-user authorization checks to protect private repositories and mutations.",
    ],
    failure: {
      trigger:
        "A create request omits the repository name or supplies a malformed owner identifier.",
      handling:
        "Validation returns 400 before creating a repository document. Other caught errors return a server-error response; database recovery needs explicit retry or transaction handling.",
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
      "Source collection and persistence, digest orchestration, and plaintext/HTML email composition with SMTP integration.",
    decision: {
      choice:
        "Separate collection, content processing, digest generation, and email delivery, with a results dictionary and per-stage counts.",
      alternative:
        "Treat the entire daily job as one opaque success/failure operation.",
      reason:
        "Stage results show where a run stopped and separate digest errors from delivery errors. Durable retries and duplicate-send protection remain separate concerns.",
    },
    verifiedBehavior: [
      "The HTML and plaintext formatters turn structured digest entries into readable emails with source links.",
      "Repository methods check stored GUIDs or video IDs before creating source records.",
      "The daily runner tracks collection, processing, digest generation, delivery, duration, and overall success.",
      "Digest processing counts missing or failed model results. Email setup validates sender and recipient configuration before SMTP use.",
    ],
    verification: [
      {
        label: "Sample digest — HTML",
        href: "/evidence/news-digest.html",
      },
      {
        label: "Sample digest — plaintext",
        href: "/evidence/news-digest.txt",
      },
      {
        label: "Daily pipeline runner",
        href: `${news}/app/daily_runner.py`,
      },
    ],
    limitations: [
      "The preview renders sample content through the email formatter. It does not collect news, call a model, or send email.",
      "Source-ID checks reduce duplicates. Concurrent ingestion needs database uniqueness constraints and transactional inserts.",
      "Generation and SMTP delivery require separate configuration. A durable queue would make failed deliveries recoverable across process restarts.",
    ],
    failure: {
      trigger:
        "No recent digests are available, article ranking returns no result, or email configuration is missing.",
      handling:
        "Missing content or configuration raises ValueError. Email failures return a success:false result, while the runner captures other exceptions in its run result.",
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
        "confirm_transfer checks the staged record, invocation ID, and user text before revalidating policy. Keeping this gate in Python lets it run independently of model responses.",
    },
    verifiedBehavior: [
      "A valid transfer starts in PENDING_CONFIRMATION without changing the balance. A later confirmation completes the sample transfer and updates the in-memory ledger.",
      "Repeat confirmation returns NO_PENDING_TRANSFER. Confirmation in the initiating turn returns CONFIRMATION_REQUIRED.",
      "Blocked beneficiaries return REJECTED without a balance change. Pending transfers are isolated by session.",
      "Amount validation checks finite positive values and decimal precision. Confirmation rechecks balance and policy before calling a separate mock executor.",
    ],
    verification: [
      {
        label: "Transfer scenarios — JSON",
        href: "/evidence/banking-harness.json",
      },
      {
        label: "Confirmation & policy tests",
        href: `${harness}/tests/test_banking.py`,
      },
    ],
    limitations: [
      "This is an in-memory banking simulation with sample accounts and no connection to a bank or payment network.",
      "The replay uses saved tool outputs. Running the conversational agent requires separate model and quota-store configuration.",
      "Approvals live in session state, while accounts and transactions are process-local. Multiple workers would need shared persistence and concurrency controls.",
    ],
    failure: {
      trigger:
        "The agent attempts confirmation during the original invocation, without a matching staged session proposal, or after deterministic validation rejects the request.",
      handling:
        "The tool returns confirmation-required, no-pending-transfer, or rejected without changing the balance. Policy is checked again immediately before execution.",
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
