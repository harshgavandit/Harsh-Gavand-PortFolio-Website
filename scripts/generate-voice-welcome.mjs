import { mkdir, writeFile } from "node:fs/promises";
import { loadConfig } from "../server/config.mjs";
import { speak } from "../server/voice.mjs";

const config = loadConfig();
if (!config.apiKey)
  throw new Error("Set OPENAI_API_KEY locally before generating the welcome.");
const input =
  "Hi, welcome to Harsh’s portfolio. I’m his AI guide. Ask me about his projects, experience, or the systems he’s built.";
const audio = await speak(input, {
  apiKey: config.apiKey,
  signal: AbortSignal.timeout(20000),
});
await mkdir(new URL("../public/voice/", import.meta.url), { recursive: true });
await writeFile(new URL("../public/voice/welcome.mp3", import.meta.url), audio);
console.log(
  `Saved public welcome clip (${audio.length} bytes). No credentials written.`,
);
