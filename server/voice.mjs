import {
  ChatError,
  validateMessages,
  buildRequest,
  sourceLinks,
} from "./openai.mjs";
import { reservationFor, usageCost } from "./quota.mjs";

export const VOICE_MODELS = Object.freeze({
  transcription: "gpt-4o-mini-transcribe",
  speech: "tts-1",
  voice: "nova",
});
// Integer microdollars, including the same 2x safety margin as text chat.
// Transcription: 16k context + 2k output at $1.25/$5 per million tokens.
// Speech: at most 900 characters at $15 per million characters.
const TRANSCRIPTION_BOUND = 60000;
const TEXT_BOUND = Math.ceil(104096 / 5 + 1000);
const SPEECH_BOUND = 900 * 30;
export const VOICE_RESERVATION =
  TRANSCRIPTION_BOUND + TEXT_BOUND + SPEECH_BOUND;

function invalidAudio() {
  return new ChatError(
    400,
    "invalid_audio",
    "Record a short question (up to 20 seconds) and try again.",
  );
}

export function validateVoice(body) {
  if (
    !body ||
    typeof body.audio !== "string" ||
    body.audio.length > 854000 ||
    !/^[A-Za-z0-9+/]+={0,2}$/.test(body.audio)
  )
    throw invalidAudio();
  const audio = Buffer.from(body.audio, "base64");
  if (
    audio.toString("base64") !== body.audio ||
    audio.length < 3244 ||
    audio.length > 640044
  )
    throw invalidAudio();
  if (
    audio.toString("ascii", 0, 4) !== "RIFF" ||
    audio.readUInt32LE(4) !== audio.length - 8 ||
    audio.toString("ascii", 8, 16) !== "WAVEfmt " ||
    audio.readUInt32LE(16) !== 16 ||
    audio.readUInt16LE(20) !== 1 ||
    audio.readUInt16LE(22) !== 1 ||
    audio.readUInt32LE(24) !== 16000 ||
    audio.readUInt32LE(28) !== 32000 ||
    audio.readUInt16LE(32) !== 2 ||
    audio.readUInt16LE(34) !== 16 ||
    audio.toString("ascii", 36, 40) !== "data" ||
    audio.readUInt32LE(40) !== audio.length - 44 ||
    audio.length % 2
  )
    throw invalidAudio();
  let energy = 0;
  for (let i = 44; i < audio.length; i += 2)
    energy += (audio.readInt16LE(i) / 32768) ** 2;
  if (Math.sqrt(energy / ((audio.length - 44) / 2)) < 0.001)
    throw new ChatError(
      400,
      "no_speech",
      "No speech was detected. Try again closer to your microphone.",
    );
  const history = body.messages ?? [];
  if (!Array.isArray(history) || history.length > 8 || history.length % 2)
    throw new ChatError(
      400,
      "invalid_history",
      "Please start a new conversation.",
    );
  validateMessages({
    messages: [...history, { role: "user", content: "voice question" }],
  });
  return { audio, history };
}

async function boundedBytes(response, max) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error("Empty audio response");
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > max) throw new Error("Audio response too large");
      chunks.push(Buffer.from(value));
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  if (!length) throw new Error("Empty response");
  return Buffer.concat(chunks);
}

export async function transcribe(audio, { apiKey, signal, fetchImpl = fetch }) {
  const form = new FormData();
  form.set("file", new Blob([audio], { type: "audio/wav" }), "question.wav");
  form.set("model", VOICE_MODELS.transcription);
  form.set("response_format", "json");
  const response = await fetchImpl(
    "https://api.openai.com/v1/audio/transcriptions",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: AbortSignal.any([signal, AbortSignal.timeout(12000)]),
    },
  );
  if (!response.ok) throw new Error("Transcription unavailable");
  return JSON.parse((await boundedBytes(response, 64000)).toString("utf8"));
}

export async function speak(input, { apiKey, signal, fetchImpl = fetch }) {
  const response = await fetchImpl("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: VOICE_MODELS.speech,
      voice: VOICE_MODELS.voice,
      input,
      response_format: "mp3",
    }),
    signal: AbortSignal.any([signal, AbortSignal.timeout(15000)]),
  });
  if (!response.ok) throw new Error("Speech unavailable");
  return boundedBytes(response, 1500000);
}

function transcriptionCost(usage) {
  if (
    !Number.isSafeInteger(usage?.input_tokens) ||
    usage.input_tokens < 0 ||
    usage.input_tokens > 16000 ||
    !Number.isSafeInteger(usage?.output_tokens) ||
    usage.output_tokens < 0 ||
    usage.output_tokens > 2000
  )
    return TRANSCRIPTION_BOUND;
  return Math.ceil(usage.input_tokens * 2.5 + usage.output_tokens * 10);
}

export function spokenText(answer) {
  const text = answer
    .replace(/https?:\/\/\S+/g, "")
    .replace(/[*#`]/g, "")
    .trim();
  if (text.length <= 900) return text;
  const end = text.slice(0, 897).lastIndexOf(". ");
  return end > 400
    ? text.slice(0, end + 1)
    : text.slice(0, 897).trimEnd() + "…";
}

export async function generateVoice({
  audio,
  history,
  quota,
  signal,
  model,
  generate,
  transcribeAudio,
  speakAudio,
}) {
  signal.throwIfAborted();
  const reservation = await quota.reserve(VOICE_RESERVATION);
  let completed = 0,
    inFlight = 0,
    dispatched = false,
    result,
    failure;
  try {
    signal.throwIfAborted();
    inFlight = TRANSCRIPTION_BOUND;
    dispatched = true;
    const transcription = await transcribeAudio(audio, { signal });
    completed += transcriptionCost(transcription.usage);
    inFlight = 0;
    signal.throwIfAborted();
    const transcript =
      typeof transcription.text === "string" ? transcription.text.trim() : "";
    if (!transcript)
      throw new ChatError(
        400,
        "no_speech",
        "No speech was detected. Please try again.",
      );
    const messages = validateMessages({
      messages: [...history, { role: "user", content: transcript }],
    });
    const request = buildRequest(messages, model);
    request.instructions +=
      "\nThis is a spoken conversation. Answer naturally in at most 90 words, without markdown, URLs, or reading out source labels. Keep all existing factual and portfolio-only boundaries.";
    const estimate = reservationFor(request);
    if (estimate.amount > TEXT_BOUND) throw new Error("Voice context limit");
    signal.throwIfAborted();
    inFlight = estimate.amount;
    const reply = await generate(messages, signal, request);
    completed += usageCost(reply.usage, estimate);
    inFlight = 0;
    signal.throwIfAborted();
    if (typeof reply.answer !== "string" || !reply.answer.trim())
      throw new Error("Invalid reply");
    result = { transcript, answer: reply.answer, sources: sourceLinks(reply) };
    const input = spokenText(reply.answer);
    inFlight = input.length * 30;
    try {
      const audioOutput = await speakAudio(input, { signal });
      if (!audioOutput?.length) throw new Error("Empty speech");
      result.audio = Buffer.from(audioOutput).toString("base64");
      result.audioType = "audio/mpeg";
    } catch {
      signal.throwIfAborted();
      result.audioError = "Audio is unavailable. Your written answer is below.";
    }
    completed += inFlight;
    inFlight = 0;
  } catch (error) {
    failure = error;
  }
  const actual = Math.min(reservation.amount, completed + inFlight);
  try {
    await quota.settle(reservation, actual);
  } catch {
    await quota.releaseOrEnqueueRetry(reservation, {
      providerDispatched: dispatched,
      actual,
    });
  }
  if (failure) throw failure;
  signal.throwIfAborted();
  return result;
}
