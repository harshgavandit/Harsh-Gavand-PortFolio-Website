import { useState } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { profile } from "../data/portfolio";
import { availability } from "../data/availability";
import { ActionLink, ChapterHeading } from "./Primitives";

export function Contact() {
  const [notice, setNotice] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setNotice("Copied to clipboard!");
    } catch {
      setNotice(`Copy this email address: ${profile.email}`);
    }
  }
  return (
    <section
      id="contact"
      className="section contact-section"
      tabIndex={-1}
      aria-labelledby="contact-title"
    >
      <div className="section-container contact-direct">
        <ChapterHeading id="contact" title={availability.contactHeadline} />
        <p className="body-copy">{availability.collaboration}</p>
        <a className="contact-email" href={`mailto:${profile.email}`}>
          {profile.email}
          <ArrowUpRight size={22} aria-hidden="true" />
        </a>
        <div className="contact-socials actions">
          <button
            type="button"
            className="button button-primary copy-email"
            onClick={copyEmail}
            aria-label={`Copy email ${profile.email}`}
          >
            {notice === "Copied to clipboard!" ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            {notice === "Copied to clipboard!"
              ? "Copied to clipboard!"
              : "Copy Email"}
          </button>
          <ActionLink href={profile.resume} external>
            View Resume (PDF)
          </ActionLink>
          <ActionLink href={profile.github} external>
            GitHub
          </ActionLink>
          <ActionLink href={profile.linkedin} external>
            LinkedIn
          </ActionLink>
        </div>
        <p className="contact-location availability-badge">
          <span className="status-dot" aria-hidden="true" />
          <span>{availability.contactLocation}</span>
        </p>
        <p role="status" className="contact-notice">
          {notice}
        </p>
      </div>
    </section>
  );
}

export function Footer({ year }: { year: number }) {
  return (
    <footer className="section-container site-footer">
      <a href="/#hero" className="footer-brand">
        <span className="footer-name">
          <span>Harsh</span> <span>Gavand</span>
        </span>
        <span className="footer-role">Full-Stack &amp; AI Engineer</span>
      </a>
      <p>© {year} Harsh Gavand. All rights reserved.</p>
      <a href="/#hero" className="footer-top">
        <span>Back to top</span>
        <span className="footer-top-icon">
          <ArrowUp size={18} strokeWidth={2.5} aria-hidden="true" />
        </span>
      </a>
    </footer>
  );
}
