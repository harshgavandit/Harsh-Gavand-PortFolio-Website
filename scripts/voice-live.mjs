import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { loadConfig } from "../server/config.mjs";
import { encodeVoiceWav } from "../src/lib/voiceAudio.ts";
import { VOICE_MODELS } from "../server/voice.mjs";

if (!process.argv.includes("--live"))
  throw new Error(
    "Pass --live to run paid provider checks with a synthetic public question.",
  );
const config = loadConfig();
const endpoint =
  process.argv.find((a) => a.startsWith("--url="))?.slice(6) ||
  "http://127.0.0.1:3001";
if (
  !/^http:\/\/127\.0\.0\.1:\d+$/.test(endpoint) &&
  endpoint !== "https://harshgavand.dev"
)
  throw new Error("Use the local API or canonical portfolio domain.");
const response = await fetch("https://api.openai.com/v1/audio/speech", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${config.apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: VOICE_MODELS.speech,
    voice: VOICE_MODELS.voice,
    input: "Tell me about the Agri Samaj community platform.",
    response_format: "wav",
  }),
  signal: AbortSignal.timeout(20000),
});
if (!response.ok)
  throw new Error(`Synthetic speech generation failed (${response.status}).`);
const wave = Buffer.from(await response.arrayBuffer());
assert.equal(wave.toString("ascii", 8, 12), "WAVE");
let offset = 12,
  rate = 0,
  channels = 0,
  pcm;
while (offset + 8 <= wave.length) {
  const name = wave.toString("ascii", offset, offset + 4),
    length = wave.readUInt32LE(offset + 4);
  if (name === "fmt ") {
    assert.equal(wave.readUInt16LE(offset + 8), 1);
    channels = wave.readUInt16LE(offset + 10);
    rate = wave.readUInt32LE(offset + 12);
    assert.equal(wave.readUInt16LE(offset + 22), 16);
  }
  if (name === "data") {
    pcm = wave.subarray(offset + 8, Math.min(wave.length, offset + 8 + length));
    break;
  }
  offset += 8 + length + (length % 2);
}
assert.ok(pcm?.length && rate && channels);
const samples = new Float32Array(Math.floor(pcm.length / (2 * channels)));
for (let i = 0; i < samples.length; i++)
  for (let c = 0; c < channels; c++)
    samples[i] += pcm.readInt16LE((i * channels + c) * 2) / 32768 / channels;
const input = Buffer.from(encodeVoiceWav(samples, rate));
await mkdir(new URL("../tmp/voice/", import.meta.url), { recursive: true });
await writeFile(new URL("../tmp/voice/question.wav", import.meta.url), input);
const started = Date.now();
const result = await fetch(endpoint + "/api/voice/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ audio: input.toString("base64"), messages: [] }),
  signal: AbortSignal.timeout(58000),
});
const data = await result.json();
if (!result.ok)
  throw new Error(
    `Voice endpoint failed (${result.status}): ${data.code || "unavailable"}`,
  );
assert.match(data.transcript, /agri|samaj/i);
assert.match(data.answer, /community|samaj/i);
assert.ok(data.sources?.some((source) => source.href.includes("agri-samaj")));
assert.equal(data.audioType, "audio/mpeg");
assert.ok(data.audio?.length > 100);
await writeFile(
  new URL("../tmp/voice/reply.mp3", import.meta.url),
  Buffer.from(data.audio, "base64"),
);
console.log(
  JSON.stringify(
    {
      endpoint,
      status: result.status,
      transcription: "passed",
      groundedAnswer: "passed",
      sourceLinks: data.sources.length,
      speechBytes: Buffer.from(data.audio, "base64").length,
      durationMs: Date.now() - started,
      input: "synthetic public question; no microphone recording",
    },
    null,
    2,
  ),
);
