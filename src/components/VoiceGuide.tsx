import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Headphones,
  Mic,
  Play,
  Square,
  Volume2,
  VolumeX,
} from "lucide-react";
import { startVoiceCapture, voiceHistory } from "../lib/voiceAudio";
import type { ConversationMessage, VoiceCapture } from "../lib/voiceAudio";
import { voiceDestination } from "../lib/voiceNavigation";

type Props = {
  active: boolean;
  resetKey: number;
  messages: ConversationMessage[];
  onAnswer: (question: string, answer: ConversationMessage) => void;
  onNavigate: () => void;
};
type Phase = "ready" | "permission" | "listening" | "processing" | "speaking";
const labels: Record<Phase, string> = {
  ready: "Ready when you are",
  permission: "Waiting for microphone permission…",
  listening: "Listening — finish when you’re ready",
  processing: "Transcribing and preparing your answer…",
  speaking: "Harsh’s AI voice assistant is speaking",
};

export function VoiceGuide({
  active,
  resetKey,
  messages,
  onAnswer,
  onNavigate,
}: Props) {
  const session = useRef({
    generation: 0,
    controller: null as AbortController | null,
    capture: null as VoiceCapture | null,
    audio: null as HTMLAudioElement | null,
    url: "",
    timer: 0,
  });
  const [phase, setPhase] = useState<Phase>("ready");
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const [error, setError] = useState("");
  const [hasAudio, setHasAudio] = useState(false);
  const [destination, setDestination] =
    useState<ReturnType<typeof voiceDestination>>();

  const stop = useCallback(() => {
    const current = session.current;
    current.generation++;
    current.controller?.abort();
    current.controller = null;
    current.capture?.cancel();
    current.capture = null;
    window.clearInterval(current.timer);
    if (current.audio) {
      current.audio.pause();
      current.audio.onended = null;
      current.audio.onerror = null;
      current.audio = null;
    }
    setPhase("ready");
  }, []);
  const releaseAudio = useCallback(() => {
    if (session.current.url) URL.revokeObjectURL(session.current.url);
    session.current.url = "";
    setHasAudio(false);
  }, []);

  useEffect(() => {
    if (!active) {
      stop();
      releaseAudio();
    }
    const hidden = () => {
      if (document.hidden) {
        stop();
        releaseAudio();
      }
    };
    document.addEventListener("visibilitychange", hidden);
    return () => {
      document.removeEventListener("visibilitychange", hidden);
      stop();
      releaseAudio();
    };
  }, [active, resetKey, stop, releaseAudio]);

  async function play(url: string, generation = session.current.generation) {
    if (generation !== session.current.generation) return;
    session.current.audio?.pause();
    const audio = new Audio(url);
    session.current.audio = audio;
    audio.onended = () => {
      if (generation === session.current.generation) setPhase("ready");
    };
    audio.onerror = () => {
      if (generation === session.current.generation) {
        setPhase("ready");
        setError(
          "Audio couldn’t play. You can read the conversation or try replay.",
        );
      }
    };
    try {
      await audio.play();
      if (generation === session.current.generation) setPhase("speaking");
      else audio.pause();
    } catch {
      if (generation === session.current.generation) {
        setPhase("ready");
        setError("Tap Replay answer to start audio, or continue in text.");
      }
    }
  }

  function intro() {
    stop();
    setError("");
    if (mutedRef.current) {
      mutedRef.current = false;
      setMuted(false);
    }
    void play("/voice/welcome.mp3");
  }

  async function finish() {
    const current = session.current;
    const capture = current.capture;
    const controller = current.controller;
    if (!capture || !controller) return;
    current.capture = null;
    window.clearInterval(current.timer);
    const generation = current.generation;
    setPhase("processing");
    const timeout = window.setTimeout(() => controller.abort(), 57000);
    try {
      const audio = await capture.finish();
      controller.signal.throwIfAborted();
      const response = await fetch("/api/voice/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audio, messages: voiceHistory(messages) }),
        signal: controller.signal,
      });
      if (!response.headers.get("content-type")?.includes("application/json"))
        throw new Error(
          "Voice is temporarily unavailable. Please use text chat.",
        );
      const data = await response.json();
      if (generation !== current.generation) return;
      if (!response.ok)
        throw new Error(
          data.error ||
            "Voice is temporarily unavailable. Please use text chat.",
        );
      if (
        typeof data.transcript !== "string" ||
        typeof data.answer !== "string"
      )
        throw new Error("The answer couldn’t be loaded. Please try text chat.");
      onAnswer(data.transcript, {
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        evidence: data.evidence,
      });
      setDestination(voiceDestination(data.transcript));
      releaseAudio();
      if (
        typeof data.audio === "string" &&
        data.audio.length <= 2000000 &&
        data.audioType === "audio/mpeg"
      ) {
        const bytes = Uint8Array.from(atob(data.audio), (char) =>
          char.charCodeAt(0),
        );
        current.url = URL.createObjectURL(
          new Blob([bytes], { type: "audio/mpeg" }),
        );
        setHasAudio(true);
        if (!mutedRef.current) await play(current.url, generation);
        else setPhase("ready");
      } else {
        setPhase("ready");
        setError(
          data.audioError ||
            "Audio is unavailable. Your written answer is below.",
        );
      }
    } catch (failure) {
      if (generation !== current.generation) return;
      setPhase("ready");
      setError(
        controller.signal.aborted
          ? "Voice request stopped. You can try again or use text chat."
          : failure instanceof Error
            ? failure.message
            : "Voice is unavailable. Please use text chat.",
      );
    } finally {
      window.clearTimeout(timeout);
      capture.cancel();
      if (generation === current.generation) current.controller = null;
    }
  }

  async function record() {
    stop();
    releaseAudio();
    setError("");
    setDestination(undefined);
    setSeconds(0);
    const current = session.current;
    const generation = current.generation;
    const controller = new AbortController();
    current.controller = controller;
    setPhase("permission");
    try {
      const capture = await startVoiceCapture(controller.signal);
      if (generation !== current.generation) {
        capture.cancel();
        return;
      }
      current.capture = capture;
      setPhase("listening");
      const started = performance.now();
      current.timer = window.setInterval(() => {
        const elapsed = performance.now() - started;
        setSeconds(Math.min(20, Math.floor(elapsed / 1000)));
        if (elapsed >= 19500) void finish();
      }, 200);
    } catch (failure) {
      if (generation !== current.generation) return;
      current.controller = null;
      setPhase("ready");
      setError(
        failure instanceof DOMException && failure.name === "NotAllowedError"
          ? "Microphone access wasn’t allowed. Enable it in your browser or use text chat."
          : failure instanceof Error
            ? failure.message
            : "Microphone unavailable. Please use text chat.",
      );
    }
  }

  return (
    <section
      className="voice-guide"
      hidden={!active}
      aria-label="Harsh’s AI voice assistant"
    >
      <div className="voice-guide-heading">
        <span className="eyebrow">Harsh’s AI voice assistant</span>
        <button
          type="button"
          className="voice-mute"
          aria-pressed={muted}
          onClick={() => {
            const next = !muted;
            mutedRef.current = next;
            setMuted(next);
            if (next) {
              session.current.audio?.pause();
              if (phase === "speaking") setPhase("ready");
            }
          }}
        >
          {muted ? (
            <VolumeX size={16} aria-hidden="true" />
          ) : (
            <Volume2 size={16} aria-hidden="true" />
          )}
          {muted ? "Voice muted" : "Mute voice"}
        </button>
      </div>
      <div className={`voice-orb is-${phase}`} aria-hidden="true">
        <Headphones size={30} />
        <div className="voice-bars">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} />
          ))}
        </div>
      </div>
      <h3>Ask in your own words.</h3>
      <p className="voice-intro">
        Explore Harsh’s projects, experience, and engineering decisions. Every
        answer stays here as text, with source links.
      </p>
      <p className="voice-state" role="status" aria-live="polite">
        {labels[phase]}
        {phase === "listening" ? ` · ${seconds}s / 20s` : ""}
      </p>
      <div className="voice-actions">
        {phase === "listening" ? (
          <button
            type="button"
            className="voice-primary"
            onClick={() => void finish()}
          >
            <Square size={16} aria-hidden="true" /> Finish question
          </button>
        ) : (
          <button
            type="button"
            className="voice-primary"
            disabled={phase === "permission" || phase === "processing"}
            onClick={() => void record()}
          >
            <Mic size={17} aria-hidden="true" /> Ask by voice
          </button>
        )}
        {phase !== "ready" && (
          <button type="button" onClick={stop}>
            <Square size={15} aria-hidden="true" /> Stop
          </button>
        )}
        {phase === "ready" && (
          <button type="button" onClick={intro}>
            <Headphones size={17} aria-hidden="true" /> Listen to welcome
          </button>
        )}
        {hasAudio && phase === "ready" && (
          <button
            type="button"
            disabled={muted}
            onClick={() => {
              setError("");
              void play(session.current.url);
            }}
          >
            <Play size={15} aria-hidden="true" /> Replay answer
          </button>
        )}
      </div>
      {error && (
        <p className="voice-error" role="alert">
          {error}
        </p>
      )}
      {destination && (
        <a
          className="voice-destination"
          href={destination.href}
          onClick={onNavigate}
        >
          {destination.label}
          <ArrowUpRight size={16} aria-hidden="true" />
        </a>
      )}
      <p className="voice-privacy">
        Voice processed by OpenAI. This site doesn’t save recordings.
      </p>
      <details className="voice-transcript">
        <summary>Welcome transcript</summary>
        <p>
          Hi, welcome to Harsh’s portfolio. I’m Harsh’s AI voice assistant. Ask me
          about his projects, experience, or the systems he’s built.
        </p>
      </details>
    </section>
  );
}
