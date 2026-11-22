import { lazy, Suspense, useEffect, useState, type ComponentType } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { semanticFragment } from "./lib/projectNavigation";
import { pageSeo } from "./lib/seo";
import { notes } from "./data/notes";
import { profile } from "./data/portfolio";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { FeaturedWork } from "./components/Work";
import { About, Experience, Skills } from "./components/Profile";
import { MotionPreferencesProvider } from "./components/MotionPreferences";
import { Contact, Footer } from "./components/Contact";
import { AssistantEntry } from "./components/AssistantEntry";
import { DemoWarmup } from "./components/DemoWarmup";
import { MotionProvider } from "./motion/MotionProvider";
import { MotionRuntime } from "./motion/MotionRuntime";
import { AmbientField } from "./motion/AmbientField";
const Telemetry = lazy(() => import("./components/Telemetry"));
const LazyWork = lazy(() =>
  import("./components/WorkDetail").then((module) => ({
    default: module.WorkDetail,
  })),
);
const LazyArchive = lazy(() =>
  import("./components/ProjectArchive").then((module) => ({
    default: module.ProjectArchive,
  })),
);
const LazyNotes = lazy(() =>
  import("./components/Notes").then((module) => ({
    default: module.NotesIndex,
  })),
);
const LazyNote = lazy(() =>
  import("./components/Notes").then((module) => ({
    default: module.NoteArticle,
  })),
);
const LazyAI = lazy(() =>
  import("./components/AIWorkspace").then((module) => ({
    default: module.AIWorkspace,
  })),
);
export type PageComponents = {
  Work: ComponentType;
  Archive: ComponentType;
  AI: ComponentType;
  Notes?: ComponentType;
  Note?: ComponentType;
};

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
  pages,
}: {
  year?: number;
  pages?: PageComponents;
}) {
  const Work = pages?.Work || LazyWork;
  const Archive = pages?.Archive || LazyArchive;
  const AI = pages?.AI || LazyAI;
  const Notes = pages?.Notes || LazyNotes;
  const Note = pages?.Note || LazyNote;
  const { pathname, hash } = useLocation();
  // Analytics and Speed Insights load after the page is interactive.
  const [telemetry, setTelemetry] = useState(false);
  useEffect(() => {
    const start = () => setTelemetry(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(start, 2000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    // Keep head metadata identical to the pre-rendered values after
    // client-side navigation (see src/lib/seo.ts).
    const seo = pageSeo(pathname);
    document.title = seo.title;
    const setMeta = (selector: string, value: string) =>
      document.querySelector(selector)?.setAttribute("content", value);
    const canonical = seo.path ? profile.site + seo.path : null;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical && !link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.append(link);
    }
    if (canonical) link!.href = canonical;
    else link?.remove();
    if (canonical) setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[property="og:title"]', seo.title);
    setMeta('meta[name="twitter:title"]', seo.title);
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ])
      setMeta(selector, seo.description);
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.append(robots);
    }
    robots.content = seo.robots;
  }, [pathname]);
  useEffect(() => {
    const fragment = semanticFragment(hash);
    if (!fragment) return;
    if (fragment !== hash)
      window.history.replaceState(
        window.history.state,
        "",
        pathname + window.location.search + fragment,
      );
    const target = document.getElementById(fragment.slice(1));
    // Reveal native disclosures before scrolling to a previously shared link.
    for (
      let parent = target?.parentElement;
      parent;
      parent = parent.parentElement
    )
      if (parent instanceof HTMLDetailsElement) parent.open = true;
    target?.scrollIntoView();
  }, [pathname, hash]);
  return (
    <MotionPreferencesProvider>
      <MotionProvider>
        <MotionRuntime />
        <AmbientField />
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Navigation />
        <DemoWarmup />
        <Suspense
          fallback={
            <main
              id="main"
              className="section-container route-loading"
              role="status"
            >
              Opening the page…
            </main>
          }
        >
          <Routes>
            <Route
              path="/"
              element={
                <main id="main" tabIndex={-1}>
                  <Hero />
                  <Experience />
                  <FeaturedWork />
                  <Skills />
                  <About />
                  <Contact />
                </main>
              }
            />
            <Route path="/archive" element={<Archive />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/work/:slug" element={<Work />} />
            {notes.length > 0 && (
              <>
                <Route path="/notes" element={<Notes />} />
                <Route path="/notes/:slug" element={<Note />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer year={year} />
        <AssistantEntry />
        {telemetry && (
          <Suspense fallback={null}>
            <Telemetry pathname={pathname} />
          </Suspense>
        )}
      </MotionProvider>
    </MotionPreferencesProvider>
  );
}
