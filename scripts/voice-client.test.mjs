import assert from "node:assert/strict";
import { test } from "node:test";
import {
  encodeVoiceWav,
  voiceHistory,
  startVoiceCapture,
} from "../src/lib/voiceAudio.ts";
import { voiceDestination } from "../src/lib/voiceNavigation.ts";

test("capture encodes actual duration as mono 16k PCM, clipping values and rejecting silence", () => {
  const samples = Float32Array.from(
    { length: 48000 },
    (_, i) => Math.sin(i / 10) * 1.5,
  );
  const bytes = Buffer.from(encodeVoiceWav(samples, 48000));
  assert.equal(bytes.length, 32044);
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
  assert.equal(bytes.readUInt32LE(24), 16000);
  assert.equal(bytes.readUInt16LE(22), 1);
  assert.equal(bytes.readUInt32LE(40), 32000);
  assert.throws(
    () => encodeVoiceWav(new Float32Array(16000), 16000),
    /speech/i,
  );
  assert.throws(() => encodeVoiceWav(samples, 0), /audio/i);
});
test("voice context preserves complete pairs and leaves room for the recorded question", () => {
  const history = Array.from({ length: 12 }, (_, i) => ({
    role: i % 2 ? "assistant" : "user",
    content: "x".repeat(2000),
  }));
  const bounded = voiceHistory([
    ...history,
    { role: "user", content: "unfinished" },
  ]);
  assert.equal(bounded.length % 2, 0);
  assert.equal(bounded[0].role, "user");
  assert.ok(bounded.reduce((n, m) => n + m.content.length, 0) <= 8000);
});
test("voice navigation only offers known destinations for explicit navigation requests", () => {
  assert.equal(voiceDestination("Tell me about Agri Samaj"), undefined);
  assert.equal(voiceDestination("Open https://evil.example"), undefined);
  assert.equal(
    voiceDestination("Show me Agri Samaj").href,
    "/work/agri-samaj-community-platform/",
  );
  assert.equal(
    voiceDestination("Take me to his experience").href,
    "/#experience",
  );
});

function mediaFixture(t, options = {}) {
  const originals = new Map(
    ["navigator", "MediaRecorder", "AudioContext"].map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  const state = { stopped: 0, started: 0, closed: 0, decoded: 0 };
  const stream = {
    getTracks: () => [
      {
        stop: () => {
          state.stopped++;
        },
      },
    ],
  };
  class Recorder {
    state = "inactive";
    mimeType = "audio/webm";
    start() {
      if (options.startError) throw new Error("recorder unavailable");
      state.started++;
      this.state = "recording";
    }
    stop() {
      this.state = "inactive";
      queueMicrotask(() => {
        this.ondataavailable?.({ data: new Blob(["test"]) });
        this.onstop?.();
      });
    }
  }
  class Context {
    async decodeAudioData() {
      state.decoded++;
      options.onDecode?.();
      return {
        length: 16000,
        numberOfChannels: 1,
        sampleRate: 16000,
        getChannelData: () =>
          Float32Array.from(
            { length: 16000 },
            (_, i) => Math.sin(i / 12) * 0.2,
          ),
      };
    }
    async close() {
      state.closed++;
    }
  }
  Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: {
      mediaDevices: {
        getUserMedia: options.getUserMedia || (async () => stream),
      },
    },
  });
  Object.defineProperty(globalThis, "MediaRecorder", {
    configurable: true,
    value: Recorder,
  });
  Object.defineProperty(globalThis, "AudioContext", {
    configurable: true,
    value: Context,
  });
  t.after(() => {
    for (const [key, descriptor] of originals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  return { state, stream };
}

test("finishing capture releases microphone tracks and closes its decoder before returning WAV", async (t) => {
  const { state } = mediaFixture(t);
  const controller = new AbortController();
  const capture = await startVoiceCapture(controller.signal);
  const audio = Buffer.from(await capture.finish(), "base64");
  assert.equal(audio.toString("ascii", 0, 4), "RIFF");
  assert.ok(state.stopped >= 1);
  assert.equal(state.closed, 1);
  assert.equal(state.decoded, 1);
  await assert.rejects(capture.finish(), /already finished/);
});

test("cancelled permission cannot start a late microphone recording", async (t) => {
  let allow;
  const pending = new Promise((resolve) => {
    allow = resolve;
  });
  const { state, stream } = mediaFixture(t, { getUserMedia: () => pending });
  const controller = new AbortController();
  const capture = startVoiceCapture(controller.signal);
  controller.abort();
  allow(stream);
  await assert.rejects(capture, { name: "AbortError" });
  assert.equal(state.started, 0);
  assert.ok(state.stopped > 0);
});

test("recording failure and cancellation during decode both release audio resources", async (t) => {
  await t.test("start failure", async (child) => {
    const { state } = mediaFixture(child, { startError: true });
    await assert.rejects(
      startVoiceCapture(new AbortController().signal),
      /recorder unavailable/,
    );
    assert.ok(state.stopped > 0);
  });
  await t.test("decode cancellation", async (child) => {
    const controller = new AbortController();
    const { state } = mediaFixture(child, {
      onDecode: () => controller.abort(),
    });
    const capture = await startVoiceCapture(controller.signal);
    await assert.rejects(capture.finish(), { name: "AbortError" });
    assert.ok(state.stopped > 0);
    assert.equal(state.closed, 1);
  });
});

test("voice navigation distinguishes AgriConnect from the Agri Samaj platform", () => {
  for (const name of ["AgriConnect", "Agri-Connect", "Agri Connect"]) {
    assert.deepEqual(voiceDestination("Open " + name), {
      label: "Open AgriConnect",
      href: "/work/agri-connect/",
    });
  }
  assert.equal(
    voiceDestination("Open Agri Samaj").href,
    "/work/agri-samaj-community-platform/",
  );
  assert.equal(voiceDestination("Tell me about AgriConnect"), undefined);
});
