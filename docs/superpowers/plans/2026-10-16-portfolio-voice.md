# Portfolio voice implementation

Execution: inline, following the approved in-chat direction and standing autonomous delivery instruction. Design: ../specs/2026-10-16-portfolio-voice-design.md.

- [x] Backend contract: add failing scripts/voice.test.mjs tests against createApplication for the new route; run and confirm 404 failures, then implement server/voice.mjs and its app integration.
- [x] Audio boundaries: src/lib/voiceAudio.ts encodes PCM16 and manages browser capture; src/lib/voiceNavigation.ts maps explicit requests to known work routes. Add scripts/voice-client.test.mjs tests, observe failure, then implement.
- [x] UI: src/components/VoiceGuide.tsx owns voice/intro state, audio and capture cleanup. Assistant.tsx provides messages and callbacks and preserves chat. src/voice.css contains responsive/reduced-motion styles. Add rendered checks for controls and no autoplay.
- [x] Static greeting: scripts/generate-voice-welcome.mjs uses existing loadConfig and the fixed welcome text, outputs public/voice/welcome.mp3 only. Live smoke uses public synthetic speech; no personal recording.
- [ ] Verify: npm test, lint, type-check, build, test:prerender, and browser responsive/keyboard/playback/cancellation checks. Review staged secrets and whitespace, commit/push, confirm exact Vercel revision, then verify public HTML/API/audio.

## Review focus

1. Actual WAV bytes determine duration; malformed or disguised compressed input never reaches a provider.
2. All stages share one reserved budget and admission lease; known partial failures settle safely and unknown usage stays conservatively charged.
3. A stopped or superseded request cannot append a late answer or start playback. Every track, timer, audio URL, and AudioContext is cleaned up.
4. Audio is opt-in, a muted mode preserves transcripts, blocked playback has a manual retry, and microphone denial preserves chat.
5. Existing text behavior, source links, shared quota recovery, SSR hydration, and Vercel dispatch remain compatible.

## Verification progress

Lint, typecheck, 100 application tests, build, and 27 prerender/HTTP checks passed. A real local OpenAI round trip using synthetic public speech passed in 9.2 seconds, including transcription, grounded response, three canonical sources, and MP3 output. Browser welcome play/stop and synthetic capture startup were observed. Further browser work was disabled in Work settings before the synthetic capture result, responsive matrix, and final visual pass could be verified. Physical microphone behavior has not been tested. No browser restriction was bypassed. The temporary local test tab used a synthetic getUserMedia override; reloading that tab restores its normal browser implementation.
