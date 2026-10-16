export type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
  sources?: { label: string; href: string }[];
  evidence?: import("./aiWorkspace").CodeEvidence[];
};

export function voiceHistory(messages: ConversationMessage[]) {
  const complete =
    messages.at(-1)?.role === "user" ? messages.slice(0, -1) : messages;
  let history = complete
    .slice(-8)
    .map(({ role, content }) => ({ role, content: content.slice(0, 2000) }));
  while (history.reduce((n, m) => n + m.content.length, 0) > 8000)
    history = history.slice(2);
  return history;
}

export function encodeVoiceWav(
  samples: Float32Array,
  rate: number,
): ArrayBuffer {
  if (!Number.isFinite(rate) || rate < 8000 || !samples.length)
    throw new Error("Invalid audio recording.");
  const length = Math.min(320000, Math.floor((samples.length * 16000) / rate));
  if (length < 1600) throw new Error("Record a slightly longer question.");
  const buffer = new ArrayBuffer(44 + length * 2);
  const view = new DataView(buffer);
  const text = (offset: number, value: string) => {
    for (let i = 0; i < value.length; i++)
      view.setUint8(offset + i, value.charCodeAt(i));
  };
  text(0, "RIFF");
  view.setUint32(4, buffer.byteLength - 8, true);
  text(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 16000, true);
  view.setUint32(28, 32000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, length * 2, true);
  let energy = 0;
  for (let i = 0; i < length; i++) {
    const start = Math.floor((i * rate) / 16000);
    const end = Math.min(
      samples.length,
      Math.max(start + 1, Math.floor(((i + 1) * rate) / 16000)),
    );
    let sum = 0;
    for (let j = start; j < end; j++)
      sum += Number.isFinite(samples[j]) ? samples[j] : 0;
    const value = Math.max(-1, Math.min(1, sum / (end - start)));
    energy += value * value;
    view.setInt16(
      44 + i * 2,
      Math.round(value * (value < 0 ? 32768 : 32767)),
      true,
    );
  }
  if (Math.sqrt(energy / length) < 0.001)
    throw new Error("No speech detected. Try again closer to your microphone.");
  return buffer;
}

export type VoiceCapture = {
  finish: () => Promise<string>;
  cancel: () => void;
};

export async function startVoiceCapture(
  signal: AbortSignal,
): Promise<VoiceCapture> {
  if (
    !navigator.mediaDevices?.getUserMedia ||
    typeof MediaRecorder === "undefined" ||
    typeof AudioContext === "undefined"
  )
    throw new Error(
      "Voice recording is unavailable in this browser. You can still use text chat.",
    );
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
    video: false,
  });
  const stopTracks = () => stream.getTracks().forEach((track) => track.stop());
  if (signal.aborted) {
    stopTracks();
    signal.throwIfAborted();
  }
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream);
  } catch (error) {
    stopTracks();
    throw error;
  }
  const chunks: Blob[] = [];
  let bytes = 0;
  let recordingError: Error | undefined;
  recorder.ondataavailable = (event) => {
    bytes += event.data.size;
    if (bytes > 4000000) {
      recordingError = new Error(
        "Recording is too large. Please try a shorter question.",
      );
      cancel();
    } else if (event.data.size) chunks.push(event.data);
  };
  recorder.onerror = () => {
    recordingError = new Error(
      "Microphone recording failed. Please try again.",
    );
    cancel();
  };
  const cancel = () => {
    if (recorder.state !== "inactive") recorder.stop();
    stopTracks();
  };
  signal.addEventListener("abort", cancel, { once: true });
  try {
    recorder.start(250);
  } catch (error) {
    signal.removeEventListener("abort", cancel);
    stopTracks();
    throw error;
  }
  let finished = false;
  return {
    cancel,
    finish: async () => {
      if (finished) throw new Error("Recording already finished.");
      finished = true;
      try {
        if (recorder.state !== "inactive")
          await new Promise<void>((resolve) => {
            recorder.onstop = () => resolve();
            recorder.stop();
          });
        stopTracks();
        signal.throwIfAborted();
        if (recordingError) throw recordingError;
        const context = new AudioContext();
        try {
          const decoded = await context.decodeAudioData(
            await new Blob(chunks, { type: recorder.mimeType }).arrayBuffer(),
          );
          signal.throwIfAborted();
          const samples = new Float32Array(decoded.length);
          for (let channel = 0; channel < decoded.numberOfChannels; channel++) {
            const data = decoded.getChannelData(channel);
            for (let i = 0; i < samples.length; i++)
              samples[i] += data[i] / decoded.numberOfChannels;
          }
          const bytes = new Uint8Array(
            encodeVoiceWav(samples, decoded.sampleRate),
          );
          let binary = "";
          for (let i = 0; i < bytes.length; i += 8192)
            binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
          return btoa(binary);
        } finally {
          await context.close();
        }
      } finally {
        stopTracks();
        signal.removeEventListener("abort", cancel);
      }
    },
  };
}
