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
    caption: string;
    chapterNodes: number[][];
  };
}

export const profile = {
  name: "Harsh Gavand",
  email: "harsh.gavand.tech@gmail.com",
  alternateEmail: "harshgavand2@gmail.com",
  location: "Mumbai, India",
  github: "https://github.com/harshgavandit",
  linkedin: "https://www.linkedin.com/in/harsh-gavand",
  site: "https://harshgavand.dev",
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
      "Marketing teams need rapid product and model variations without repeated manual shoots. Engineered an end-to-end media workflow coordinating Clerk-authenticated uploads, Google AI image/video synthesis, Cloudinary CDN delivery, and PostgreSQL project and credit records.",
    engineering: [
      "Bound project queries to Clerk user identity through Prisma ownership predicates, keeping account and generation records related in PostgreSQL.",
      "Coordinated Google AI generation, provider-operation polling, and Cloudinary uploads with persisted isGenerating, output URL, and error fields.",
      "Used Prisma credit increment/decrement operations and failure-path restoration for caught generation errors, preserving project error state for the interface.",
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
      "Lending workflows span borrower origination, lender review, and administrative oversight. Engineered a role-oriented platform with relational borrower/loan records, decimal principal and interest fields, explicit review states, and React dashboards.",
    engineering: [
      "Modeled borrower foreign keys, DECIMAL(10,2) principal, DECIMAL(5,2) interest, and pending / approved / rejected loan status values in Sequelize.",
      "Implemented JWT account authentication and Express application, lookup, approval, and rejection handlers with missing-record responses.",
      "Structured borrower, lender, and admin interfaces around application, repayment, and review data, with Chart.js visualizations for financial context.",
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
      chapterNodes: [[0], [1, 2], [3, 4]],
      caption:
        "Role-oriented lending interfaces backed by Express controllers and Sequelize models.",
    },
    accessMode: "Live Multi-Role App",
    accessDescription:
      "Public landing page with authenticated, role-oriented lending dashboards",
    hostingNote:
      "Render-hosted deployment; the first load can take longer while the service wakes.",
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
      "Developer collaboration depends on traversable relationships between accounts, repositories, and issues. Engineered a repository explorer backed by Mongoose document references, Express mutation handlers, and independent personal/discovery feed state.",
    engineering: [
      "Modeled User, Repository, and Issue references in Mongoose, using owner and issue population in repository queries to resolve related documents.",
      "Validated required repository names and owner ObjectIds during creation; separated lookup, content updates, visibility toggles, and deletion into Express controllers.",
      "Separated personal and suggested repository feeds from the local search query so filtering does not trigger a network round-trip per keystroke.",
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
      chapterNodes: [[0], [1, 2], [3, 4]],
      caption:
        "Express repository routes and MongoDB relationships support client-side discovery and filtering.",
    },
    accessMode: "Live Explorer App",
    accessDescription:
      "Live repository and issue discovery platform with account access",
    hostingNote:
      "Render-hosted deployment; the first load can take longer while the service wakes.",
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
      "Repeated article and transcript collection needs stable source identity and inspectable delivery stages. Engineered a Python ingestion-to-digest pipeline with GUID/video-ID checks, local Ollama inference, SQLAlchemy persistence, and multipart SMTP output.",
    engineering: [
      "Normalized articles and videos into SQLAlchemy records, checking GUIDs and video IDs before insertion to skip sources already stored.",
      "Separated collection, local Ollama summarization, digest persistence, and email formatting; model failures return an explicit missing result instead of fabricated content.",
      "Validated recipient and SMTP configuration before delivery and generated multipart text/plain and text/html digests with original-source links.",
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
      "Engineered Django and React business workflows across relational models, REST contracts, interface state, and deployment, delivering features across the complete application lifecycle.",
      "Developed Python and JavaScript APIs, asynchronous tasks, and third-party integrations to move long-running service work into explicit backend workflows.",
      "Designed relational schemas and reusable SQL reporting queries to keep operational records consistent across application screens and reports.",
      "Reviewed shared changes against coding standards and reusable implementation patterns, keeping collaborative delivery maintainable across frontend and backend boundaries.",
    ],
  },
  {
    company: "HRP Enterprises",
    role: "Full-Stack Developer",
    period: "Jan 2024 — Oct 2025",
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
      "Engineered responsive interfaces across browser and screen-size variations, supporting 1,000+ concurrent users with no reported compatibility issues.",
      "Integrated REST APIs across 10+ pages and optimized page delivery, reducing average load time by 30%.",
      "Resolved 20+ interface defects through device and screen-size fixes, improving consistency across responsive layouts.",
    ],
  },
];

export const skills = [
  {
    title: "Backend & APIs",
    description: "Contracts, identity, and request admission.",
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
      "REST APIs",
    ],
  },
  {
    title: "Applied AI & Pipelines",
    description: "Context, provider workflows, and model output.",
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
    ],
  },
  {
    title: "Data & Persistence",
    description: "Schemas, relationships, and explicit state.",
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
    ],
  },
  {
    title: "Frontend Architecture",
    description: "Accessible interaction and application state.",
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
  {
    title: "Delivery & Developer Tooling",
    description: "Reproducible environments and reviewable changes.",
    items: [
      "Docker",
      "Docker Compose",
      "AWS",
      "GCP",
      "Linux",
      "CI/CD",
      "Cloudinary",
      "Git",
      "GitHub",
      "Postman",
      "Cursor",
      "Codex",
      "Claude Code",
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
