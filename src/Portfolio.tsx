import { LazyMotion, MotionConfig, domAnimation } from "framer-motion";
import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { FeaturedWork, MoreWork } from "./components/Work";
import { About, Experience, Skills, Workflow } from "./components/Profile";
import { Contact, Footer } from "./components/Contact";

function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navigation />
      <main id="main" tabIndex={-1}>
        <Hero />
        <FeaturedWork />
        <About />
        <Experience />
        <MoreWork />
        <Skills />
        <Workflow />
        <Contact />
      </main>
      <Footer />
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

export default function Portfolio() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MotionConfig>
    </LazyMotion>
  );
}
