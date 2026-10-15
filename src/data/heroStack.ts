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

// Transcribed from the supplied résumé; spelling is normalized for display.
// TypeScript and Keras also remain from the established portfolio/project stack.
export const resumeStackGroups = [
  {
    id: "frontend",
    title: "Frontend & interfaces",
    items: [
      brand("React", "react"),
      brand("Next.js", "nextdotjs"),
      brand("TypeScript", "typescript"),
      brand("JavaScript ES6+", "javascript"),
      brand("HTML5", "html5"),
      brand("CSS3", "css"),
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
      brand("Mongoose", "mongoose"),
      pattern("REST APIs", "api"),
      brand("JWT Auth", "jsonwebtokens"),
      brand("Clerk", "clerk"),
      brand("Socket.io", "socketdotio"),
      brand("WebRTC", "webrtc"),
    ],
  },
  {
    id: "data",
    title: "Databases & streaming",
    items: [
      brand("MongoDB", "mongodb"),
      brand("PostgreSQL", "postgresql"),
      brand("MySQL", "mysql"),
      brand("DynamoDB", "dynamodb"),
      brand("Redis", "redis"),
      brand("Kafka", "apachekafka"),
      brand("SQLAlchemy", "sqlalchemy"),
      pattern("SQL", "data"),
      pattern("Vector Databases", "data"),
    ],
  },
  {
    id: "ai",
    title: "AI, ML & data science",
    items: [
      brand("Pandas", "pandas"),
      brand("NumPy", "numpy"),
      brand("scikit-learn", "scikitlearn"),
      brand("TensorFlow", "tensorflow"),
      brand("Keras", "keras"),
      pattern("Matplotlib", "analysis"),
      pattern("yfinance", "analysis"),
      brand("LangChain", "langchain"),
      brand("LangGraph", "langgraph"),
      pattern("LLM APIs", "ai"),
      pattern("OpenAI APIs", "ai"),
      pattern("RAG", "ai"),
      pattern("Embeddings", "data"),
      pattern("LSTM Forecasting", "analysis"),
      pattern("MinMax Scaling", "analysis"),
      pattern("Anomaly Detection", "analysis"),
      pattern("Moving Average Analysis", "analysis"),
      pattern("Computer Vision", "vision"),
    ],
  },
  {
    id: "cloud",
    title: "Cloud & delivery",
    items: [
      brand("Docker", "docker"),
      brand("Docker Compose", "docker"),
      brand("Gunicorn", "gunicorn"),
      brand("AWS", "aws"),
      brand("GCP", "googlecloud"),
      brand("Cloudinary", "cloudinary"),
      brand("Linux", "linux"),
      pattern("CI/CD", "workflow"),
      pattern("Database Migrations", "data"),
    ],
  },
  {
    id: "tools",
    title: "Tools & engineering foundations",
    items: [
      brand("Git", "git"),
      brand("GitHub", "github"),
      brand("Postman", "postman"),
      brand("Cursor", "cursor"),
      pattern("Codex", "terminal"),
      brand("Claude Code", "claude"),
      pattern("Antigravity", "orbit"),
      pattern("DSA & OOP", "code"),
      pattern("Async Tasks", "workflow"),
      pattern("Scripting & Automation", "terminal"),
      pattern("Data Pipelines", "workflow"),
    ],
  },
];

export const resumeStackCount = resumeStackGroups.reduce(
  (total, group) => total + group.items.length,
  0,
);
