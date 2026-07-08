import { ArrowUp, Download, Github, Linkedin, Mail } from "lucide-react";

const year = new Date().getFullYear();
const resumeUrl = "/Harsh_Gavand_Resume.pdf";

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/harshgavandit" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/harsh-gavand" },
  { icon: Mail, label: "Email", href: "mailto:harshgavand2@gmail.com" },
];

export const Footer = () => {
  return (
    <footer className="relative px-6 pb-10 pt-4">
      <div className="section-container">
        <div className="glass-card rounded-[2rem] p-6">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-heading text-xl font-black text-white">Harsh Gavand</p>
              <p className="mt-2 text-sm text-[#A1A1AA]">
                Full-stack developer building SaaS, AI, automation, and data-driven web products.
              </p>
              <p className="mt-3 text-xs text-[#71717A]">© {year} - Built with React, Tailwind CSS, and Framer Motion.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="magnetic-button flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#A1A1AA] hover:border-indigo-300/40 hover:text-white"
                >
                  <Icon size={17} />
                </a>
              ))}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="magnetic-button inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#09090B]"
              >
                Resume <Download size={14} />
              </a>
              <a
                href="#hero"
                className="magnetic-button inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white"
              >
                <ArrowUp size={14} /> Top
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
