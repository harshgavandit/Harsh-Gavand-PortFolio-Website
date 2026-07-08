import { cn } from "@/lib/utils";
import { Download, Github, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

const resumeUrl = "/Harsh_Gavand_Resume.pdf";

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 32);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ids = ["hero", ...navItems.map((i) => i.href.slice(1))];
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-42% 0px -50% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <>
      <nav className="fixed left-0 right-0 top-4 z-50 hidden px-6 md:block" aria-label="Main navigation">
        <div
          className={cn(
            "mx-auto flex max-w-6xl items-center justify-between rounded-full px-3 py-2 transition-all duration-300",
            scrolled ? "glass-card" : "border border-transparent bg-transparent"
          )}
        >
          <a href="#hero" className="group flex items-center gap-2 pl-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-black text-[#09090B] transition-transform duration-200 group-hover:scale-105">
              HG
            </span>
            <span className="font-heading text-sm font-semibold text-white">Harsh Gavand</span>
          </a>

          <div className="flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.03] p-1">
            {navItems.map((item) => {
              const isActive = activeSection === item.href.slice(1);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200",
                    isActive ? "text-white" : "text-[#A1A1AA] hover:text-white"
                  )}
                >
                  {isActive && (
                    <span
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, rgba(99,102,241,0.95), rgba(34,211,238,0.45))",
                        boxShadow: "0 8px 24px rgba(99,102,241,0.22)",
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.name}</span>
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/harshgavandit"
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-button flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#A1A1AA] hover:border-indigo-400/50 hover:text-white"
              aria-label="GitHub profile"
            >
              <Github size={16} />
            </a>
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="magnetic-button inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#09090B] shadow-[0_10px_28px_rgba(255,255,255,0.14)]"
            >
              Resume <Download size={14} />
            </a>
          </div>
        </div>
      </nav>

      <nav
        className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-5 py-4 md:hidden"
        style={{
          backgroundColor: scrolled ? "rgba(9,9,11,0.82)" : "transparent",
          backdropFilter: scrolled ? "blur(18px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
        }}
      >
        <a href="#hero" className="flex items-center gap-2 font-heading font-bold text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs text-[#09090B]">HG</span>
          <span>Harsh</span>
        </a>
        <button
          onClick={() => setIsMenuOpen((p) => !p)}
          className="rounded-full border border-white/10 bg-white/[0.04] p-2 text-[#A1A1AA] transition-colors hover:text-white"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-center px-6 transition-all duration-300 md:hidden",
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ backgroundColor: "rgba(9,9,11,0.96)", backdropFilter: "blur(24px)" }}
      >
        <div className="glass-card rounded-3xl p-6">
          <div className="mb-8">
            <p className="section-kicker mb-2">Navigation</p>
            <p className="font-heading text-3xl font-bold text-white">Explore the portfolio</p>
          </div>
          <div className="grid gap-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 font-heading text-xl font-semibold text-[#D4D4D8] transition-all hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-white px-4 py-3 text-center text-sm font-semibold text-[#09090B]"
            >
              Resume
            </a>
            <a
              href="mailto:harshgavand2@gmail.com"
              className="rounded-2xl border border-white/10 px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
