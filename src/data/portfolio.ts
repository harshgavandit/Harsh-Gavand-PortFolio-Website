import sourceProjects from "./projects.json";

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
  image?: string;
  imageAlt?: string;
  diagram?: { title: string; nodes: string[]; caption: string };
}

export const profile = {
  name: "Harsh Gavand",
  email: "harsh.gavand.tech@gmail.com",
  alternateEmail: "harshgavand2@gmail.com",
  location: "Mumbai, India",
  resume: "/Harsh_Gavand_Resume.pdf",
  github: "https://github.com/harshgavandit",
  linkedin: "https://www.linkedin.com/in/harsh-gavand",
  site: "https://harsh-gavand-portfolio-website.onrender.com",
};

export const projects: Project[] = sourceProjects;
export const caseStudies: CaseStudy[] = [
  {
    projectId: 14,
    shortName: "UGC Content Platform",
    problem: "From product images to AI-powered content.",
    summary:
      "A creator platform that turns model and product assets into generated content, with authenticated sessions and credit-based usage.",
    contributions: [
      {
        label: "Frontend",
        description:
          "Responsive React creation flow with uploads and real-time generation status.",
      },
      {
        label: "Backend / APIs",
        description:
          "Node.js and Express endpoints with structured error handling.",
      },
      {
        label: "Data / integrations",
        description:
          "MongoDB project state, Clerk authentication, and Cloudinary media storage.",
      },
    ],
    diagram: {
      title: "The content creation pipeline",
      nodes: [
        "Product + model assets",
        "React creation workspace",
        "Node.js / Express API",
        "Cloudinary + MongoDB",
        "Generated content",
      ],
      caption: "Implementation map · based on the project and updated resume",
    },
  },
  {
    projectId: 3,
    shortName: "Banking App SaaS",
    problem: "Make financial workflows easier to navigate.",
    summary:
      "A banking-focused web experience for account access, financial product discovery, and transaction-oriented workflows.",
    contributions: [
      {
        label: "Frontend",
        description:
          "Dashboard flows, authentication-aware interfaces, and financial data presentation.",
      },
      {
        label: "Integrations",
        description:
          "Account and transaction workflows built around the project’s Appwrite and Plaid stack.",
      },
      {
        label: "Deployment",
        description:
          "Application setup and deployment configuration for the linked demo.",
      },
    ],
    image: "banking",
    imageAlt:
      "Actual Banking App SaaS public landing page with investment and savings options",
  },
  {
    projectId: 1,
    shortName: "GitHub Replica",
    problem: "Bring repositories and developer profiles together.",
    summary:
      "A GitHub-inspired application for repository discovery, profile views, and structured project navigation.",
    contributions: [
      {
        label: "Frontend",
        description:
          "Repository listings, profile views, routing, and reusable React components.",
      },
      {
        label: "Backend / data",
        description:
          "API integration across a Node.js, Express, and MongoDB application.",
      },
      {
        label: "Deployment",
        description:
          "Deployment-ready structure and a publicly accessible sign-in experience.",
      },
    ],
    image: "github",
    imageAlt:
      "Actual GitHub Replica sign-in page; application requires an account",
  },
  {
    projectId: 17,
    shortName: "AI News-to-Email Digest",
    problem: "Turn scattered AI news into a useful daily digest.",
    summary:
      "An automated pipeline that collects articles and transcripts, generates AI summaries, and delivers a structured email digest.",
    contributions: [
      {
        label: "Pipeline / AI",
        description:
          "Content collection, LLM summarization, and configurable article and time limits.",
      },
      {
        label: "Database",
        description:
          "SQLAlchemy models and a repository layer for articles, videos, and digests.",
      },
      {
        label: "Delivery",
        description:
          "Email formatting, structured logs, and modular Docker-based orchestration.",
      },
    ],
    diagram: {
      title: "From signal to inbox",
      nodes: [
        "Articles + transcripts",
        "Collect + normalize",
        "LLM summarization",
        "SQLAlchemy repository",
        "Email digest",
      ],
      caption: "Implementation map · a backend automation project",
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
      "Built and maintained Django and React applications, from database design through deployment.",
      "Implemented REST APIs, async tasks, and third-party service integrations.",
      "Optimized relational schemas and reusable SQL for application features and reporting.",
      "Collaborated on product delivery, reviewed code, and maintained shared coding standards.",
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
