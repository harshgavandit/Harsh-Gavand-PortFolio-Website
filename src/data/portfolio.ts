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
  hostingNote?: string;
  takeaway: string;
  recovery: string;
  image?: string;
  imageAlt?: string;
  diagram?: {
    title: string;
    nodes: string[];
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
  site: "https://harsh-gavand-portfolio-website-ai.onrender.com",
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
      "Marketing teams need product and model variations without repeated manual shoots. I built a multimodal generation workflow spanning authenticated uploads, Google AI image/video requests, Cloudinary delivery, and relational project and credit records.",
    engineering: [
      "Scoped project and generation endpoints to Clerk identity so each account works with its own project records.",
      "Orchestrated Google AI image/video requests and Cloudinary uploads while persisting processing states and media URLs.",
      "Implemented Prisma/PostgreSQL credit updates and restoration after generation failures, with error state retained on the project.",
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
      chapterNodes: [[0], [1, 2], [3, 4]],
      caption:
        "Authenticated generation requests with media storage and relational project state.",
    },
    accessMode: "Sign-in to generate",
    takeaway:
      "Provider operations, credit restoration, and relational project state across a multimodal media workflow.",
    recovery:
      "Generation failures restore image credits and persist project error state.",
  },
  {
    projectId: 3,
    shortName: "LendFlow — Multi-Role Lending Platform",
    problem: "One loan lifecycle. Three product perspectives.",
    summary:
      "Borrower applications, lender review, and administrative oversight need distinct product flows. I built role-oriented lending interfaces and Express loan handlers backed by relational records and explicit approval states.",
    engineering: [
      "Defined Sequelize user and loan models with decimal financial fields, relationships, and pending / approved / rejected states.",
      "Implemented Express application, lookup, and approval/rejection handlers alongside JWT account authentication.",
      "Organized borrower, lender, and admin views around loan and repayment workflows, with Chart.js data presentation.",
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
      chapterNodes: [[0], [1, 2], [3, 4]],
      caption:
        "Role-oriented lending interfaces backed by Express controllers and Sequelize models.",
    },
    accessMode: "Public landing · account for dashboards",
    hostingNote:
      "Render-hosted deployment; the first load can take longer while the service wakes.",
    takeaway:
      "Relational loan records, explicit approval values, and role-oriented lending and repayment workflows.",
    recovery:
      "Approval and rejection handlers persist explicit status values for the loan review flow.",
  },
  {
    projectId: 1,
    shortName: "DevGraph — Repository Discovery & Issue Platform",
    problem: "Make repository and developer data navigable.",
    summary:
      "Developer collaboration depends on clear relationships between accounts, repositories, and issues. I built repository discovery and management workflows around document references, validated controllers, and independent personal/discovery feed state.",
    engineering: [
      "Modeled user, repository, and issue references in Mongoose and populated related documents for owner and issue resolution.",
      "Validated repository names and MongoDB identifiers before create, read, visibility, update, and delete operations.",
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
      chapterNodes: [[0], [1, 2], [3, 4]],
      caption:
        "Express repository routes and MongoDB relationships support client-side discovery and filtering.",
    },
    accessMode: "Account required",
    hostingNote:
      "Render-hosted deployment; the first load can take longer while the service wakes.",
    takeaway:
      "Validated repository mutations, document relationships, and independent client discovery state.",
    recovery:
      "Identifier and required-name validation reject malformed repository operations.",
  },
  {
    projectId: 17,
    shortName: "AI News Automation — Ingestion-to-Email Pipeline",
    problem: "Turn collected sources into a readable digest.",
    summary:
      "AI news sources span articles and transcripts that can be collected repeatedly. I built an ingestion-to-digest workflow with identity checks, local model inference, relational persistence, and two email output formats.",
    engineering: [
      "Checked article and video source identity in SQLAlchemy repositories before inserting newly collected material.",
      "Separated collection, Ollama summarization, digest persistence, and email formatting so pipeline stages remain inspectable.",
      "Implemented multipart text/plain and text/html SMTP delivery with source links and environment validation.",
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
      chapterNodes: [[0, 1, 2], [3], [4]],
      caption:
        "Source collection, local inference, relational persistence, and multipart email delivery.",
    },
    accessMode: "Source & local setup",
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
    tech: ["Django", "React", "Python", "JavaScript", "SQL"],
    points: [
      "Engineered full-stack Django and React application features across database design, REST APIs, interface integration, and deployment to support complete business workflows.",
      "Developed Python and JavaScript APIs, asynchronous tasks, and third-party integrations to move service work beyond the interface layer.",
      "Designed relational schemas and reusable SQL queries to support consistent application records and reporting pipelines.",
      "Delivered product and design requirements through shared full-stack features, keeping implementation conventions consistent across the codebase.",
      "Reviewed shared repository changes against coding standards to improve maintainability across collaborative delivery.",
    ],
  },
  {
    company: "HRP Enterprises",
    role: "Full-Stack Developer",
    period: "Jan 2024 — Oct 2025",
    tech: ["HTML", "CSS", "JavaScript", "React", "REST APIs"],
    points: [
      "Engineered responsive interfaces across browser and screen-size variations, supporting 1,000+ concurrent users with no reported compatibility issues.",
      "Integrated REST APIs across 10+ pages and optimized page delivery, reducing average load time by 30%.",
      "Resolved 20+ interface defects through device and screen-size fixes, improving consistency across responsive layouts.",
    ],
  },
];

export const skills = [
  {
    title: "Backend & API Architecture",
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
    title: "AI & Applied LLM Engineering",
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
    title: "Data Layer & Persistence",
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
    title: "Frontend & Product Engineering",
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
