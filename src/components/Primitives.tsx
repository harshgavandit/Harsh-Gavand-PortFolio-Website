import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import type { ChapterId } from "../data/recruiter";
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return <div className={className}>{children}</div>;
}
export function SectionHeading({
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
    <div className="section-heading">
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      {description && <p className="section-description">{description}</p>}
    </div>
  );
}
export function ChapterHeading({
  id,
  title,
  description,
}: {
  id: ChapterId;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <h2 id={id + "-title"} data-chapter={id}>
        {title}
      </h2>
      {description && <p className="section-description">{description}</p>}
    </div>
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
      <ArrowUpRight size={16} aria-hidden="true" />
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

export function LeadStatement({ text }: { text: string }) {
  const boundary = text.indexOf(": ");
  if (boundary < 0) return <>{text}</>;
  return (
    <>
      <strong>{text.slice(0, boundary + 1)}</strong>
      {text.slice(boundary + 1)}
    </>
  );
}
