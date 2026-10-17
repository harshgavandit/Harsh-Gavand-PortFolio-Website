import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  RotateCcw,
  Sparkles,
  Square,
  X,
} from "lucide-react";
import { profile } from "../data/portfolio";
import { isAssistantShortcut } from "../lib/interaction";
import { VoiceGuide } from "./VoiceGuide";
import { AssistantQuestions } from "./AssistantQuestions";
import { CodeEvidence } from "./CodeEvidence";
import type { CodeEvidence as Evidence } from "../lib/aiWorkspace";

type Source = { label: string; href: string };
type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  evidence?: Evidence[];
};

export function Assistant({
  initialRequest,
  onOpenChange,
}: {
  initialRequest: { prompt: string; opener: HTMLElement | null };
  onOpenChange: (open: boolean) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const openerRef = useRef<HTMLElement | null>(initialRequest.opener);
  const endRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  const generationRef = useRef(0);
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(initialRequest.prompt);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [retryAllowed, setRetryAllowed] = useState(true);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [voiceReset, setVoiceReset] = useState(0);

  useEffect(() => {
    onOpenChange(open);
  }, [open, onOpenChange]);

  useEffect(() => {
    const show = (event: Event) => {
      const active = document.activeElement as HTMLElement | null;
      openerRef.current = active?.closest("#mobile-navigation")
        ? document.querySelector<HTMLElement>(".menu-toggle")
        : active;
      const prompt = (event as CustomEvent<{ prompt?: string }>).detail?.prompt;
      if (typeof prompt === "string" && prompt) {
        setInput(prompt.slice(0, 2000));
        setMode("text");
      }
      setOpen(true);
    };
    window.addEventListener("open-portfolio-assistant", show);
    const shortcut = (event: KeyboardEvent) => {
      if (!isAssistantShortcut(event)) return;
      event.preventDefault();
      openerRef.current = document.activeElement as HTMLElement | null;
      setOpen(true);
      inputRef.current?.focus({ preventScroll: true });
    };
    const legacyHash = () => {
      if (window.location.hash === "#intelligence") setOpen(true);
    };
    window.addEventListener("keydown", shortcut);
    window.addEventListener("hashchange", legacyHash);
    legacyHash();
    return () => {
      window.removeEventListener("keydown", shortcut);
      window.removeEventListener("hashchange", legacyHash);
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
    if (open && mode === "text" && messages.length)
      endRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, busy, error, open, mode]);
  useEffect(() => {
    if (mode === "voice") scrollRef.current?.scrollTo({ top: 0 });
  }, [mode, open]);

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
    setVoiceReset((value) => value + 1);
    generationRef.current++;
    requestRef.current?.abort();
    requestRef.current = null;
    setMessages([]);
    setInput("");
    setError("");
    setRetryAllowed(true);
    setBusy(false);
    inputRef.current?.focus();
  }
  async function send(text?: string, retry = false) {
    if (requestRef.current || mode !== "text") return;
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
    setRetryAllowed(true);
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
      if (generation !== generationRef.current) return;
      if (!response.ok) {
        setRetryAllowed(!["daily_limit", "monthly_budget"].includes(data.code));
        throw new Error(
          data.error || "The assistant is unavailable. Please try again.",
        );
      }
      if (typeof data.answer !== "string")
        throw new Error("The answer could not be loaded. Please try again.");
      if (generation !== generationRef.current) return;
      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          evidence: data.evidence,
        },
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
        onClose={() => {
          setOpen(false);
          const opener = openerRef.current;
          if (opener?.isConnected && opener.getClientRects().length)
            opener.focus({ preventScroll: true });
          else
            document
              .querySelector<HTMLElement>(".header-ask, .menu-toggle")
              ?.focus({ preventScroll: true });
        }}
      >
        <div className="assistant-shell">
          <header className="assistant-header">
            <span className="assistant-avatar" aria-hidden="true">
              <Sparkles size={20} />
            </span>
            <div>
              <h2 id="assistant-title">Ask Harsh’s AI</h2>
              <p>Explore Harsh’s work, in text or voice.</p>
            </div>
            <button
              className="assistant-icon"
              onClick={close}
              aria-label="Close assistant"
            >
              <X size={20} />
            </button>
          </header>
          <div
            className="assistant-modes"
            role="group"
            aria-label="Conversation mode"
          >
            <button
              type="button"
              aria-pressed={mode === "text"}
              onClick={() => {
                setMode("text");
                window.setTimeout(() => inputRef.current?.focus(), 0);
              }}
            >
              Text chat
            </button>
            <button
              type="button"
              aria-pressed={mode === "voice"}
              onClick={() => {
                if (busy) stop();
                setError("");
                setMode("voice");
              }}
            >
              Voice assistant
            </button>
            <a href="/ai/" className="assistant-workspace-link" onClick={close}>
              AI workspace <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
          <div className="assistant-scroll" ref={scrollRef}>
            <VoiceGuide
              active={open && mode === "voice"}
              resetKey={voiceReset}
              messages={messages}
              onAnswer={(question, answer) => {
                setMessages((previous) => [
                  ...(previous.at(-1)?.role === "user"
                    ? previous.slice(0, -1)
                    : previous),
                  { role: "user", content: question },
                  answer,
                ]);
              }}
              onNavigate={close}
            />
            {!messages.length && mode === "text" && (
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
                <AssistantQuestions onSelect={(prompt) => void send(prompt)} />
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
                  <CodeEvidence items={message.evidence} />
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
                            if (source.href.startsWith("/")) close();
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
                {retryAllowed && (
                  <button onClick={() => void send(undefined, true)}>
                    <RotateCcw size={14} aria-hidden="true" /> Retry question
                  </button>
                )}
                <a href={`mailto:${profile.email}`}>Email Harsh</a>
              </div>
            )}
            {!!messages.length && mode === "text" && (
              <AssistantQuestions
                compact
                disabled={busy}
                onSelect={(prompt) => void send(prompt)}
              />
            )}
            <div ref={endRef} />
          </div>
          <footer className="assistant-composer">
            {mode === "text" && (
              <>
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
              </>
            )}
            <div className="assistant-composer-meta">
              <span>
                {mode === "text"
                  ? `${input.length}/2,000`
                  : "Voice and text share this conversation"}
              </span>
              <button onClick={clear} disabled={!messages.length && !input}>
                Clear chat
              </button>
            </div>
            {mode === "text" && (
              <p id="assistant-disclosure">
                Messages go to OpenAI. This site doesn’t save your chat.
              </p>
            )}
          </footer>
        </div>
      </dialog>
    </>
  );
}
