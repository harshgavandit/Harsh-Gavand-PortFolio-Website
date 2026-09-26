import { useEffect, useRef, useState } from "react";
import { m, useScroll } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "../data/portfolio";
import { MotionToggle } from "./MotionPreferences";

const links = ["Projects", "About", "Experience", "Skills", "Contact"];
export function Navigation() {
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  useEffect(() => {
    let queued = false;
    const update = () => {
      setScrolled(window.scrollY > 24);
      const id = [...links]
        .reverse()
        .find(
          (label) =>
            (document
              .getElementById(label.toLowerCase())
              ?.getBoundingClientRect().top ?? Infinity) <=
            window.innerHeight * 0.35,
        );
      setActive(id ?? "");
      queued = false;
    };
    const scroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => window.removeEventListener("scroll", scroll);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = document.getElementById("main");
    const footer = document.querySelector("footer");
    background?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    menuRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab") {
        const elements = [
          toggleRef.current,
          ...Array.from(
            menuRef.current?.querySelectorAll<HTMLElement>("a") ?? [],
          ),
        ].filter((el): el is HTMLElement => el !== null);
        const first = elements[0],
          last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        }
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    const breakpoint = window.matchMedia("(min-width: 900px)");
    const closeOnResize = () => {
      if (breakpoint.matches) setOpen(false);
    };
    breakpoint.addEventListener("change", closeOnResize);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      background?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      document.removeEventListener("keydown", onKey);
      breakpoint.removeEventListener("change", closeOnResize);
    };
  }, [open]);
  function closeMenu(id: string) {
    setOpen(false);
    requestAnimationFrame(() =>
      document.getElementById(id)?.focus({ preventScroll: true }),
    );
  }
  return (
    <>
      <m.div
        className="scroll-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="nav-shell">
          <a
            className="brand"
            href="#hero"
            aria-label="Harsh Gavand home"
            onClick={() => setOpen(false)}
          >
            hg<span>.</span>
            <span className="brand-name">Harsh Gavand</span>
          </a>
          <nav aria-label="Main navigation" className="desktop-nav">
            {links.map((link) => (
              <a
                href={`#${link.toLowerCase()}`}
                key={link}
                aria-current={active === link ? "location" : undefined}
              >
                {link}
              </a>
            ))}
          </nav>
          <MotionToggle />
          <a
            className="nav-resume"
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <button
            ref={toggleRef}
            className="menu-toggle"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {open && (
        <div className="mobile-menu" id="mobile-navigation" ref={menuRef}>
          <nav aria-label="Mobile navigation">
            {links.map((link, i) => (
              <a
                href={`#${link.toLowerCase()}`}
                key={link}
                onClick={() => closeMenu(link.toLowerCase())}
              >
                <span>0{i + 1}</span>
                {link}
                <ArrowUpRight aria-hidden="true" />
              </a>
            ))}
          </nav>
          <p>Full-stack thinking. Thoughtful execution.</p>
          <a className="text-link" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>
      )}
    </>
  );
}
