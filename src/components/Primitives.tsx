import { m, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef, type ReactNode, type MouseEvent } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={false}
      whileInView={reduce ? undefined : { y: [16, 0], opacity: [0.7, 1] }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
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
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useReducedMotion();
  function move(event: MouseEvent<HTMLAnchorElement>) {
    if (reduce || !window.matchMedia("(pointer:fine)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.06}px, ${(event.clientY - rect.top - rect.height / 2) * 0.1}px)`;
  }
  return (
    <a
      ref={ref}
      className={`button ${primary ? "button-primary" : "button-secondary"} ${className}`}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={move}
      onMouseLeave={() => {
        if (ref.current) ref.current.style.transform = "";
      }}
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
