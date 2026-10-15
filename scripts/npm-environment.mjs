// Legacy pnpm/hosting cache aliases are not npm configuration options.
// Sanitize only the subprocess; leave the machine and deployment environment intact.
export function npmEnvironment(source) {
  const env = { ...source };
  const explicitCache = Object.keys(env).some((key) =>
    /^npm_config_cache$/i.test(key),
  );
  let legacyCache;
  for (const key of Object.keys(env)) {
    if (/^npm_config_cache[-_]dir$/i.test(key)) {
      legacyCache ??= env[key];
      delete env[key];
    } else if (/^npm_config_store[-_]dir$/i.test(key)) delete env[key];
  }
  if (!explicitCache && legacyCache) env.npm_config_cache = legacyCache;
  return env;
}
