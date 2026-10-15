import assert from "node:assert/strict";
import { test } from "node:test";
import { npmEnvironment } from "./npm-environment.mjs";

test("hosting cache alias becomes supported npm cache configuration without changing the source environment", () => {
  const original = {
    "npm_config_cache-dir": "/build/cache",
    NPM_CONFIG_STORE_DIR: "/pnpm/store",
    NODE_ENV: "production",
  };
  assert.deepEqual(npmEnvironment(original), {
    NODE_ENV: "production",
    npm_config_cache: "/build/cache",
  });
  assert.equal(original["npm_config_cache-dir"], "/build/cache");
  assert.equal(original.NPM_CONFIG_STORE_DIR, "/pnpm/store");
});
test("explicit supported npm cache takes precedence over legacy aliases", () => {
  assert.deepEqual(
    npmEnvironment({
      NPM_CONFIG_CACHE: "/explicit",
      npm_config_cache_dir: "/legacy",
      npm_config_store_dir: "/store",
    }),
    { NPM_CONFIG_CACHE: "/explicit" },
  );
});
test("unrelated build and registry settings survive sanitization", () => {
  const original = {
    PATH: "/node/bin",
    NPM_CONFIG_REGISTRY: "https://registry.npmjs.org",
    CI: "1",
    SYNTHETIC_SERVER_SETTING: "preserved",
  };
  assert.deepEqual(npmEnvironment(original), original);
});
