export function renderDemoOrigins(projects: { demoUrl?: string }[]) {
  const origins = new Set<string>();
  for (const { demoUrl } of projects) {
    if (!demoUrl) continue;
    try {
      const url = new URL(demoUrl);
      if (
        url.protocol === "https:" &&
        url.hostname.endsWith(".onrender.com") &&
        !url.username &&
        !url.password &&
        !url.port
      )
        origins.add(url.origin + "/");
    } catch {
      // Invalid optional demo links cannot interrupt the portfolio.
    }
  }
  return [...origins];
}

export async function warmDemoRequests(
  urls: string[],
  fetchImpl: typeof fetch = fetch,
  signal?: AbortSignal,
) {
  await Promise.all(
    urls.map(async (url) => {
      try {
        await fetchImpl(url, {
          mode: "no-cors",
          cache: "no-store",
          credentials: "omit",
          referrerPolicy: "no-referrer",
          signal,
        });
      } catch {
        // A sleeping or unavailable demo never blocks the portfolio UI.
      }
    }),
  );
}
