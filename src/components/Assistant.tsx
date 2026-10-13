import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { profile } from "../data/portfolio";

type Source = { label: string; href: string };
type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
};
const suggestions = [
  {
    label: "Explore AI projects",
    prompt: "Which projects best show Harsh's AI and backend skills?",
  },
  {
    label: "Experience & skills",
    prompt:
      "Summarize Harsh's professional experience and main technical skills.",
  },
  {
    label: "Find a role match",
    prompt:
      "What kinds of software engineering roles does Harsh's portfolio support, and what should I verify with him?",
  },
];

export function Assistant() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const generationRef = useRef(0);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const show = (event: Event) => {
      const prompt = (event as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (typeof prompt === "string" && prompt) setInput(prompt.slice(0, 2000));
      setOpen(true);
    };
    window.addEventListener("open-portfolio-assistant", show);
    return () => {
      window.removeEventListener("open-portfolio-assistant", show);
      requestRef.current?.abort();
    };
  }, []);
  useEffect(() => {
    if (open) {
      dialogRef.current?.showModal();
      inputRef.current?.focus({ preventScroll: true });
      const previous = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previous;
      };
    }
    dialogRef.current?.close();
  }, [open]);
  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, busy, error, open]);

  function stop() {
    generationRef.current++;
    requestRef.current?.abort();
    requestRef.current = null;
    setBusy(false);
    setError("Response stopped. Retry when you’re ready.");
  }
  function close() {
    if (busy) stop();
    setOpen(false);
  }
  function clear() {
    generationRef.current++;
    requestRef.current?.abort();
    requestRef.current = null;
    setMessages([]);
    setInput("");
    setError("");
    setBusy(false);
    inputRef.current?.focus();
  }
  async function send(text?: string, retry = false) {
    if (requestRef.current) return;
    const question = (text ?? input).trim();
    if (!retry && (!question || question.length > 2000)) return;
    const previous =
      messages.at(-1)?.role === "user" ? messages.slice(0, -1) : messages;
    const next: Message[] = retry
      ? messages
      : [...previous, { role: "user", content: question }];
    // Four complete exchanges plus the new question, bounded on both sides.
    let history = next
      .slice(-9)
      .map(({ role, content }) => ({ role, content: content.slice(0, 2000) }));
    while (history.reduce((n, m) => n + m.content.length, 0) > 10000)
      history = history.slice(2);
    const controller = new AbortController();
    requestRef.current = controller;
    const generation = ++generationRef.current;
    const timer = window.setTimeout(() => controller.abort(), 32000);
    setMessages(next);
    setInput("");
    setError("");
    setBusy(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      });
      if (!response.headers.get("content-type")?.includes("application/json"))
        throw new Error(
          "The assistant service is unavailable. Please contact Harsh directly.",
        );
      const data = await response.json();
      if (!response.ok)
        throw new Error(
          data.error || "The assistant is unavailable. Please try again.",
        );
      if (typeof data.answer !== "string")
        throw new Error("The answer could not be loaded. Please try again.");
      if (generation !== generationRef.current) return;
      setMessages([
        ...next,
        { role: "assistant", content: data.answer, sources: data.sources },
      ]);
    } catch (failure) {
      if (generation !== generationRef.current) return;
      setError(
        failure instanceof Error && failure.name !== "AbortError"
          ? failure.message
          : "The request took too long. Please try again.",
      );
    } finally {
      window.clearTimeout(timer);
      if (generation === generationRef.current) {
        setBusy(false);
        requestRef.current = null;
        inputRef.current?.focus({ preventScroll: true });
      }
    }
  }

  return (
    <>
      <button
        className="assistant-launcher"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls="portfolio-assistant"
      >
        <MessageCircle size={20} aria-hidden="true" />
        <span>Ask about Harsh</span>
        <span className="assistant-ai-badge">AI</span>
      </button>
      <dialog
        ref={dialogRef}
        id="portfolio-assistant"
        className="assistant-dialog"
        aria-labelledby="assistant-title"
        aria-describedby="assistant-disclosure"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => setOpen(false)}
      >
        <div className="assistant-shell">
          <header className="assistant-header">
            <span className="assistant-avatar" aria-hidden="true">
              <Sparkles size={20} />
            </span>
            <div>
              <h2 id="assistant-title">Portfolio intelligence</h2>
              <p>Explore Harsh’s work, with sources.</p>
            </div>
            <button
              className="assistant-icon"
              onClick={close}
              aria-label="Close assistant"
            >
              <X size={20} />
            </button>
          </header>
          <div className="assistant-scroll">
            {!messages.length && (
              <div className="assistant-welcome">
                <span className="eyebrow">A useful place to start</span>
                <h3>
                  What would you like
                  <br />
                  to know?
                </h3>
                <p>
                  I can help you explore Harsh’s projects, experience, and
                  skills. You can also paste a short job description to discuss
                  the fit.
                </p>
                <div className="assistant-suggestions">
                  {suggestions.map((s) => (
                    <button key={s.label} onClick={() => void send(s.prompt)}>
                      {s.label}
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div
              className="assistant-messages"
              role="log"
              aria-label="Conversation"
              aria-live="polite"
              aria-relevant="additions"
            >
              {messages.map((message, index) => (
                <article
                  className={`assistant-message from-${message.role}`}
                  key={index}
                >
                  <span className="assistant-speaker">
                    {message.role === "user" ? "You" : "Harsh’s assistant"}
                  </span>
                  <p>{message.content}</p>
                  {!!message.sources?.length && (
                    <nav
                      className="assistant-sources"
                      aria-label="Portfolio sources"
                    >
                      {message.sources.map((source) => (
                        <a
                          key={source.href}
                          href={source.href}
                          target={
                            source.href.startsWith("https:") ||
                            source.href.endsWith(".pdf")
                              ? "_blank"
                              : undefined
                          }
                          rel="noopener noreferrer"
                          onClick={() => {
                            if (source.href.startsWith("/#")) close();
                          }}
                        >
                          {source.label}
                          <ArrowUpRight size={13} aria-hidden="true" />
                        </a>
                      ))}
                    </nav>
                  )}
                </article>
              ))}
            </div>
            {busy && (
              <p className="assistant-working" role="status">
                <span aria-hidden="true" /> Looking through the portfolio…
              </p>
            )}
            {error && (
              <div className="assistant-error" role="alert">
                <p>{error}</p>
                <button onClick={() => void send(undefined, true)}>
                  <RotateCcw size={14} aria-hidden="true" /> Retry question
                </button>
                <a href={`mailto:${profile.email}`}>Email Harsh</a>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <footer className="assistant-composer">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void send();
              }}
            >
              <label className="sr-only" htmlFor="assistant-question">
                Your question about Harsh
              </label>
              <textarea
                ref={inputRef}
                id="assistant-question"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={2000}
                rows={2}
                placeholder="Ask about a project, skill, or role…"
                aria-describedby="assistant-disclosure"
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    if (!busy) void send();
                  }
                }}
              />
              {busy ? (
                <button
                  type="button"
                  className="assistant-send"
                  onClick={stop}
                  aria-label="Stop response"
                >
                  <Square size={17} />
                </button>
              ) : (
                <button
                  type="submit"
                  className="assistant-send"
                  disabled={!input.trim()}
                  aria-label="Send question"
                >
                  <ArrowUp size={20} />
                </button>
              )}
            </form>
            <div className="assistant-composer-meta">
              <span>{input.length}/2,000</span>
              <button onClick={clear} disabled={!messages.length && !input}>
                Clear chat
              </button>
            </div>
            <p id="assistant-disclosure">
              Powered by Gemini. Messages are sent to Google; this site keeps
              chat only until you clear it or reload. AI can make mistakes.
            </p>
          </footer>
        </div>
      </dialog>
    </>
  );
}
