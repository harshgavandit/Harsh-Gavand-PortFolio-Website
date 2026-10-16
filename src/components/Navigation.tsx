import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { profile } from "../data/portfolio";
import { chapters } from "../data/recruiter";
import { MotionToggle } from "./MotionPreferences";
import { GitHubMark, LinkedInMark } from "./CornerSocials";

function SocialLinks() {
  return (
    <div className="header-socials">
      <a
        href={profile.github}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Harsh on GitHub"
      >
        <GitHubMark />
      </a>
      <a
        href={profile.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Harsh on LinkedIn"
      >
        <LinkedInMark />
      </a>
    </div>
  );
}

export function Navigation() {
  const { pathname } = useLocation();
  const [active, setActive] = useState("hero");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const home = pathname === "/";
  const target = (id: string) => `${home ? "" : "/"}#${id}`;
  useEffect(() => {
    if (!home) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const current = [
        ...document.querySelectorAll<HTMLElement>("main > section[id]"),
      ]
        .reverse()
        .find(
          (section) =>
            section.getBoundingClientRect().top <= window.innerHeight * 0.35,
        );
      setActive(current?.id || "hero");
    };
    const scroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", scroll);
      cancelAnimationFrame(frame);
    };
  }, [home]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const background = [
      document.getElementById("main"),
      document.querySelector("footer"),
      document.querySelector(".assistant-launcher"),
    ];
    background.forEach((element) => element?.setAttribute("inert", ""));
    menuRef.current?.querySelector<HTMLElement>("a")?.focus();
    const key = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key !== "Tab") return;
      const elements = [
        toggleRef.current,
        ...(menuRef.current?.querySelectorAll<HTMLElement>("a,button") || []),
      ].filter(
        (element): element is HTMLElement =>
          !!element && !element.hasAttribute("disabled"),
      );
      const first = elements[0],
        last = elements.at(-1)!;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const resize = () => {
      if (window.innerWidth >= 1000) setOpen(false);
    };
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      document.body.style.overflow = previous;
      background.forEach((element) => element?.removeAttribute("inert"));
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
    };
  }, [open]);
  const ask = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent("open-portfolio-assistant"));
  };
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a
            href={target("hero")}
            className="brand"
            aria-label="Harsh Gavand home"
          >
            <img
              className="brand-logo"
              src="/brand/hg-icon.webp"
              width={52}
              height={52}
              alt=""
              loading="eager"
            />
            <span className="brand-caption">
              <strong className="brand-name">Harsh Gavand</strong>
              <small>Full-Stack &amp; AI Engineer</small>
            </span>
          </a>
          <nav className="desktop-nav" aria-label="Main navigation">
            {chapters.map((chapter) => (
              <a
                key={chapter.id}
                href={target(chapter.id)}
                aria-current={
                  home && active === chapter.id ? "location" : undefined
                }
              >
                {chapter.navLabel}
              </a>
            ))}
          </nav>
          <div className="header-actions">
            <MotionToggle className="header-motion" />
            <button className="header-ask" onClick={ask} aria-haspopup="dialog">
              Ask AI <kbd>⌘ K</kbd>
            </button>
            <a
              className="header-resume"
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <SocialLinks />
            <button
              className="menu-toggle"
              ref={toggleRef}
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? "Close navigation" : "Open navigation"}
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        <div
          className="mobile-menu"
          id="mobile-navigation"
          ref={menuRef}
          hidden={!open}
        >
          <nav aria-label="Mobile navigation">
            {chapters.map((chapter) => (
              <a
                key={chapter.id}
                href={target(chapter.id)}
                onClick={() => setOpen(false)}
              >
                {chapter.label}
              </a>
            ))}
          </nav>
          <a
            className="mobile-resume button button-secondary"
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
          >
            Resume <ArrowUpRight size={16} aria-hidden="true" />
          </a>
          <button onClick={ask}>Ask Harsh’s AI · Ctrl / ⌘ K</button>
          <MotionToggle />
          <SocialLinks />
        </div>
      </header>
    </>
  );
}
