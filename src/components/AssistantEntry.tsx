import { useEffect, useRef, useState, type ComponentType } from "react";
import { MessageCircle } from "lucide-react";
import { isAssistantShortcut } from "../lib/interaction";
type OpenRequest = { prompt: string; opener: HTMLElement | null };
type DialogProps = {
  initialRequest: OpenRequest;
  onOpenChange: (open: boolean) => void;
};
let modulePromise: ReturnType<typeof importDialog> | undefined;
const importDialog = () => import("./Assistant");
const preload = () => (modulePromise ??= importDialog());

export function AssistantEntry() {
  const [Dialog, setDialog] = useState<ComponentType<DialogProps> | null>(null);
  const [request, setRequest] = useState<OpenRequest | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [error, setError] = useState(false);
  const mounted = useRef(true);
  const ready = useRef(false);
  useEffect(() => {
    mounted.current = true;
    const show = (event: Event) => {
      if (ready.current) return; // The loaded dialog handles subsequent open events.
      const active = document.activeElement as HTMLElement | null;
      const opener = active?.closest("#mobile-navigation")
        ? document.querySelector<HTMLElement>(".menu-toggle")
        : active;
      const prompt =
        (event as CustomEvent<{ prompt?: string }>).detail?.prompt || "";
      setRequest({ prompt: prompt.slice(0, 2000), opener });
      setExpanded(true);
      setError(false);
      void preload()
        .then((module) => {
          if (!mounted.current) return;
          ready.current = true;
          setDialog(() => module.Assistant);
        })
        .catch(() => {
          modulePromise = undefined;
          if (mounted.current) {
            setError(true);
            setExpanded(false);
          }
        });
    };
    const shortcut = (event: KeyboardEvent) => {
      if (!ready.current && isAssistantShortcut(event)) {
        event.preventDefault();
        show(new Event("open-portfolio-assistant"));
      }
    };
    window.addEventListener("open-portfolio-assistant", show);
    window.addEventListener("keydown", shortcut);
    if (location.hash === "#intelligence")
      show(new Event("open-portfolio-assistant"));
    return () => {
      mounted.current = false;
      window.removeEventListener("open-portfolio-assistant", show);
      window.removeEventListener("keydown", shortcut);
    };
  }, []);
  return (
    <>
      <button
        type="button"
        className="assistant-launcher"
        aria-label="Ask Harsh’s AI"
        aria-haspopup="dialog"
        aria-expanded={expanded}
        aria-controls={Dialog ? "portfolio-assistant" : undefined}
        onPointerEnter={() => {
          void preload().catch(() => {
            modulePromise = undefined;
          });
        }}
        onFocus={() => {
          void preload().catch(() => {
            modulePromise = undefined;
          });
        }}
        onClick={() =>
          window.dispatchEvent(new CustomEvent("open-portfolio-assistant"))
        }
      >
        <MessageCircle size={20} aria-hidden="true" />
        <span className="assistant-launcher-label">Ask Harsh’s AI</span>
        <kbd aria-hidden="true">Ctrl / ⌘ K</kbd>
      </button>
      {request && !Dialog && (
        <p className="assistant-loading" role="status">
          {error
            ? "Couldn’t open the assistant. Select Ask AI to retry."
            : "Opening the assistant…"}
        </p>
      )}
      {Dialog && request && (
        <Dialog initialRequest={request} onOpenChange={setExpanded} />
      )}
    </>
  );
}
