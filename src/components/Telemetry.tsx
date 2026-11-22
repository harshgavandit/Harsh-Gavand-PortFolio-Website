import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Loaded after hydration and browser idle so measurement code never competes
// with the first render (see Portfolio.tsx).
export default function Telemetry({ pathname }: { pathname: string }) {
  return (
    <>
      <Analytics
        mode={import.meta.env.DEV ? "development" : "production"}
        route={pathname}
        path={pathname}
      />
      <SpeedInsights route={pathname} />
    </>
  );
}
