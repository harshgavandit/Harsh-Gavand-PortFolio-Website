import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { profile } from "../data/portfolio";
import { ActionLink, Reveal } from "./Primitives";

export function Contact() {
  const [draft, setDraft] = useState("");
  const [notice, setNotice] = useState("");
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setNotice("Email address copied.");
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
    setNotice(
      "Your draft is ready. Open your email app below to review and send it. Nothing has been sent.",
    );
  }
  return (
    <section
      id="contact"
      className="section contact-section"
      tabIndex={-1}
      aria-labelledby="contact-title"
    >
      <div className="section-container">
        <div className="eyebrow">07 / Let’s connect</div>
        <div className="contact-layout">
          <Reveal>
            <h2 id="contact-title">
              Good things start
              <br />
              with a <span className="accent-text">conversation.</span>
            </h2>
            <p className="body-copy">
              Have a product to build or a team to grow? I’m open to full-time,
              contract, and freelance opportunities in full-stack and AI
              engineering.
            </p>
            <a className="contact-email" href={`mailto:${profile.email}`}>
              {profile.email}
              <ArrowUpRight size={22} aria-hidden="true" />
            </a>
            <button className="copy-email" onClick={copyEmail}>
              {notice === "Email address copied." ? (
                <Check size={14} />
              ) : (
                <Copy size={14} />
              )}{" "}
              Copy email address
            </button>
            <div className="contact-socials">
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <ArrowUpRight size={15} />
              </a>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <ArrowUpRight size={15} />
              </a>
              <a
                href={profile.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                Resume <ArrowUpRight size={15} />
              </a>
            </div>
            <p className="contact-location">
              {profile.location} · Working across the full stack
            </p>
            <p className="alternate-email">
              Also reachable at{" "}
              <a href={`mailto:${profile.alternateEmail}`}>
                {profile.alternateEmail}
              </a>
            </p>
          </Reveal>
          <Reveal className="contact-form-wrap">
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
          </Reveal>
        </div>
        <p role="status" className="contact-notice">
          {notice}
        </p>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="section-container site-footer">
      <a href="#hero" className="footer-brand">
        Harsh Gavand<span>Full-Stack & AI Engineer</span>
      </a>
      <p>© {new Date().getFullYear()} · Thoughtfully built with React.</p>
      <a href="#hero">
        Back to top <ArrowUpRight size={16} aria-hidden="true" />
      </a>
    </footer>
  );
}
