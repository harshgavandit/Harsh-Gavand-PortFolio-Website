import sourceProjects from "./projects.json" with { type: "json" };
import recentSourceProjects from "./recentProjects.json" with { type: "json" };

export interface Project {
  id: number;
  slug: string;
  aliases?: string[];
  title: string;
  category: string;
  overview: string;
  features: string[];
  technologies: string[];
  role: string;
  challenges: string;
  impact: string;
  githubUrl: string;
  demoUrl?: string;
}

export interface CaseStudy {
  projectId: number;
  shortName: string;
  problem: string;
  summary: string;
  contributions: { label: string; description: string }[];
  engineering: string[];
  previewNote: string;
  accessMode: string;
  accessDescription: string;
  hostingNote?: string;
  takeaway: string;
  recovery: string;
  image?: string;
  imageAlt?: string;
  diagram?: {
    title: string;
    nodes: string[];
    details: string[];
    contracts: string[];
    caption: string;
    chapterNodes: number[][];
  };
}

export const profile = {
  name: "Harsh Gavand",
  email: "harshgavand2@gmail.com",
  alternateEmail: "harsh.gavand.tech@gmail.com",
  location: "Mumbai, India",
  workPreference: "Remote only",
  availability:
    "Mumbai, India · Open to Full-Stack, Backend & AI Engineering Roles (Remote only)",
  github: "https://github.com/harshgavandit",
  linkedin: "https://www.linkedin.com/in/harsh-gavand",
  site: "https://harshgavand.dev",
  resume: "/resume.pdf",
};

export const latestAIProjects: Project[] = recentSourceProjects;
const latestAIIds = new Set(latestAIProjects.map((project) => project.id));
export function isLatestAIProject(projectId: number) {
  return latestAIIds.has(projectId);
}
export const projects: Project[] = [...latestAIProjects, ...sourceProjects];
export function projectSlug(id: number) {
  const project = projects.find((item) => item.id === id);
  if (!project) throw new Error("Unknown project");
  return project.slug;
}

// Shared published About content for the page and assistant knowledge.
export const aboutProfile = {
  summary:
    "I build full-stack applications, backend APIs, and applied AI workflows. My work connects React and TypeScript interfaces to Node.js and Python services, relational and document databases, and external model and media providers.",
  experience: "2+ years",
  education: {
    degree: "B.Tech · Information Technology",
    details: "Pillai University, Mumbai · July 2025 · CGPA 8.6",
  },
  recognition: [
    "Top 5 — Supervity AI Hackathon, 500+ participants, built in 24 hours",
    "Top 10 — OpenAI Builders Hackathon, Memory Graph AI, 500+ builders",
    "Top 100 — Smart India Hackathon 2025, national level, 500+ teams",
  ],
};
export const caseStudies: CaseStudy[] = [
  {
    projectId: 14,
    shortName: "UGC Content Studio — AI Media Generation Pipeline",
    problem: "From product assets to generated marketing content.",
    summary:
      "Automated media pipeline that combines product and model references into campaign images and short videos through Google AI and Cloudinary CDN.",
    engineering: [
      "Multimodal orchestration: Chained image synthesis and long-running video-operation polling, persisting processing state, media URLs, and failure diagnostics in PostgreSQL.",
      "Credit accounting & failure recovery: Applied Prisma credit mutations and restoration paths for caught generation failures, retaining project errors for recovery in the interface.",
      "Identity-scoped media pipeline: Bound project access to Clerk identity while coordinating multipart reference uploads and generated-media persistence through Cloudinary.",
    ],
    contributions: [
      {
        label: "Frontend",
        description:
          "React and TypeScript creation, project, and result views with generation and error states.",
      },
      {
        label: "Backend / APIs",
        description:
          "Express project endpoints connect Clerk identity to Google AI image and video requests.",
      },
      {
        label: "Data / integrations",
        description:
          "Prisma/PostgreSQL project records, credit restoration, Clerk provisioning, and Cloudinary media.",
      },
    ],
    previewNote: "Sign in with Clerk to create and manage generations.",
    diagram: {
      title: "Generation request lifecycle",
      nodes: [
        "React asset upload",
        "Express + Clerk",
        "Google AI generation",
        "Cloudinary media",
        "Prisma / PostgreSQL",
      ],
      details: [
        "Product and model references, prompt fields, and generation UI state",
        "Authenticated identity, multipart inputs, and account-scoped project lookup",
        "Image synthesis followed by video-operation polling",
        "Uploaded reference assets and generated media URLs",
        "User/project relations, integer credits, and persisted error state",
      ],
      contracts: [
        "Product/model references + prompt → generation request",
        "Clerk identity + project identifier → account-scoped project",
        "Reference media + prompt → image / video operation",
        "Media upload → stored delivery URL",
        "Generation result → credits, media URL, processing/error state",
      ],
      chapterNodes: [[0], [1, 2], [3, 4]],
      caption:
        "Authenticated generation requests with media storage and relational project state.",
    },
    accessMode: "Clerk Auth · Live App",
    accessDescription: "Live Vercel deployment with Clerk authentication",
    takeaway:
      "Provider operations, credit restoration, and relational project state across a multimodal media workflow.",
    recovery:
      "Caught image-generation errors restore credits and persist project error state.",
  },
  {
    projectId: 3,
    shortName: "LendFlow — Multi-Role Lending & Underwriting Platform",
    problem: "One loan lifecycle. Three product perspectives.",
    summary:
      "Loan origination, underwriting review, and repayment interfaces organized around borrower, lender, and administrator workflows. Shared loan records keep review outcomes visible across the product.",
    engineering: [
      "Explicit underwriting state: Persisted pending, approved, and rejected decisions through a shared loan model so review interfaces read the same lifecycle values.",
      "Financial data modeling: Used fixed-point principal and interest storage with relational borrower records, keeping financial inputs distinct from presentation and review state.",
      "Role-oriented product architecture: Organized borrower, lender, and administrator React views around JWT-authenticated accounts, review queues, repayments, and Chart.js visualizations.",
    ],
    contributions: [
      {
        label: "Frontend",
        description:
          "Role-oriented React dashboards, loan forms, repayment views, and Chart.js data presentation.",
      },
      {
        label: "Backend / APIs",
        description:
          "Express loan and account routes, JWT authentication, and approve/reject handlers.",
      },
      {
        label: "Data / integrations",
        description:
          "Sequelize loan and user models with pending, approved, and rejected states.",
      },
    ],
    image: "banking",
    imageAlt:
      "Banking application landing page introducing lending and investment workflows",
    previewNote:
      "Open the landing page; account access is needed for borrower, lender, and admin views.",
    diagram: {
      title: "Loan request and review flow",
      nodes: [
        "React role dashboards",
        "JWT / Express API",
        "Loan review handlers",
        "Sequelize / SQL records",
        "Repayment + reporting",
      ],
      details: [
        "Borrower forms, lender review, and administrative views",
        "Account authentication and JSON request/response boundaries",
        "Loan lookup, missing-record handling, and explicit approval values",
        "Borrower foreign keys, decimal principal/rate fields, and timestamps",
        "Repayment interfaces and Chart.js data presentation",
      ],
      contracts: [
        "Application / review input → loan or dashboard request",
        "Authenticated account request → loan controller",
        "Loan identifier + decision → persisted review status",
        "Borrower relationship + financial inputs → loan record",
        "Loan / repayment records → financial interface state",
      ],
      chapterNodes: [[0], [1, 2], [3, 4]],
      caption:
        "Role-oriented lending interfaces backed by Express controllers and Sequelize models.",
    },
    accessMode: "Live Multi-Role App",
    accessDescription:
      "Public landing page with authenticated, role-oriented lending dashboards",
    takeaway:
      "Relational loan records, explicit approval values, and role-oriented lending and repayment workflows.",
    recovery:
      "Approval and rejection handlers persist explicit status values for the loan review flow.",
  },
  {
    projectId: 1,
    shortName: "DevGraph — Repository Discovery & Issue Indexing Platform",
    problem: "Make repository and developer data navigable.",
    summary:
      "Repository discovery built around a connected user–repository–issue graph. Independent feed snapshots and local search state keep discovery responsive without refetching on every keystroke.",
    engineering: [
      "Request orchestration & result reuse: Loaded personal and suggested repository feeds into independent client state, reusing those results during local searches without repeated API polling.",
      "Search state & document graph resolution: Separated the name query from feed state while Mongoose references and population resolve repository owners and linked issues.",
      "Deterministic feed boundaries: Kept personal and discovery results independently addressable, with explicit repository visibility operations and creation-time identity validation.",
    ],
    contributions: [
      {
        label: "Frontend",
        description:
          "Repository discovery, name filtering, profile views, and account screens in React.",
      },
      {
        label: "Backend / APIs",
        description:
          "Express repository create, read, update, visibility, and delete handlers.",
      },
      {
        label: "Data / integrations",
        description:
          "MongoDB user, repository, and issue documents with ownership and relationship queries.",
      },
    ],
    image: "github",
    imageAlt: "GitHub Replica account sign-in interface",
    previewNote:
      "Create an account or sign in to explore personal repository views.",
    diagram: {
      title: "Repository discovery request path",
      nodes: [
        "React repository explorer",
        "Express REST handlers",
        "Owner-specific queries",
        "MongoDB relationships",
        "Repository + profile views",
      ],
      details: [
        "Separate personal and discovery state with local name filtering",
        "Repository creation, lookup, content, visibility, and delete operations",
        "Required names and owner ObjectId validation during creation",
        "Mongoose references and owner/issue document population",
        "Resolved repository records and developer account screens",
      ],
      contracts: [
        "Loaded feed + search query → filtered repository names",
        "Repository action → dedicated REST handler",
        "Creation name + owner identifier → validated input",
        "Repository document → populated owner / issue references",
        "Resolved records → personal or discovery workspace",
      ],
      chapterNodes: [[0], [1, 2], [3, 4]],
      caption:
        "Express repository routes and MongoDB relationships support client-side discovery and filtering.",
    },
    accessMode: "Live Explorer App",
    accessDescription:
      "Live repository and issue discovery platform with account access",
    takeaway:
      "Validated repository mutations, document relationships, and independent client discovery state.",
    recovery:
      "Repository creation rejects missing names and malformed owner identifiers.",
  },
  {
    projectId: 17,
    shortName: "AI News Automation — Ingestion-to-Email Pipeline",
    problem: "Turn collected sources into a readable digest.",
    summary:
      "A daily source-to-email pipeline turns AI articles and video transcripts into source-linked digests. Per-stage results distinguish collection, processing, generation, and delivery failures across a repeatable run.",
    engineering: [
      "Daily ingestion orchestration: Coordinated scraping, transcript/markdown processing, digest generation, and email through a bounded runner with per-stage counts and explicit success/error results.",
      "Source-identity deduplication: Checked GUIDs and video IDs against normalized SQLAlchemy records to skip stored material, keeping duplicate checks at the persistence boundary.",
      "Fault-isolated generation & delivery: Preserved missing-model results and delivery errors as inspectable outcomes; validated SMTP inputs before composing source-linked plaintext and HTML messages.",
    ],
    contributions: [
      {
        label: "Pipeline / AI",
        description:
          "Article and transcript collection, source identity checks, and local Ollama summarization.",
      },
      {
        label: "Database",
        description:
          "SQLAlchemy models and repository methods for source records, videos, and digests.",
      },
      {
        label: "Delivery",
        description:
          "Multipart plaintext / HTML email formatting, SMTP delivery, and Docker orchestration.",
      },
    ],
    previewNote:
      "The product output is a multipart email digest. Inspect the formatter and run instructions in the repository.",
    diagram: {
      title: "Source-to-digest pipeline",
      nodes: [
        "Articles + transcripts",
        "Source identity checks",
        "Ollama summarization",
        "SQLAlchemy repository",
        "Multipart SMTP digest",
      ],
      details: [
        "Source titles, URLs, publication dates, and transcript content",
        "GUID/video-ID lookups skip previously stored material",
        "Local llama3 inference with explicit generation-failure results",
        "Normalized source records, digest storage, and repository commits",
        "Validated recipients/credentials and plaintext plus HTML output",
      ],
      contracts: [
        "Article / transcript → source title, URL, date, content",
        "GUID or video ID → existing-source lookup",
        "Collected source text → digest or explicit missing result",
        "Source-linked digest → committed relational record",
        "Validated recipient + digest → multipart SMTP message",
      ],
      chapterNodes: [[0, 1, 2], [3], [4]],
      caption:
        "Source collection, local inference, relational persistence, and multipart email delivery.",
    },
    accessMode: "Local Pipeline App",
    accessDescription:
      "Runnable ingestion and email pipeline; repository includes local setup instructions",
    takeaway:
      "Duplicate-aware ingestion, local model orchestration, relational persistence, and inspectable SMTP delivery.",
    recovery:
      "Source identity checks skip stored material; missing email configuration rejects delivery before SMTP.",
  },
];

export const experience = [
  {
    company: "Globetrek Engineering Corporation",
    role: "AI-Native Full-Stack Developer",
    period: "Nov 2025 — Sep 2026",
    shipment:
      "Django + React business applications with REST services, relational records, and SQL reporting.",
    tech: [
      "Django",
      "React",
      "Python",
      "JavaScript",
      "SQL",
      "REST APIs",
      "AI / ML",
      "LLMs",
      "RAG",
      "Docker",
      "Grafana",
      "k6",
      "CI/CD",
    ],
    points: [
      "Production API architecture: Engineered Python and JavaScript REST services, asynchronous tasks, and third-party integrations to support complete Django + React business workflows.",
      "Relational modeling & reporting: Designed SQL schemas and reusable reporting queries to keep operational records consistent across product screens and downstream reports.",
      "Full-stack delivery & review: Owned features from interface state through deployment, using code reviews and shared implementation patterns to keep releases maintainable.",
    ],
  },
  {
    company: "HRP Enterprises",
    role: "Full-Stack Developer",
    period: "Jan 2024 — Oct 2025",
    shipment:
      "Responsive product interfaces and REST-driven views spanning 10+ pages.",
    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Express",
      "REST APIs",
      "SQL",
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
      "CI/CD",
      "Git",
    ],
    points: [
      "Responsive product architecture: Engineered interfaces supporting 1,000+ concurrent users across browsers and screen sizes with no reported compatibility issues.",
      "API-driven rendering & performance: Integrated asynchronous REST data flows across 10+ pages, reducing average page load time by 30%.",
      "Interface reliability & defect resolution: Fixed 20+ UI defects through device and screen-size corrections, improving consistency across responsive layouts.",
    ],
  },
];

export const engineeringSprints = [
  {
    title: "Supervity Autopilot Hackathon",
    kind: "Multi-agent systems / 24-hour build",
    summary:
      "Architected a multi-agent AI operational command center for automated enterprise workflows, with role-based access and human oversight.",
    href: "https://github.com/harshgavandit/SuperVity-AutoPilot-AI-Hackathon",
  },
  {
    title: "PromptWars AI Engineering Competition",
    kind: "AI engineering / competitive sprint",
    summary:
      "Built and deployed AI challenge repositories under timed competitive constraints.",
    href: null,
  },
];

export const skills = [
  {
    title: "Backend & Distributed APIs",
    description: "Contracts, identity, and request admission.",
    patterns:
      "Validated API boundaries, shared rate limits, async tasks, and idempotent quota settlement.",
    proofs: [
      { label: "Production experience", href: "#experience" },
      { label: "Quota lifecycle", href: "#hero" },
    ],
    items: [
      "Node.js",
      "Express",
      "Python",
      "Django",
      "FastAPI",
      "Flask",
      "REST API Design",
      "JWT / Clerk",
      "Rate Limiting & Quotas",
      "Idempotent Quota Settlement",
      "Socket.io",
      "WebRTC",
      "Webhooks",
      "Async Tasks & Queues",
    ],
  },
  {
    title: "Applied AI & Agentic Workflows",
    description: "Context, provider workflows, and model output.",
    patterns:
      "Multimodal provider orchestration, context retrieval, agent handoffs, and bounded token accounting.",
    proofs: [
      { label: "UGC media pipeline", href: "#ugc-platform" },
      { label: "Memory Graph AI sprint", href: "#hackathon-recognition" },
    ],
    items: [
      "Google AI / GenAI",
      "OpenAI API",
      "Google ADK",
      "LangChain",
      "LangGraph",
      "Agentic AI",
      "RAG",
      "Embeddings",
      "Prompt & Context Orchestration",
      "Usage Accounting",
      "Multimodal Media Pipelines",
      "TensorFlow",
      "Keras",
      "Pandas",
      "NumPy",
      "LLM Memory Graphs",
    ],
  },
  {
    title: "Data Modeling & Cloud Infrastructure",
    description: "Persistent state, reproducible environments, and delivery.",
    patterns:
      "Relational state, document references, atomic quota operations, media delivery, and reproducible deployments.",
    proofs: [
      { label: "UGC persistence", href: "#ugc-platform" },
      { label: "LendFlow data model", href: "#banking-saas" },
    ],
    items: [
      "PostgreSQL",
      "Prisma",
      "Sequelize",
      "MongoDB",
      "Mongoose",
      "MySQL",
      "SQLite",
      "SQLAlchemy",
      "Redis",
      "DynamoDB",
      "Schema Design",
      "Loan Lifecycle Models",
      "Docker",
      "Docker Compose",
      "AWS",
      "GCP",
      "Linux",
      "Vercel CI/CD",
      "Cloudinary",
      "Git / GitHub",
      "Postman",
      "Cursor",
      "Codex",
      "Claude Code",
      "ACID Transactions",
    ],
  },
  {
    title: "Frontend Architecture & UX",
    description: "Accessible interaction and application state.",
    patterns:
      "ARIA tabs and dialogs, independent feed state, role-oriented dashboards, and responsive product workflows.",
    proofs: [
      { label: "LendFlow dashboards", href: "#banking-saas" },
      { label: "Repository discovery", href: "#github-replica" },
    ],
    items: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "WAI-ARIA Tabs & Dialogs",
      "State Management",
      "Performance Optimization",
    ],
  },
];

export const workflow = [
  [
    "Idea",
    "Understand the user, the problem, and what a useful outcome looks like.",
  ],
  [
    "Architecture",
    "Define boundaries, data models, and the smallest useful system.",
  ],
  [
    "Development",
    "Build clear interfaces and reusable, maintainable components.",
  ],
  [
    "APIs / Database",
    "Connect product flows with deliberate contracts and data access.",
  ],
  [
    "Testing",
    "Check user journeys, edge cases, responsiveness, and error states.",
  ],
  [
    "Deployment",
    "Configure environments, ship the application, and verify the result.",
  ],
];
