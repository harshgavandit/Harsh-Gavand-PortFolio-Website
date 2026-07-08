import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ExternalLink, Github, Sparkles } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "GitHub Replica",
    category: "Full-Stack Developer Platform",
    overview:
      "A full-stack GitHub-inspired platform focused on repository discovery, developer profiles, and clean project navigation. The application recreates core collaboration patterns with a responsive interface and maintainable API structure.",
    features: ["Repository-style project listings", "Developer profile views", "Searchable and responsive UI"],
    technologies: ["React", "Node.js", "Express", "MongoDB", "REST API"],
    role:
      "Owned frontend implementation, API integration, routing, component structure, and deployment readiness.",
    challenges:
      "Solved the challenge of presenting dense repository data in a clean, recruiter-friendly layout without sacrificing usability.",
    impact:
      "Demonstrates end-to-end MERN delivery, reusable UI composition, and production-style developer tooling workflows.",
    githubUrl: "https://github.com/harshgavandit/GitHub_Replica.git",
    demoUrl: "https://github-replica.onrender.com",
  },
  {
    id: 2,
    title: "Zoom Clone",
    category: "Real-Time Communication",
    overview:
      "A real-time video conferencing application with room-based communication and live peer connectivity. The project focuses on low-latency collaboration flows, media controls, and scalable socket-based signaling.",
    features: ["Video meeting rooms", "Socket-based signaling", "Mute, camera, and session controls"],
    technologies: ["React", "Node.js", "Socket.io", "WebRTC", "Express"],
    role:
      "Built the meeting UI, signaling logic, room lifecycle, client-state handling, and deployment configuration.",
    challenges:
      "Handled real-time connection state, peer negotiation, and graceful updates when users join or leave sessions.",
    impact:
      "Shows practical experience with WebRTC architecture, real-time systems, and interactive frontend engineering.",
    githubUrl: "https://github.com/harshgavandit/Zoom_Clone.git",
    demoUrl: "https://zoom-clone-xkdj.onrender.com/",
  },
  {
    id: 3,
    title: "Banking App SaaS",
    category: "FinTech SaaS",
    overview:
      "A banking-focused SaaS dashboard designed for secure financial workflows, user account management, and transaction visibility. The application emphasizes clean architecture, reusable components, and a trustworthy financial user experience.",
    features: ["Account dashboard", "Transaction-oriented workflows", "Secure user experience patterns"],
    technologies: ["Next.js", "TypeScript", "Appwrite", "Plaid", "Tailwind CSS"],
    role:
      "Designed and implemented dashboard flows, authentication-aware UI, data presentation, and deployment setup.",
    challenges:
      "Balanced sensitive financial UX requirements with readable state management and reliable data-driven screens.",
    impact:
      "Highlights SaaS product thinking, financial domain awareness, and scalable frontend architecture.",
    githubUrl: "https://github.com/harshgavandit/Banking_App_SaaS.git",
    demoUrl: "https://banking-app-saas.onrender.com/",
  },
  {
    id: 4,
    title: "PERN Stack SaaS Project",
    category: "PERN SaaS Platform",
    overview:
      "A SaaS application built on the PERN stack with a PostgreSQL-backed data model and full-stack product workflows. The project demonstrates practical relational database design, API development, and responsive React interfaces.",
    features: ["PostgreSQL data modeling", "RESTful backend workflows", "Responsive SaaS dashboard"],
    technologies: ["PostgreSQL", "Express", "React", "Node.js", "REST API"],
    role:
      "Implemented database-connected backend routes, frontend screens, API integration, and production deployment flow.",
    challenges:
      "Structured relational data and API boundaries so the product could remain understandable as features expanded.",
    impact:
      "Demonstrates full-stack SaaS delivery with a relational database foundation and clean separation of concerns.",
    githubUrl: "https://github.com/harshgavandit/PERN_STACK_SaaS_Project.git",
    demoUrl: "https://pern-stack-saas-project.onrender.com/",
  },
  {
    id: 5,
    title: "SaaS E-Commerce Website",
    category: "E-Commerce SaaS",
    overview:
      "A SaaS-style e-commerce web application focused on product discovery, conversion-oriented UI, and scalable storefront structure. The project applies full-stack patterns to support catalog browsing and real-world commerce flows.",
    features: ["Product catalog experience", "Conversion-focused storefront UI", "Reusable commerce components"],
    technologies: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
    role:
      "Built the storefront UI, reusable components, backend integration points, and deployment configuration.",
    challenges:
      "Solved layout consistency and product presentation challenges across responsive breakpoints and commerce states.",
    impact:
      "Shows ability to build business-facing web products with clean UI systems and scalable full-stack structure.",
    githubUrl: "https://github.com/harshgavandit/SaaS_E-commerce_Website-.git",
    demoUrl: "https://saas-e-commerce-website-1.onrender.com",
  },
  {
    id: 6,
    title: "Zerodha Clone",
    category: "Trading Platform UI",
    overview:
      "A Zerodha-inspired brokerage platform clone focused on trading dashboard patterns, market-facing layout, and product navigation. The application recreates a familiar financial product experience with attention to structure and responsiveness.",
    features: ["Trading-style dashboard", "Market product pages", "Responsive financial UI"],
    technologies: ["React", "Node.js", "Express", "MongoDB", "CSS"],
    role:
      "Implemented the frontend experience, reusable UI sections, routing, and deployment-ready project structure.",
    challenges:
      "Translated a complex financial product into a clean clone while keeping the information hierarchy easy to scan.",
    impact:
      "Demonstrates strong frontend implementation, domain-oriented UI thinking, and product recreation skills.",
    githubUrl: "https://github.com/harshgavandit/Zerodha_Clone.git",
    demoUrl: "https://zerodha-clone-qdgb.onrender.com/",
  },
  {
    id: 7,
    title: "Agentic AI System",
    category: "Agentic AI",
    overview:
      "An AI system designed around autonomous task execution, tool usage, and multi-step reasoning workflows. The project explores how agentic components can coordinate decisions, memory, and execution in a practical application architecture.",
    features: ["Agent workflow orchestration", "Tool-augmented reasoning", "Modular AI system design"],
    technologies: ["Python", "FastAPI", "LangChain", "OpenAI API", "Docker"],
    role:
      "Designed agent workflows, integrated LLM calls, organized backend modules, and prepared the project for iterative extension.",
    challenges:
      "Managed unpredictable AI outputs with clearer workflow boundaries, validation points, and maintainable orchestration logic.",
    impact:
      "Highlights applied AI engineering, workflow automation, and practical architecture for intelligent systems.",
    githubUrl: "https://github.com/harshgavandit/Agentic-AI_SYSTEM",
  },
  {
    id: 8,
    title: "API Issues Debugging Agent",
    category: "AI Developer Tooling",
    overview:
      "An AI-assisted debugging agent that helps analyze API issues, identify likely failure points, and guide resolution. The project combines backend diagnostics with LLM-driven reasoning to reduce manual troubleshooting time.",
    features: ["API error analysis", "Debugging recommendations", "Structured diagnostic workflow"],
    technologies: ["Python", "FastAPI", "OpenAI API", "REST API", "Logging"],
    role:
      "Built the diagnostic workflow, prompt structure, backend endpoints, and response formatting for developer usability.",
    challenges:
      "Converted noisy API failures into actionable summaries while keeping the output concise and technically useful.",
    impact:
      "Demonstrates AI-assisted developer productivity, backend observability thinking, and problem-solving automation.",
    githubUrl: "https://github.com/harshgavandit/API_ISSUES_DEBUGGING_AGENT",
  },
  {
    id: 9,
    title: "Deep Learning Project",
    category: "Machine Learning",
    overview:
      "A deep learning project focused on model training, experimentation, and predictive analysis. The work demonstrates practical ML pipeline development from data preparation through model evaluation.",
    features: ["Model training workflow", "Data preprocessing", "Evaluation and performance tracking"],
    technologies: ["Python", "TensorFlow", "Keras", "NumPy", "Pandas"],
    role:
      "Prepared data, implemented training logic, evaluated model behavior, and documented the experimental workflow.",
    challenges:
      "Improved model reliability by organizing preprocessing, training, and evaluation into repeatable steps.",
    impact:
      "Shows hands-on understanding of deep learning fundamentals and applied ML project execution.",
    githubUrl: "https://github.com/harshgavandit/Deep-Learning-Project",
  },
  {
    id: 10,
    title: "Multi-Agent Research System",
    category: "AI Research Automation",
    overview:
      "A multi-agent research workflow that coordinates information gathering, summarization, and answer synthesis. The project focuses on dividing research tasks into specialized agent responsibilities for better coverage and clarity.",
    features: ["Research agent coordination", "Automated summarization", "Structured final reports"],
    technologies: ["Python", "LangChain", "OpenAI API", "Vector Search", "FastAPI"],
    role:
      "Designed agent roles, orchestration flow, retrieval logic, and output structure for research-ready responses.",
    challenges:
      "Reduced fragmented research outputs by defining clearer handoffs between collection, analysis, and synthesis steps.",
    impact:
      "Demonstrates advanced AI workflow design and practical multi-agent system thinking.",
    githubUrl: "https://github.com/harshgavandit/Multi-Agent-Research-System",
  },
  {
    id: 11,
    title: "AI Video Assistant",
    category: "AI Media Automation",
    overview:
      "An AI-powered video assistant for processing video content and extracting useful insights from media workflows. The project brings together video handling, AI summarization, and backend automation concepts.",
    features: ["Video processing workflow", "AI-assisted summaries", "Media-focused backend pipeline"],
    technologies: ["Python", "Flask", "OpenAI API", "FFmpeg", "REST API"],
    role:
      "Built backend workflows for video handling, AI integration, endpoint design, and response preparation.",
    challenges:
      "Handled longer-running media tasks by separating processing steps and keeping the user-facing flow understandable.",
    impact:
      "Shows ability to connect AI capabilities with real-world media automation use cases.",
    githubUrl: "https://github.com/harshgavandit/AI_VIDEO_ASSISTANT",
  },
  {
    id: 12,
    title: "WhatsApp Automation API",
    category: "Messaging Automation",
    overview:
      "An API-driven WhatsApp automation project for programmatic messaging workflows and integration-ready communication. The project emphasizes backend reliability, endpoint clarity, and automation use cases for business communication.",
    features: ["Message automation endpoints", "Webhook-ready architecture", "Integration-focused API design"],
    technologies: ["Node.js", "Express", "REST API", "Webhooks", "JavaScript"],
    role:
      "Implemented API routes, request handling, automation flow structure, and documentation-friendly backend behavior.",
    challenges:
      "Designed the API to support predictable messaging workflows while keeping integration points clean and testable.",
    impact:
      "Demonstrates backend automation, external service integration, and API-first product thinking.",
    githubUrl: "https://github.com/harshgavandit/whatsapp-automation-api",
  },
  {
    id: 13,
    title: "MERN Authentication Practice",
    category: "Authentication System",
    overview:
      "A production-oriented MERN authentication system covering secure user registration, login, and protected application flows. The project focuses on the fundamentals required for reliable identity management in full-stack apps.",
    features: ["JWT authentication", "Protected routes", "Password hashing and user sessions"],
    technologies: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    role:
      "Built the authentication backend, frontend auth flows, route protection, and validation-aware user experience.",
    challenges:
      "Handled session persistence and protected state consistently across frontend and backend boundaries.",
    impact:
      "Provides a reusable authentication foundation for MERN applications and demonstrates security-aware development.",
    githubUrl: "https://github.com/harshgavandit/MERN_AUTHENTICATION_Practice",
  },
  {
    id: 14,
    title: "UGC Project",
    category: "AI Creator Tool",
    overview:
      "An AI-powered creator platform for generating user-generated content workflows from product and model assets. The project combines authentication, media storage, and credit-style usage patterns into a practical creator experience.",
    features: ["AI content generation flow", "Cloud media management", "User authentication and usage tracking"],
    technologies: ["React", "Node.js", "MongoDB", "Clerk", "Cloudinary"],
    role:
      "Implemented creator workflows, media integration, authentication-aware screens, and reusable product UI components.",
    challenges:
      "Connected AI generation and media storage into a smooth workflow while keeping user actions clear and recoverable.",
    impact:
      "Shows applied AI product development, creator economy awareness, and full-stack integration skills.",
    githubUrl: "https://github.com/harshgavandit/ugc-project",
  },
  {
    id: 15,
    title: "OpenAI Project",
    category: "LLM Application",
    overview:
      "An OpenAI-powered application focused on practical LLM integration and user-facing AI workflows. The project demonstrates prompt handling, API integration, and clean delivery of AI-generated responses.",
    features: ["OpenAI API integration", "Prompt-driven workflows", "AI response handling"],
    technologies: ["JavaScript", "React", "Node.js", "OpenAI API", "REST API"],
    role:
      "Integrated AI endpoints, structured prompt flows, handled client responses, and refined the user experience.",
    challenges:
      "Managed AI response variability with clearer UI states and structured request/response handling.",
    impact:
      "Demonstrates real-world LLM application development and practical AI product integration.",
    githubUrl: "https://github.com/harshgavandit/OpenAI_Project-",
  },
  {
    id: 16,
    title: "VidSNAP AI Flask",
    category: "AI Video Tool",
    overview:
      "A Flask-based AI video utility for media processing and assisted video workflows. The project highlights backend-first AI integration with a lightweight web interface and practical automation patterns.",
    features: ["Flask backend workflow", "AI-assisted media processing", "Video utility endpoints"],
    technologies: ["Python", "Flask", "OpenAI API", "FFmpeg", "HTML/CSS"],
    role:
      "Built the Flask app structure, AI integration points, media handling flow, and user-facing request lifecycle.",
    challenges:
      "Handled media processing complexity while keeping the application lightweight and easy to operate.",
    impact:
      "Shows Python backend capability, AI media experimentation, and practical Flask application delivery.",
    githubUrl: "https://github.com/harshgavandit/VidSNAP_AI_Flask",
  },
  {
    id: 17,
    title: "AI News To Email Generator",
    category: "AI Automation Pipeline",
    overview:
      "An automated pipeline that collects AI news, summarizes content, and sends structured email digests. The project combines scraping, storage, summarization, and scheduled delivery into a business-friendly automation workflow.",
    features: ["News collection pipeline", "LLM-generated summaries", "Automated email delivery"],
    technologies: ["Python", "SQLAlchemy", "Docker", "OpenAI API", "Email SMTP"],
    role:
      "Implemented the content pipeline, database layer, AI summarization flow, email formatting, and container setup.",
    challenges:
      "Turned unstructured news content into concise digest-ready summaries while keeping the process repeatable.",
    impact:
      "Demonstrates automation, AI summarization, and production-minded pipeline design.",
    githubUrl: "https://github.com/harshgavandit/AI_News_To_Email_Generator",
  },
  {
    id: 18,
    title: "AI Image Enhancer",
    category: "AI Image Processing",
    overview:
      "An AI image enhancement project for improving uploaded images through a simple user-facing workflow. The application focuses on media upload handling, enhancement logic, and clear before/after value for users.",
    features: ["Image upload workflow", "AI enhancement processing", "User-friendly result handling"],
    technologies: ["Python", "Flask", "Image Processing", "REST API", "JavaScript"],
    role:
      "Built the upload flow, backend processing endpoints, result presentation, and error-aware user experience.",
    challenges:
      "Handled image file inputs and processing states so enhancement results could be delivered consistently.",
    impact:
      "Shows applied computer vision tooling, backend media handling, and user-centered AI feature delivery.",
    githubUrl: "https://github.com/harshgavandit/AI_image_Enhancer-",
  },
  {
    id: 19,
    title: "SigmaGPT",
    category: "Conversational AI",
    overview:
      "A GPT-style conversational AI application focused on prompt interaction, response rendering, and AI-assisted productivity. The project demonstrates practical chatbot UX patterns and API-driven AI experiences.",
    features: ["Chat interface", "Prompt and response workflow", "AI assistant experience"],
    technologies: ["React", "Node.js", "OpenAI API", "JavaScript", "CSS"],
    role:
      "Implemented the chat UI, request lifecycle, API integration, and response display experience.",
    challenges:
      "Kept AI conversations readable and responsive while managing loading, error, and empty states.",
    impact:
      "Demonstrates chatbot product thinking, API integration, and interactive AI frontend development.",
    githubUrl: "https://github.com/harshgavandit/SigmaGPT",
  },
  {
    id: 20,
    title: "Stock Prediction Portal Python ML",
    category: "Financial Machine Learning",
    overview:
      "A machine learning portal for stock analysis, historical data processing, and prediction-focused financial insights. The project combines Python ML workflows with a web interface for accessible market analysis.",
    features: ["Historical stock analysis", "Prediction model workflow", "Financial visualization outputs"],
    technologies: ["Python", "Django", "TensorFlow", "Keras", "Pandas"],
    role:
      "Implemented data processing, prediction workflow integration, API/backend logic, and visual result presentation.",
    challenges:
      "Connected ML model outputs to a web-facing experience while keeping the results understandable for users.",
    impact:
      "Shows applied ML, financial analytics, and backend integration of predictive systems.",
    githubUrl: "https://github.com/harshgavandit/Stock-Prediction_Portal_Python_ML",
  },
  {
    id: 21,
    title: "ASP.NET Core Project",
    category: "Enterprise Web Application",
    overview:
      "An ASP.NET Core application focused on structured backend development, database-backed workflows, and maintainable enterprise patterns. The project demonstrates experience beyond JavaScript stacks with typed server-side architecture.",
    features: ["MVC-style architecture", "Database-backed CRUD workflows", "Server-side validation"],
    technologies: ["C#", "ASP.NET Core", "Entity Framework", "SQL Server", "Razor"],
    role:
      "Built backend controllers, database models, application views, and validation-aware user flows.",
    challenges:
      "Structured server-side logic and data access patterns for maintainability and predictable application behavior.",
    impact:
      "Demonstrates versatility across enterprise frameworks, typed backend development, and database-driven systems.",
    githubUrl: "https://github.com/harshgavandit/ASP.NET-CORE_Project",
  },
  {
    id: 22,
    title: "RailTracker UTS PHP",
    category: "PHP Web Application",
    overview:
      "A PHP-based rail tracking utility focused on transportation workflows, data presentation, and practical user interactions. The project applies traditional web development patterns to a real-world public transit use case.",
    features: ["Rail tracking workflows", "Database-backed views", "Responsive utility interface"],
    technologies: ["PHP", "MySQL", "HTML", "CSS", "JavaScript"],
    role:
      "Implemented server-rendered pages, database operations, user flows, and interface refinements.",
    challenges:
      "Organized transportation data into usable screens while keeping the application lightweight and accessible.",
    impact:
      "Shows practical PHP development, database usage, and problem solving for public-service style applications.",
    githubUrl: "https://github.com/harshgavandit/RailTrackerUTS_PHP",
  },
  {
    id: 23,
    title: "DRF Advanced Project",
    category: "Django REST API",
    overview:
      "An advanced Django REST Framework project focused on API architecture, authentication patterns, and backend scalability. The project demonstrates disciplined API design with Python and Django's production-ready ecosystem.",
    features: ["REST API architecture", "Authentication and permissions", "Serializer-driven data flows"],
    technologies: ["Python", "Django", "Django REST Framework", "PostgreSQL", "JWT"],
    role:
      "Built API endpoints, serializers, permissions, authentication flows, and database-connected backend logic.",
    challenges:
      "Designed API boundaries and permission handling to keep backend behavior secure, readable, and extensible.",
    impact:
      "Demonstrates strong Python backend capability and REST API engineering for scalable applications.",
    githubUrl: "https://github.com/harshgavandit/DRF_Advanced_Project",
  },
  {
    id: 24,
    title: "WebHook API Integration",
    category: "Integration Engineering",
    overview:
      "A webhook-focused API integration project for receiving external events and processing them through backend workflows. The project emphasizes reliable event handling, endpoint design, and integration-ready architecture.",
    features: ["Webhook receiver endpoints", "Event processing flow", "Third-party integration patterns"],
    technologies: ["Node.js", "Express", "REST API", "Webhooks", "JavaScript"],
    role:
      "Implemented webhook endpoints, request validation, event routing, and integration-oriented backend structure.",
    challenges:
      "Handled external event payloads predictably while keeping the processing flow clear and easy to extend.",
    impact:
      "Shows backend integration skills, API reliability awareness, and event-driven engineering fundamentals.",
    githubUrl: "https://github.com/harshgavandit/WebHook_API_Integration",
  },
  {
    id: 25,
    title: "Django Resume Builder",
    category: "Productivity Web App",
    overview:
      "A Django-based resume builder that helps users create structured professional resumes through guided input flows. The project combines form-heavy workflows, template rendering, and document-oriented user experience.",
    features: ["Resume creation workflow", "Template-based output", "User data management"],
    technologies: ["Python", "Django", "SQLite", "HTML", "Bootstrap"],
    role:
      "Built Django views, form handling, data models, resume templates, and responsive page layouts.",
    challenges:
      "Turned multi-section resume data into a structured output flow while keeping the experience simple for users.",
    impact:
      "Demonstrates practical full-stack Django development and product thinking for career-focused tools.",
    githubUrl: "https://github.com/harshgavandit/DjangoResumeBuilder",
  },
  {
    id: 26,
    title: "Office Employee Management System",
    category: "Business Operations App",
    overview:
      "An employee management system for organizing office staff data, administrative records, and operational workflows. The project focuses on CRUD reliability, simple data management, and business process digitization.",
    features: ["Employee record management", "Admin CRUD workflows", "Searchable operational data"],
    technologies: ["Python", "Django", "SQLite", "Bootstrap", "HTML/CSS"],
    role:
      "Implemented data models, management views, CRUD flows, validation, and user-facing administration screens.",
    challenges:
      "Structured office data into reliable workflows that reduce manual tracking and improve administrative clarity.",
    impact:
      "Shows business application development, database-backed CRUD implementation, and maintainable backend workflows.",
    githubUrl: "https://github.com/harshgavandit/Office-Employee-Management-System",
  },
];

const projectImages = ["/projects/project1.png", "/projects/project2.png", "/projects/project3.png"];

const SectionBlock = ({ label, children }) => (
  <div>
    <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#6366F1" }}>
      {label}
    </p>
    <div className="text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
      {children}
    </div>
  </div>
);

const ProjectCard = ({ project, index, isInView }) => {
  const hasDemo = Boolean(project.demoUrl);
  const isFeatured = hasDemo && index < 6;
  const previewImage = projectImages[index % projectImages.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: Math.min(0.08 + index * 0.035, 0.5), ease: [0.16, 1, 0.3, 1] }}
      className={`premium-card group flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/30 ${
        isFeatured ? "lg:col-span-1" : ""
      }`}
    >
      {isFeatured && (
        <div className="relative h-48 overflow-hidden border-b border-white/10 bg-[#18181B]">
          <img
            src={previewImage}
            alt={`${project.title} preview`}
            className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111113] via-[#111113]/25 to-transparent" />
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-black/40 px-3 py-1 text-xs font-semibold text-cyan-100 backdrop-blur-xl">
            <Sparkles size={13} /> Featured
          </span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.16em]" style={{ color: "#71717A" }}>
            {project.category}
          </p>
          <h3 className="font-heading text-xl font-semibold leading-tight text-white">
            {project.title}
          </h3>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-button inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-[#A1A1AA] hover:border-indigo-300/40 hover:text-white"
            aria-label={`GitHub repository for ${project.title}`}
          >
            <Github size={16} />
          </a>
          {hasDemo && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-button inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-[#A1A1AA] hover:border-indigo-300/40 hover:text-white"
              aria-label={`Live demo for ${project.title}`}
            >
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>

      <p className="mb-5 text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
        {project.overview}
      </p>

      <div className="mb-5">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#6366F1" }}>
          Key Features
        </p>
        <ul className="space-y-1.5 text-sm leading-relaxed" style={{ color: "#A1A1AA" }}>
          {project.features.map((feature) => (
            <li key={feature} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ backgroundColor: "#6366F1" }} />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-5 flex flex-wrap gap-1.5">
        {project.technologies.map((technology) => (
          <span
            key={technology}
            className="chip rounded-full px-3 py-1 text-[11px] font-semibold"
          >
            {technology}
          </span>
        ))}
      </div>

      <div className="grid gap-4">
        <SectionBlock label="My Role">{project.role}</SectionBlock>
        <SectionBlock label="Challenges Solved">{project.challenges}</SectionBlock>
        <SectionBlock label="Impact">{project.impact}</SectionBlock>
      </div>

      <div className="mt-auto flex flex-wrap gap-3 pt-6">
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="magnetic-button inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white"
        >
          <Github size={15} /> GitHub
        </a>
        {hasDemo && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-button inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#09090B]"
          >
            Live Demo <ExternalLink size={15} />
          </a>
        )}
      </div>
      </div>
    </motion.article>
  );
};

export const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const demoCount = projects.filter((project) => project.demoUrl).length;

  return (
    <section id="projects" className="section-shell overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(139,92,246,0.12),transparent_52%)]" aria-hidden="true" />
      <div className="section-container relative" ref={ref}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="section-kicker mb-3"
        >
          Projects
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <h2 className="section-title mb-3 text-balance">Selected engineering work, presented like products.</h2>
            <p className="section-copy max-w-2xl">
              Full-stack, AI, SaaS, automation, and data-driven projects built with clean architecture,
              practical deployment workflows, and recruiter-ready technical depth.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="chip w-fit rounded-full px-3 py-1.5 text-xs font-semibold">{projects.length} projects</span>
            <span className="chip w-fit rounded-full px-3 py-1.5 text-xs font-semibold">{demoCount} live demos</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} isInView={isInView} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-10 flex justify-center"
        >
          <a
            href="https://github.com/harshgavandit"
            target="_blank"
            rel="noopener noreferrer"
            className="magnetic-button inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-white"
          >
            <Github size={15} /> More on GitHub <ArrowRight size={13} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
