# Portfolio voice guide verification

## Automated checks

- `npm run lint`: passed, no warnings.
- `npm run type-check`: passed.
- `npm test`: 100 tests passed, covering text chat, source filtering, shared admission, quota recovery, media cleanup, voice stage accounting, validation, cancellation, and Vercel voice rewrites.
- `npm run build`: passed; prerendered homepage, archive, six work pages, and 404.
- `npm run test:prerender`: 27 tests passed, including rendered voice controls, welcome transcript, no autoplay, MP3 content type, semantic routes, assets, SEO, and accessibility markup.

## Provider check

`node scripts/voice-live.mjs --live` used a generated public question about Agri Samaj against the local API with the existing OpenAI/Upstash configuration. HTTP 200, recognized question, portfolio-grounded answer, three source links, and 535,680 bytes of MP3 speech were returned in 9,232ms. The script writes only synthetic audio to ignored `tmp/voice/`; it never records the physical microphone or prints credentials. The static public welcome was generated once and is 107,904 bytes.

## Browser coverage and limits

The local assistant opened, switched between text and voice, and played/stopped the welcome. The voice design was visually inspected in the default narrow in-app viewport. A temporary synthetic microphone override reached the listening state without accessing physical hardware. Further local browser use was then disabled in Work settings, so the synthetic browser round-trip result, full responsive matrix, and final visual check could not be completed. No alternate browser mechanism was used to bypass that setting. Reloading the temporary local browser tab removes its test-only microphone override.

Media unit tests cover successful finish, release of tracks, decoder closure, permission arriving after cancellation, recorder startup failure, cancellation during decode, duration/format conversion, silence, and complete bounded conversation pairs. These tests and the direct provider check do not establish physical microphone or speaker performance on every device.

## Operation

The live feature reuses the existing OpenAI key and Upstash configuration. Voice and text share daily/monthly allowances, admission, and durable accounting recovery. No new secrets, services, or dependencies are introduced. The welcome is click-to-play and makes no API request; voice recording requires deliberate activation and never restarts automatically. Site code does not persist audio or conversation text. OpenAI receives the recording/messages under its applicable data controls.
