import { lazy, Suspense, useEffect, type ComponentType } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { semanticFragment, workPage, workPath } from "./lib/projectNavigation";
import { profile } from "./data/portfolio";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { FeaturedWork } from "./components/Work";
import { Experience, Skills } from "./components/Profile";
import { MotionPreferencesProvider } from "./components/MotionPreferences";
import { Contact, Footer } from "./components/Contact";
import { AssistantEntry } from "./components/AssistantEntry";
import { DemoWarmup } from "./components/DemoWarmup";
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
const LazyAI = lazy(() =>
  import("./components/AIWorkspace").then((module) => ({
    default: module.AIWorkspace,
  })),
);
export type PageComponents = {
  Work: ComponentType;
  Archive: ComponentType;
  AI: ComponentType;
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
  const { pathname, hash } = useLocation();
  useEffect(() => {
    const slug = pathname.match(/^\/work\/([^/]+)\/?$/)?.[1];
    const page = workPage(slug);
    const ai = pathname.replace(/\/$/, "") === "/ai";
    const known =
      pathname === "/" ||
      pathname.replace(/\/$/, "") === "/archive" ||
      ai ||
      !!page;
    const title = ai
      ? "AI Workspace | Harsh Gavand"
      : page
        ? `${page.study.shortName} | Harsh Gavand`
        : pathname.replace(/\/$/, "") === "/archive"
          ? "Project Archive | Harsh Gavand — Full-Stack & AI Engineer"
          : known
            ? "Harsh Gavand | Full-Stack & AI Engineer"
            : "Page not found | Harsh Gavand";
    document.title = title;
    const canonical =
      profile.site +
      (ai
        ? "/ai/"
        : page
          ? workPath(page.project.slug)
          : pathname.replace(/\/$/, "") === "/archive"
            ? "/archive/"
            : "/");
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", canonical);
    document
      .querySelector('meta[property="og:url"]')
      ?.setAttribute("content", canonical);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", title);
    document
      .querySelector('meta[name="twitter:title"]')
      ?.setAttribute("content", title);
    const description =
      (ai
        ? "Explore a source-grounded technical guide, evidence-based role comparison, and live AI support-ticket triage by Harsh Gavand."
        : page?.study.summary) ||
      "Harsh Gavand — Full-Stack & AI Engineer in Mumbai. Explore MERN, Python, SaaS, and AI projects with implementation details, live demos, and source code.";
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ])
      document.querySelector(selector)?.setAttribute("content", description);
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!known && !robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.append(robots);
    }
    if (!known && robots) robots.content = "noindex, follow";
    if (known && robots) robots.remove();
  }, [pathname]);
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
                <FeaturedWork />
                <Experience />
                <Skills />
                <Contact />
              </main>
            }
          />
          <Route path="/archive" element={<Archive />} />
          <Route path="/ai" element={<AI />} />
          <Route path="/work/:slug" element={<Work />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Footer year={year} />
      <AssistantEntry />
      <Analytics
        mode={import.meta.env.DEV ? "development" : "production"}
        route={pathname}
        path={pathname}
      />
      <SpeedInsights route={pathname} />
    </MotionPreferencesProvider>
  );
}
