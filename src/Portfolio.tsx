import { LazyMotion, domAnimation } from "framer-motion";
import { Route, Routes, Link } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { FeaturedWork, MoreWork } from "./components/Work";
import { About, Experience, Skills } from "./components/Profile";
import { Workflow } from "./components/Workflow";
import { MotionPreferencesProvider } from "./components/MotionPreferences";
import { Contact, Footer } from "./components/Contact";
import { Assistant } from "./components/Assistant";
import { EngineeringBridge } from "./components/EngineeringBridge";
import { PortfolioIntelligence } from "./components/PortfolioIntelligence";
import { SpatialAtmosphere } from "./components/SpatialAtmosphere";

function Home({ year }: { year: number }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SpatialAtmosphere />
      <Navigation />
      <main id="main" tabIndex={-1}>
        <Hero />
        <FeaturedWork />
        <Experience />
        <Skills />
        <About />
        <MoreWork />
        <Workflow />
        <details className="engineering-notes section-container">
          <summary>
            One mindset, every layer <span>Explore the product layers</span>
          </summary>
          <EngineeringBridge />
        </details>
        <PortfolioIntelligence />
        <Contact />
      </main>
      <Footer year={year} />
      <Assistant />
    </>
  );
}

function NotFound() {
  return (
    <main className="not-found section-container">
      <span className="eyebrow">404 / A little off the path</span>
      <h1>
        This page hasn’t
        <br />
        been built.
      </h1>
      <p>The projects you’re looking for are back on the homepage.</p>
      <Link className="button button-primary" to="/">
        Back to the portfolio ↗
      </Link>
    </main>
  );
}

export default function Portfolio({
  year = new Date().getFullYear(),
}: {
  year?: number;
}) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionPreferencesProvider>
        <Routes>
          <Route path="/" element={<Home year={year} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MotionPreferencesProvider>
    </LazyMotion>
  );
}
