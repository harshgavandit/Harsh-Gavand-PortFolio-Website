import { m } from "framer-motion";
import { useMotionEnabled } from "./MotionPreferences";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = !useMotionEnabled();
  return (
    <m.div
      className={className}
      initial={false}
      whileInView={reduce ? undefined : { y: [6, 0], opacity: [0.9, 1] }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.3, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}

export function SectionHeading({
  number,
  label,
  title,
  description,
}: {
  number: string;
  label: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <Reveal className="section-heading">
      <div className="eyebrow">
        <span>{number} /</span> {label}
      </div>
      <div className="heading-row">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
    </Reveal>
  );
}

export function ActionLink({
  children,
  href,
  primary = false,
  external = false,
  className = "",
}: {
  children: ReactNode;
  href: string;
  primary?: boolean;
  external?: boolean;
  className?: string;
}) {
  return (
    <a
      className={`button ${primary ? "button-primary" : "button-secondary"} ${className}`}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
    >
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </a>
  );
}

export function Tags({ items }: { items: string[] }) {
  return (
    <ul className="tags" aria-label="Technologies">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
