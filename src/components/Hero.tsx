import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  Braces,
  Database,
  Layers3,
  Sparkles,
} from "lucide-react";
import { profile, projects } from "../data/portfolio";
import { ActionLink } from "./Primitives";

export function Hero() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const meshY = useTransform(scrollYProgress, [0, 1], [0, 65]);
  return (
    <section
      ref={heroRef}
      id="hero"
      className="hero section-container"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <m.div
        className="hero-grid"
        aria-hidden="true"
        style={{ y: reduce ? 0 : meshY }}
      />
      <div className="hero-topline">
        <span className="eyebrow">
          Independent thinking. End-to-end engineering.
        </span>
        <span className="location">
          Mumbai, India <span>↗</span>
        </span>
      </div>
      <div className="hero-layout">
        <div className="hero-copy">
          <div className="availability">
            <span /> Open to full-stack & AI opportunities
          </div>
          <p className="hero-intro">
            Harsh Gavand <span>/ Full-Stack & AI Engineer</span>
          </p>
          <h1 id="hero-title">
            <span className="text-mask">
              <m.span
                initial={false}
                animate={reduce ? undefined : { y: ["105%", "0%"] }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              >
                Built with purpose.
              </m.span>
            </span>
            <span className="text-mask">
              <m.span
                className="accent-text"
                initial={false}
                animate={reduce ? undefined : { y: ["105%", "0%"] }}
                transition={{
                  duration: 0.85,
                  delay: 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                Engineered to work.
              </m.span>
            </span>
          </h1>
          <p className="hero-description">
            I turn complex ideas into considered digital products — from
            responsive interfaces and reliable APIs to practical AI systems.
          </p>
          <div className="actions">
            <ActionLink href="#projects" primary>
              View projects
            </ActionLink>
            <ActionLink href="#contact">Let’s talk</ActionLink>
            <a
              className="text-link hero-resume"
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              Resume <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div
          className="engineering-canvas"
          role="img"
          aria-label="Engineering focus: interface, APIs, data, and intelligence"
        >
          <div className="canvas-label">
            <span className="tiny-dot" /> THE FULL PICTURE <span>01—04</span>
          </div>
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <div className="canvas-center">
            <span className="canvas-monogram">
              hg<span>.</span>
            </span>
            <span>IDEA → PRODUCT</span>
          </div>
          <div className="system-node node-interface">
            <Layers3 size={19} />
            <div>
              <small>01 / EXPERIENCE</small>
              <strong>Thoughtful interfaces</strong>
            </div>
          </div>
          <div className="system-node node-api">
            <Braces size={19} />
            <div>
              <small>02 / FOUNDATION</small>
              <strong>Reliable APIs</strong>
            </div>
          </div>
          <div className="system-node node-data">
            <Database size={19} />
            <div>
              <small>03 / STRUCTURE</small>
              <strong>Connected data</strong>
            </div>
          </div>
          <div className="system-node node-ai">
            <Sparkles size={19} />
            <div>
              <small>04 / POSSIBILITY</small>
              <strong>Applied intelligence</strong>
            </div>
          </div>
          <div className="canvas-bottom">
            <span>MERN · PYTHON · AI</span>
            <span className="canvas-cross">+</span>
          </div>
        </div>
      </div>
      <div className="hero-bottom">
        <a href="#projects">
          <ArrowDown size={17} aria-hidden="true" /> Explore the work
        </a>
        <p>
          <strong>{projects.length}</strong> projects <span>/</span> Full-stack
          · AI · SaaS · Automation
        </p>
        <span className="edition">PORTFOLIO / 2026</span>
      </div>
    </section>
  );
}
