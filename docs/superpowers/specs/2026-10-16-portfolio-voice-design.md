# Portfolio voice guide

Approved direction: the user selected both the spoken welcome and spoken questions/answers after the in-chat design. Preserve the existing corner launcher, text chat, content, and deployment. The user's standing instruction is autonomous implementation and GitHub delivery; continue inline without another routine approval cycle. Existing portfolio OpenAI/Upstash credentials are already authorized; no secret creation or changes are needed.

## Experience

- The existing assistant opens with Chat and Voice choices and a separate Listen to introduction action. No automatic audio, microphone request, or provider call on page arrival.
- Welcome text: “Hi, welcome to Harsh’s portfolio. I’m his AI guide. Ask me about his projects, experience, or the systems he’s built.” Generate one MP3, serve it as a static asset, and provide its transcript and stop control.
- Voice is turn-based: tap to record, stop/send, transcribe, generate a short portfolio-grounded answer, then play speech. Stop the microphone before network work. Maximum recording length is 20 seconds. No automatic listening after playback.
- Explicit requesting/listening/thinking/speaking states, elapsed recording time, cancel/stop, mute, replay of the last answer, and text fallback. Permission denial and autoplay rejection are recoverable UI states. Closing, clearing, changing mode, or hiding the page cancels recording, audio, and pending requests.
- Full transcript and canonical source links remain visible. A local allowlist maps explicit navigation requests to portfolio routes; render a relevant action, never navigate to model-provided arbitrary URLs. Navigation happens when the visitor chooses the action.
- Match the current dark/lime visual system. A small waveform responds to state and respects reduced motion. No extra floating launcher or intrusive popup.

## Architecture

- Browser MediaRecorder captures an explicitly permitted stream, then Web Audio decodes and downsamples to a strict 16kHz mono PCM16 WAV. Reject oversized, silent, malformed, or over-20-second recordings before dispatch.
- POST /api/voice/chat accepts bounded JSON with base64 WAV and up to eight prior alternating messages. The server validates actual PCM container length/rate/channels, not a client duration field. Request cap stays below Vercel limits.
- Reuse the existing application's origin checks, local/shared admission lease, and Redis quota object. One reservation covers transcription, GPT-6 Luna response, and speech; charge completed stages, conservatively charge ambiguous provider failures, and use the existing durable settlement retry mechanism. A denied reservation must result in zero provider calls.
- Transcription uses gpt-4o-mini-transcribe with JSON usage; bound cost by its documented 16,000-token context and 2,000 output tokens. Audio input and text output use conservative 2x prices of $1.25/M and $5/M. Unknown/invalid usage retains that stage's estimate.
- Text generation reuses buildRequest/generateReply with a short spoken-answer instruction. Keep the existing strict request configuration and source filtering.
- Speech uses tts-1 / nova / MP3, with at most 900 characters and 2x the documented $15/M-character rate. Only the server's portfolio answer reaches speech generation. Failure to synthesize still returns the written answer.
- OpenAI requests have timeouts, an abort signal, bounded response sizes, and sanitized errors. No prompts, raw audio, or transcripts are logged or persisted. Existing process-local chat memory remains the only conversation storage.
- Audio models and pricing are fixed in server code so an environment change cannot silently invalidate quota estimates. No new Vercel environment variables or dependencies.

## Verification

Write failing tests first for WAV validation, request/turn bounds, reservation-before-provider ordering, cancellation, stage charging, speech fallback, error redaction, canonical navigation, and audio cleanup. Run the full suite, lint, typecheck, build, and prerender checks. Verify actual providers with the short public welcome and one synthetic spoken portfolio question, never private audio. Browser-check greeting playback, recording lifecycle with synthetic media where available, mode switches, keyboard dismissal, transcript, and mobile layout. Distinguish synthetic/browser automation from physical microphone testing.
