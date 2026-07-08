import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";
import { Toaster } from "@/components/ui/toaster";

function App() {
  useEffect(() => {
    let frame;
    let lenis;

    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.2, smoothWheel: true });

      function raf(time) {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      }

      frame = requestAnimationFrame(raf);
    });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (lenis) lenis.destroy();
    };
  }, []);

  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
