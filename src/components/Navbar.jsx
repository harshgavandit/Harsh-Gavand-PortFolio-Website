import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

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
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ids = navItems.map((i) => i.href.slice(1));
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <>
      {/* Desktop floating nav */}
      <nav
        className="fixed top-5 left-1/2 z-50 hidden md:flex"
        style={{ transform: "translateX(-50%)" }}
        aria-label="Main navigation"
      >
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-2 rounded-full transition-all duration-500",
            scrolled
              ? "border border-[#27272A] shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
              : "border border-transparent"
          )}
          style={{
            backgroundColor: scrolled ? "rgba(17,17,19,0.85)" : "transparent",
          }}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.href.slice(1);
            return (
              <a
                key={item.name}
                href={item.href}
                className={cn(
                  "relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
                  isActive
                    ? "text-white"
                    : "text-[#A1A1AA] hover:text-white"
                )}
              >
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(99,102,241,0.9) 0%, rgba(139,92,246,0.7) 100%)",
                    }}
                    aria-hidden="true"
                  />
                )}
                <span className="relative z-10">{item.name}</span>
              </a>
            );
          })}
        </div>
      </nav>

      {/* Mobile — logo + hamburger */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 md:hidden flex items-center justify-between px-6 py-4"
        style={{
          backgroundColor: scrolled
            ? "rgba(9,9,11,0.9)"
            : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid #1F1F23" : "none",
          transition: "all 0.3s",
        }}
      >
        <a
          href="#hero"
          className="font-heading font-bold text-white text-lg tracking-tight"
        >
          HG
        </a>
        <button
          onClick={() => setIsMenuOpen((p) => !p)}
          className="p-2 rounded-lg text-[#A1A1AA] hover:text-white transition-colors"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden flex flex-col items-center justify-center gap-8 transition-all duration-300",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        style={{ backgroundColor: "rgba(9,9,11,0.97)", backdropFilter: "blur(24px)" }}
      >
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={() => setIsMenuOpen(false)}
            className="text-3xl font-heading font-semibold text-[#A1A1AA] hover:text-white transition-colors duration-200"
          >
            {item.name}
          </a>
        ))}
        <div className="mt-4 flex items-center gap-6">
          <a
            href="https://github.com/harshgavandit"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#71717A] hover:text-white transition-colors"
          >
            GitHub
          </a>
          <a
            href="mailto:harshgavand2@gmail.com"
            className="text-sm text-[#71717A] hover:text-white transition-colors"
          >
            Email
          </a>
        </div>
      </div>
    </>
  );
};
