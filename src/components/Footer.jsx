import { ArrowUp, Github, Linkedin, Mail } from "lucide-react";

const year = new Date().getFullYear();

const socials = [
  { icon: Github, label: "GitHub", href: "https://github.com/harshgavandit" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:harshgavand2@gmail.com" },
];

export const Footer = () => {
  return (
    <footer
      className="px-6 py-10 relative"
      style={{ borderTop: "1px solid #1F1F23" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div>
          <p
            className="font-heading font-semibold text-sm mb-0.5"
            style={{ color: "#FAFAFA" }}
          >
            Harsh Gavand
          </p>
          <p className="text-xs" style={{ color: "#52525B" }}>
            © {year} · Built with React & Tailwind CSS
          </p>
        </div>

        {/* Center — socials */}
        <div className="flex items-center gap-3">
          {socials.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 rounded-lg transition-all duration-200"
              style={{ color: "#52525B" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#FAFAFA";
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#52525B";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        {/* Right — back to top */}
        <a
          href="#hero"
          className="p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200"
          style={{
            border: "1px solid #1F1F23",
            color: "#52525B",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#27272A";
            e.currentTarget.style.color = "#A1A1AA";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#1F1F23";
            e.currentTarget.style.color = "#52525B";
          }}
        >
          <ArrowUp size={13} />
          <span>Back to top</span>
        </a>
      </div>
    </footer>
  );
};
