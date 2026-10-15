import { Route, Routes } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { FeaturedWork } from "./components/Work";
import { Experience, Skills } from "./components/Profile";
import { MotionPreferencesProvider } from "./components/MotionPreferences";
import { Contact, Footer } from "./components/Contact";
import { Assistant } from "./components/Assistant";
import { ProjectArchive } from "./components/ProjectArchive";

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
  return (
    <MotionPreferencesProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
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
    </MotionPreferencesProvider>
  );
}
