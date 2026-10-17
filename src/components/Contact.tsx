import { useState, type FormEvent } from "react";
import { ArrowUp, ArrowUpRight, Check, Copy } from "lucide-react";
import { profile } from "../data/portfolio";
import { ActionLink, ChapterHeading, Reveal } from "./Primitives";

export function Contact() {
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setNotice("Copied to clipboard!");
    } catch {
      setNotice(`Copy this email address: ${profile.email}`);
    }
  }
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `${String(data.get("message")).trim()}\n\nFrom: ${String(data.get("name")).trim()}\nReply to: ${String(data.get("email")).trim()}`;
    setDraft(
      `mailto:${profile.email}?subject=${encodeURIComponent(String(data.get("subject") || "Portfolio enquiry"))}&body=${encodeURIComponent(body)}`,
    );
    setNotice("Draft ready. Open your email app to send it.");
  }
  return (
    <section
      id="contact"
      className="section contact-section"
      tabIndex={-1}
      aria-labelledby="contact-title"
    >
      <div className="section-container">
        <ChapterHeading id="contact" title="Let’s talk about the role." />
        <div className="contact-layout">
          <Reveal>
            <h3 className="contact-lead">
              Full-stack, backend
              <br />
              &amp; applied AI.
            </h3>
            <p className="body-copy">
              I’m open to remote full-time, contract, and freelance
              opportunities in full-stack and AI engineering.
            </p>
            <a className="contact-email" href={`mailto:${profile.email}`}>
              {profile.email}
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
            <button
              type="button"
              className="copy-email"
              onClick={copyEmail}
              aria-label={`Copy email ${profile.email}`}
            >
              {notice === "Copied to clipboard!" ? (
                <Check size={14} aria-hidden="true" />
              ) : (
                <Copy size={14} aria-hidden="true" />
              )}{" "}
              {notice === "Copied to clipboard!"
                ? "Copied to clipboard!"
                : "Copy Email"}
            </button>
            <div className="contact-socials actions">
              <ActionLink href={profile.resume} external primary>
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
              {profile.availability}
            </p>
          </Reveal>
          <Reveal className="contact-form-wrap">
            <details className="contact-compose">
              <summary>
                Help compose a message <span>Optional email draft</span>
              </summary>
              <h3>A little about your idea.</h3>
              <p>
                Prepare an email draft. You review and send it from your email
                app.
              </p>
              <form
                onSubmit={prepare}
                onChange={() => {
                  setDraft("");
                  setNotice("");
                }}
              >
                <div className="form-row">
                  <label>
                    Your name
                    <input
                      name="name"
                      autoComplete="name"
                      required
                      maxLength={100}
                      placeholder="Alex Morgan"
                    />
                  </label>
                  <label>
                    Email address
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      maxLength={200}
                      placeholder="alex@company.com"
                    />
                  </label>
                </div>
                <label>
                  What’s on your mind?
                  <input
                    name="subject"
                    maxLength={160}
                    placeholder="A role, a product, a collaboration…"
                  />
                </label>
                <label>
                  Tell me a little more
                  <textarea
                    name="message"
                    required
                    maxLength={2500}
                    rows={4}
                    placeholder="The idea, the opportunity, or the challenge."
                  />
                </label>
                <button type="submit" className="button button-primary">
                  Prepare email draft{" "}
                  <ArrowUpRight size={17} aria-hidden="true" />
                </button>
              </form>
              {draft && (
                <ActionLink href={draft} primary>
                  Open email app to send
                </ActionLink>
              )}
            </details>
          </Reveal>
        </div>
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
      <p>@Harsh Gavand {year} Inc. All rights reserved</p>
      <a href="/#hero" className="footer-top">
        <span>Back to top</span>
        <span className="footer-top-icon">
          <ArrowUp size={18} strokeWidth={2.5} aria-hidden="true" />
        </span>
      </a>
    </footer>
  );
}
