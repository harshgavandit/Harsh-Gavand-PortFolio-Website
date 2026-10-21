export type StackMotif =
  | "api"
  | "ai"
  | "data"
  | "workflow"
  | "terminal"
  | "analysis"
  | "vision"
  | "code"
  | "orbit";
export type StackItem =
  | { name: string; brand: string; motif?: never }
  | { name: string; motif: StackMotif; brand?: never };
const brand = (name: string, slug: string): StackItem => ({
  name,
  brand: slug,
});
const pattern = (name: string, motif: StackMotif): StackItem => ({
  name,
  motif,
});

// Core tools evidenced by employment records and linked projects.
// WebRTC remains because the linked video-conferencing application uses it.
export const resumeStackGroups = [
  {
    id: "frontend",
    title: "Frontend & interfaces",
    items: [
      brand("React", "react"),
      brand("Next.js", "nextdotjs"),
      brand("TypeScript", "typescript"),
      brand("JavaScript ES6+", "javascript"),
      brand("Tailwind CSS", "tailwindcss"),
    ],
  },
  {
    id: "backend",
    title: "Backend & realtime",
    items: [
      brand("Python", "python"),
      brand("Node.js", "nodedotjs"),
      brand("Express", "express"),
      brand("Django", "django"),
      brand("Django REST Framework", "django"),
      brand("Flask", "flask"),
      brand("FastAPI", "fastapi"),
      pattern("REST APIs", "api"),
      brand("JWT Auth", "jsonwebtokens"),
      brand("Clerk", "clerk"),
      brand("Socket.io", "socketdotio"),
      brand("WebRTC", "webrtc"),
    ],
  },
  {
    id: "data",
    title: "Databases & persistence",
    items: [
      brand("MongoDB", "mongodb"),
      brand("PostgreSQL", "postgresql"),
      brand("MySQL", "mysql"),
      brand("Redis", "redis"),
      brand("SQLAlchemy", "sqlalchemy"),
      pattern("SQL", "data"),
      pattern("Vector Databases", "data"),
    ],
  },
  {
    id: "ai",
    title: "Applied AI & machine learning",
    items: [
      brand("TensorFlow", "tensorflow"),
      brand("LangChain", "langchain"),
      brand("LangGraph", "langgraph"),
      pattern("OpenAI APIs", "ai"),
      pattern("Google ADK", "ai"),
      pattern("RAG", "ai"),
      pattern("Embeddings", "data"),
    ],
  },
  {
    id: "cloud",
    title: "Cloud & delivery",
    items: [
      brand("Docker", "docker"),
      brand("Docker Compose", "docker"),
      brand("AWS", "aws"),
      brand("Cloudinary", "cloudinary"),
      brand("Linux", "linux"),
      pattern("CI/CD", "workflow"),
      pattern("Database Migrations", "data"),
    ],
  },
  {
    id: "tools",
    title: "Engineering workflow",
    items: [
      brand("Git", "git"),
      brand("GitHub", "github"),
      brand("Postman", "postman"),
      pattern("Async Tasks", "workflow"),
      pattern("Data Pipelines", "workflow"),
    ],
  },
];

export const resumeStackCount = resumeStackGroups.reduce(
  (total, group) => total + group.items.length,
  0,
);
