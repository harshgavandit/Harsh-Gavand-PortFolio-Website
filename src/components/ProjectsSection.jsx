import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ExternalLink, Github, Star } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "AutoPilot — AI Command Centre",
    tagline: "Hackathon Top 5 of 500+",
    description:
      "Full-stack agentic AI platform with multi-agent orchestration, role-based auth, human-in-the-loop oversight, and a real-time dashboard. Built and shipped in 48 hours.",
    image: "/projects/project3.png",
    tags: ["FastAPI", "Next.js", "PostgreSQL", "Docker", "Agentic AI"],
    githubUrl: "https://github.com/harshgavandit/SuperVity-AutoPilot-AI-Hackathon",
    demoUrl: "#",
    featured: true,
    badge: "🏆 Top 5 / 500+",
  },
  {
    id: 2,
    title: "UGC Content Platform",
    tagline: "AI-powered creator tool",
    description:
      "MERN app enabling creators to generate UGC by combining model and product images. Integrates Clerk Auth, Cloudinary, and a credit-based usage system.",
    image: "/projects/project1.png",
    tags: ["React", "Node.js", "MongoDB", "Clerk", "Cloudinary"],
    githubUrl: "https://github.com/harshgavandit/ugc-project",
    demoUrl: "#",
    featured: false,
  },
  {
    id: 3,
    title: "Zoom Clone",
    tagline: "Real-time video conferencing",
    description:
      "WebRTC peer-to-peer video conferencing with Socket.io signaling, multi-user rooms, and mute/camera controls. Built from scratch — no third-party SDKs.",
    image: "/projects/project2.png",
    tags: ["Node.js", "Socket.io", "WebRTC", "React"],
    githubUrl: "https://github.com/harshgavandit/Zoom_Clone",
    demoUrl: "#",
    featured: false,
  },
  {
    id: 4,
    title: "Stock Prediction Portal",
    tagline: "ML-powered financial analysis",
    description:
      "Django REST API fetching 10 years of stock data, running LSTM predictions via a pre-trained Keras model, and serving moving average charts alongside metrics.",
    image: "/projects/project3.png",
    tags: ["Django", "Python", "LSTM", "TensorFlow", "REST API"],
    githubUrl: "https://github.com/harshgavandit/Stock-Prediction_Portal_Python_ML",
    demoUrl: "#",
    featured: false,
  },
  {
    id: 5,
    title: "AI News-to-Email Digest",
    tagline: "Automated content pipeline",
    description:
      "Scrapes AI news, generates LLM summaries, stores data via SQLAlchemy ORM, and dispatches formatted email digests. Fully containerized with Docker.",
    image: "/projects/project1.png",
    tags: ["Python", "SQLAlchemy", "Docker", "LLM", "FastAPI"],
    githubUrl: "https://github.com/harshgavandit/AI_News_To_Email_Generator",
    demoUrl: "#",
    featured: false,
  },
  {
    id: 6,
    title: "MERN Auth System",
    tagline: "Production-ready boilerplate",
    description:
      "JWT access/refresh token auth with bcrypt hashing, protected routes, and full user lifecycle management. A clean starting point for any MERN application.",
    image: "/projects/project2.png",
    tags: ["React", "Node.js", "MongoDB", "JWT", "Express"],
    githubUrl: "https://github.com/harshgavandit/MERN_AUTHENTICATION_Practice",
    demoUrl: "#",
    featured: false,
  },
];

const ProjectCard = ({ project, index, isInView, large = false }) => {
  const tagColors = {
    React: "#61DAFB",
    "Node.js": "#68A063",
    Python: "#3776AB",
    Django: "#092E20",
    FastAPI: "#009688",
    "Next.js": "#FAFAFA",
    PostgreSQL: "#336791",
    Docker: "#2496ED",
    MongoDB: "#47A248",
    default: "#71717A",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-xl overflow-hidden transition-all duration-300 ${
        large ? "md:col-span-2" : ""
      }`}
      style={{
        backgroundColor: "#111113",
        border: "1px solid #1F1F23",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#27272A";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1F1F23";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Image */}
      <div
        className="overflow-hidden"
        style={{ height: large ? "240px" : "180px", backgroundColor: "#18181B" }}
      >
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: "scale(1)" }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(17,17,19,0.9) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Badge */}
        {project.badge && (
          <span
            className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-3"
            style={{
              backgroundColor: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
              color: "#F59E0B",
            }}
          >
            {project.badge}
          </span>
        )}

        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <p className="text-[10px] font-medium tracking-wide uppercase mb-0.5" style={{ color: "#52525B" }}>
              {project.tagline}
            </p>
            <h3 className="font-heading font-semibold text-white text-base leading-tight" style={{ letterSpacing: "-0.01em" }}>
              {project.title}
            </h3>
          </div>
          <div className="flex items-center gap-2 shrink-0 mt-0.5">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg transition-all duration-150"
              style={{ color: "#52525B" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#FAFAFA"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#52525B"; }}
              aria-label={`GitHub — ${project.title}`}
            >
              <Github size={15} />
            </a>
            {project.demoUrl !== "#" && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg transition-all duration-150"
                style={{ color: "#52525B" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#FAFAFA"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "#52525B"; }}
                aria-label={`Demo — ${project.title}`}
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>

        <p className="text-sm leading-relaxed mb-4" style={{ color: "#71717A" }}>
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded text-[11px] font-mono"
              style={{
                backgroundColor: "#18181B",
                border: "1px solid #27272A",
                color: "#71717A",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="py-28 px-6 relative">
      <div className="max-w-5xl mx-auto" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold tracking-[0.12em] uppercase mb-3"
          style={{ color: "#6366F1" }}
        >
          Projects
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-bold text-white mb-3"
          style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)", letterSpacing: "-0.025em" }}
        >
          Selected Work
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-base mb-10 max-w-lg"
          style={{ color: "#71717A" }}
        >
          Production applications and weekend projects. Each one built to solve a real problem.
        </motion.p>

        {/* Featured project */}
        <div className="mb-5">
          <ProjectCard project={featured} index={0} isInView={isInView} large />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {rest.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i + 1} isInView={isInView} />
          ))}
        </div>

        {/* GitHub CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex justify-center"
        >
          <a
            href="https://github.com/harshgavandit"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              border: "1px solid #27272A",
              color: "#A1A1AA",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#6366F1";
              e.currentTarget.style.color = "#FAFAFA";
              e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.08)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#27272A";
              e.currentTarget.style.color = "#A1A1AA";
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Github size={15} /> More on GitHub <ArrowRight size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
