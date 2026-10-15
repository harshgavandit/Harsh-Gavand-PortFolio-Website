import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { semanticFragment } from "./lib/projectNavigation";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { FeaturedWork } from "./components/Work";
import { Experience, Skills } from "./components/Profile";
import { MotionPreferencesProvider } from "./components/MotionPreferences";
import { Contact, Footer } from "./components/Contact";
import { Assistant } from "./components/Assistant";
import { ProjectArchive } from "./components/ProjectArchive";
import { DemoWarmup } from "./components/DemoWarmup";

function NotFound() {
  return (
    <main id="main" className="not-found section-container" tabIndex={-1}>
      <span className="eyebrow">404 / Page not found</span>
      <h1>
        This page hasn’t
        <br />
        been built.
      </h1>
      <p>The projects you’re looking for are back on the homepage.</p>
      <a className="button button-primary" href="/">
        Back to the portfolio ↗
      </a>
    </main>
  );
}
export default function Portfolio({
  year = new Date().getFullYear(),
}: {
  year?: number;
}) {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const fragment = semanticFragment(hash);
    if (fragment === hash) return;
    window.history.replaceState(
      window.history.state,
      "",
      pathname + window.location.search + fragment,
    );
    document.getElementById(fragment.slice(1))?.scrollIntoView();
  }, [pathname, hash]);
  return (
    <MotionPreferencesProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <DemoWarmup />
      <Routes>
        <Route
          path="/"
          element={
            <main id="main" tabIndex={-1}>
              <Hero />
              <FeaturedWork />
              <Experience />
              <Skills />
              <Contact />
            </main>
          }
        />
        <Route path="/archive" element={<ProjectArchive />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer year={year} />
      <Assistant />
      <Analytics
        mode={import.meta.env.DEV ? "development" : "production"}
        route={pathname}
        path={pathname}
      />
      <SpeedInsights route={pathname} />
    </MotionPreferencesProvider>
  );
}
