import sourceProjects from "./projects.json" with { type: "json" };
import recentSourceProjects from "./recentProjects.json" with { type: "json" };
import communitySourceProjects from "./communityProjects.json" with { type: "json" };
import platformSourceProjects from "./platformProjects.json" with { type: "json" };

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
  publicPreview?: boolean;
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
export const communityProjects: Project[] = communitySourceProjects;
export const platformProjects: Project[] = platformSourceProjects;
const latestAIIds = new Set(latestAIProjects.map((project) => project.id));
export function isLatestAIProject(projectId: number) {
  return latestAIIds.has(projectId);
}
export const projects: Project[] = [
  ...platformProjects,
  ...communityProjects,
  ...latestAIProjects,
  ...sourceProjects,
];
export const archiveProjects = projects.filter(
  (project) => !communityProjects.some((item) => item.id === project.id),
);
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
];

export const experience = [
  {
    company: "Globetrek Engineering Corporation",
    role: "AI-Native Full-Stack Developer",
    period: "Nov 2025 — Sep 2026",
    shipment:
      "Four end-to-end applications with GenAI automation, AI agents, and GIS dashboards.",
    tech: [
      "Django",
      "React",
      "Next.js",
      "Flask",
      "Python",
      "JavaScript",
      "SQL",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "REST APIs",
      "API Security",
      "Authentication",
      "Secure Data Handling",
      "AI / ML",
      "GenAI",
      "AI Agents",
      "Workflow Automation",
      "LLMs",
      "RAG",
      "LangChain",
      "LangGraph",
      "Agent Orchestration",
      "GIS",
      "Spatial Visualization",
      "RBAC",
      "Flask Blueprints",
      "Flask-WTF",
      "SQLAlchemy",
      "SQL Optimization",
      "Algorithm Design",
      "Docker",
      "Grafana",
      "k6",
      "CI/CD",
      "Full SDLC",
      "Production Deployment",
      "Server Configuration",
      "Monitoring",
      "Logging",
      "Performance Optimization",
    ],
    points: [
      "Full SDLC: Successfully completed the full SDLC for four end-to-end applications, from requirement analysis to deployment and maintenance.",
      "Scalable full-stack systems: Built scalable full-stack systems with responsive Next.js frontends and robust Flask backends, delivering seamless user experiences.",
      "GenAI workflows: Developed GenAI-powered modules to automate workflows and enhance system intelligence.",
      "AI agent orchestration: Built a fully automated AI agent using LangChain and LangGraph, capable of orchestrating complex multi-step operations.",
      "GIS dashboards: Implemented GIS-based spatial visualization dashboards, enabling data-driven insights and decision-making.",
      "Secure workflows: Integrated secure workflows with authentication, role-based access control (RBAC), secure data handling, and protected API communication.",
      "Advanced Flask development: Leveraged advanced Flask development practices, including Flask Blueprints, Flask-WTF, SQLAlchemy, and RESTful API design.",
      "Production operations: Managed production deployments, including server configuration, monitoring, logging, troubleshooting, and performance optimization.",
      "Algorithms and databases: Designed efficient algorithms, optimized SQL queries, and integrated SQL databases (PostgreSQL, MySQL) alongside NoSQL solutions (MongoDB).",
    ],
  },
  {
    company: "HRP Enterprises",
    role: "Full-Stack Developer",
    period: "Jan 2024 — Oct 2025",
    shipment:
      "Full-stack React, Node.js, and Express applications with secure REST APIs and database workflows.",
    tech: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Node.js",
      "Express",
      "REST APIs",
      "API Integration",
      "CRUD Operations",
      "Async Data Handling",
      "Input Validation",
      "Error Handling",
      "Authentication",
      "API Security",
      "Reusable Components",
      "Modular Routing",
      "SQL",
      "Database Queries",
      "Figma",
      "Responsive Design",
      "Cross-Browser Testing",
      "Debugging",
      "End-to-End Testing",
      "Performance Optimization",
      "Docker",
      "Kubernetes",
      "AWS",
      "GCP",
      "CI/CD",
      "Git",
    ],
    points: [
      "Full-Stack Development: Developed and maintained responsive web applications using React.js, Node.js, and Express.js, delivering frontend interfaces and backend functionality.",
      "REST API Development & Integration: Built and integrated RESTful APIs across 10+ pages, implementing CRUD operations, asynchronous data handling, input validation, and error management.",
      "Backend & Database Management: Developed server-side business logic, implemented database queries, and managed data retrieval, updates, and validation to support application workflows.",
      "UI Reliability & Bug Fixing: Identified and resolved 20+ frontend and integration issues through debugging, cross-browser testing, responsive design fixes, and API troubleshooting.",
      "Authentication & Reusable Architecture: Worked on authentication, protected API endpoints, reusable React components, and modular Express.js routes to improve security and maintainability.",
      "Feature Development & Performance: Converted Figma designs and business requirements into functional features, optimized frontend rendering and backend API interactions, and performed end-to-end testing to ensure reliable application performance.",
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
      { label: "Quota lifecycle", href: "#engineering-lab" },
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
      { label: "Repository discovery", href: "/work/github-replica/" },
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
