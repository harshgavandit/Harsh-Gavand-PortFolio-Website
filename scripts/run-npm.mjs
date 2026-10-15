import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { npmEnvironment } from "./npm-environment.mjs";

const args = process.argv.slice(2);
if (!args.length)
  throw new Error("Provide npm arguments, such as ci or run build.");
const root = fileURLToPath(new URL("../", import.meta.url));
const env = npmEnvironment(process.env);
const bundledCli = [
  resolve(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js"),
  resolve(dirname(process.execPath), "../node_modules/npm/bin/npm-cli.js"),
].find((path) => existsSync(path));
// Windows npm.cmd requires a shell. Invoke the bundled JS CLI directly instead,
// keeping every argument literal. Unix npm executables can be spawned normally.
if (process.platform === "win32" && !bundledCli)
  throw new Error(
    "Run this command with a Node installation that includes npm.",
  );
const child = spawnSync(
  bundledCli ? process.execPath : "npm",
  bundledCli ? [bundledCli, ...args] : args,
  {
    cwd: root,
    env,
    stdio: "inherit",
    windowsHide: true,
  },
);
if (child.error) throw child.error;
process.exit(child.status ?? 1);
