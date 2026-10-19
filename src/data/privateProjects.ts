import type { Project } from "./portfolio";

export interface PrivateProject extends Omit<Project, "githubUrl" | "demoUrl"> {
  visibility: "private";
  keywords: string[];
  preview?: {
    src: string;
    alt: string;
    width: number;
    height: number;
    caption: string;
  };
}

export const privateProjects: PrivateProject[] = [
  {
    id: 40,
    slug: "globetrek-internal-tool-platform",
    title: "Globetrek Internal Tool Platform",
    category: "Enterprise Software · Sales Operations",
    visibility: "private",
    preview: {
      src: "/evidence/globetrek-quotation-workspace.jpg",
      alt: "Globetrek’s quotation workspace showing customer setup, quotation format, pricing controls, and preview and save actions.",
      width: 1280,
      height: 720,
      caption: "Quotation workspace · Customer setup & pricing",
    },
    overview:
      "An enterprise internal platform for sales management, automated quotations, customer management, pricing calculations, and PDF/Excel generation. Built to bring related sales workflows into one application for Globetrek’s internal team.",
    features: [
      "Sales management and customer records",
      "Automated quotation management",
      "Pricing calculations",
      "PDF and Excel document generation",
    ],
    technologies: [
      "Next.js",
      "TypeScript",
      "React",
      "Supabase",
      "PostgreSQL",
      "Tailwind CSS",
    ],
    keywords: [
      "Full-Stack Development",
      "Enterprise Software",
      "CRM",
      "Workflow Automation",
      "RBAC",
      "REST APIs",
      "Quotation Management",
    ],
    role: "Developed full-stack sales and quotation workflows, connecting Next.js and React interfaces with Supabase and PostgreSQL data handling, pricing calculations, and PDF/Excel generation.",
    challenges:
      "Connecting customer data, pricing calculations, quotations, and generated documents within a consistent internal workflow.",
    impact:
      "Centralizes customer information, pricing, quotations, and document preparation to support day-to-day sales operations and reduce manual handoffs between tasks.",
  },
];
