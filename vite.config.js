import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";
import { fileURLToPath } from "url";
import { runtimeDigest } from "./scripts/ai-runtime-digest.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  define: { __AI_RUNTIME_DIGEST__: JSON.stringify(await runtimeDigest()) },
  plugins: [react()],
  server: {
    proxy: { "/api": "http://127.0.0.1:3001" },
    watch: { ignored: ["**/tmp/**", "**/verification/**"] },
  },
  preview: { proxy: { "/api": "http://127.0.0.1:3001" } },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
