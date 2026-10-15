import sourceProjects from "./projects.json" with { type: "json" };
import recentSourceProjects from "./recentProjects.json" with { type: "json" };

export interface Project {
  id: number;
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
  resume: "/Harsh_Gavand_Resume.pdf",
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
    shortName: "UGC Content Platform",
    problem: "From product assets to generated marketing content.",
    summary:
      "Creators upload product and model images to generate marketing imagery and short video. I connected authentication, generation requests, media storage, and relational project state.",
    engineering: [
      "Clerk authentication scopes project endpoints to the signed-in user.",
      "Google AI generation feeds Cloudinary image and video uploads.",
      "Prisma/PostgreSQL tracks credits, generation status, errors, and media URLs.",
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
  },
  {
    projectId: 3,
    shortName: "Banking App SaaS",
    problem: "One loan lifecycle. Three product perspectives.",
    summary:
      "Borrowers request loans, lenders review opportunities, and admins manage platform records. I connected the role-oriented React interfaces to Express handlers and Sequelize models.",
    engineering: [
      "Borrower, lender, and admin screens organize distinct workflows.",
      "Express handlers create loan requests and update approval states.",
      "Sequelize models define financial fields, relationships, and loan lifecycle values.",
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
  },
  {
    projectId: 1,
    shortName: "GitHub Replica",
    problem: "Make repository and developer data navigable.",
    summary:
      "A React interface presents personal repositories, suggested projects, and developer profiles. I connected those views to Express endpoints and MongoDB repository, owner, and issue records.",
    engineering: [
      "Express handlers validate repository names and owner identifiers.",
      "MongoDB queries fetch owner-specific repositories and populate owner and issue relationships.",
      "React filters fetched repositories by name and maintains separate suggested-project state.",
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
  },
  {
    projectId: 17,
    shortName: "AI News-to-Email Digest",
    problem: "Turn collected sources into a readable digest.",
    summary:
      "A Python pipeline collects AI articles and video transcripts, summarizes selected content, and produces an email digest. I connected local model inference, repository access, and multipart email formatting.",
    engineering: [
      "Source identity checks skip articles and videos already held in the repository.",
      "Local Ollama / llama3 summarizes collected material before digest persistence.",
      "SQLAlchemy repositories and plaintext / HTML SMTP output keep storage and delivery separate.",
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
  },
];

export const experience = [
  {
    company: "Globetrek Engineering Corporation",
    role: "AI-Native Full-Stack Developer",
    period: "Nov 2025 — Sep 2026",
    tech: ["Django", "React", "Python", "JavaScript", "SQL"],
    points: [
      "Built and maintained full-stack Django and React applications, connecting database design, API development, frontend integration, and deployment.",
      "Developed REST APIs, asynchronous tasks, and third-party service integrations using Python and JavaScript.",
      "Designed relational database schemas and optimized reusable SQL queries for application features and reporting pipelines.",
      "Worked with product and design teams to deliver features while keeping shared codebases maintainable and scalable.",
      "Conducted code reviews and applied consistent coding standards across shared repositories.",
    ],
  },
  {
    company: "HRP Enterprises",
    role: "Full-Stack Developer",
    period: "Jan 2024 — Oct 2025",
    tech: ["HTML", "CSS", "JavaScript", "React", "REST APIs"],
    points: [
      "Built responsive interfaces supporting 1,000+ concurrent users with no reported cross-browser compatibility issues.",
      "Integrated REST APIs across 10+ pages and reduced average page load time by 30%.",
      "Resolved 20+ UI bugs across devices and screen sizes.",
    ],
  },
];

export const skills = [
  {
    title: "Frontend",
    description: "Interfaces that make complex products feel simple.",
    items: [
      "React",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend",
    description: "The logic behind the experience.",
    items: [
      "Node.js",
      "Express",
      "Python",
      "Django",
      "FastAPI",
      "Flask",
      "REST APIs",
      "Socket.io",
      "WebRTC",
      "Webhooks",
    ],
  },
  {
    title: "Databases",
    description: "Data modeled around the product.",
    items: [
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "SQLite",
      "SQLAlchemy",
      "Prisma",
      "Redis",
      "DynamoDB",
    ],
  },
  {
    title: "AI / LLM",
    description: "Intelligence with a practical purpose.",
    items: [
      "OpenAI API",
      "LangChain",
      "Agentic AI",
      "RAG",
      "Embeddings",
      "TensorFlow",
      "Keras",
      "Pandas",
      "NumPy",
    ],
  },
  {
    title: "DevOps / Cloud",
    description: "From local development to delivery.",
    items: [
      "Docker",
      "Docker Compose",
      "AWS",
      "GCP",
      "Linux",
      "CI/CD",
      "Cloudinary",
    ],
  },
  {
    title: "Tools",
    description: "A considered engineering toolkit.",
    items: ["Git", "GitHub", "Postman", "Cursor", "Codex", "Claude Code"],
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
