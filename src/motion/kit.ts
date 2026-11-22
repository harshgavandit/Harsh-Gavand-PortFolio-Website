/*
 * GSAP, ScrollTrigger and Lenis are loaded on demand after hydration so the
 * pre-rendered page paints without waiting for animation code.
 */
type Gsap = typeof import("gsap").gsap;
type ScrollTriggerType = typeof import("gsap/ScrollTrigger").ScrollTrigger;
type LenisType = import("lenis").default;

export type MotionKit = {
  gsap: Gsap;
  ScrollTrigger: ScrollTriggerType;
  startSmoothScroll: () => () => void;
  startScrollScenes: () => () => void;
  startPointerEffects: () => () => void;
};

let kitPromise: Promise<MotionKit> | undefined;
let lenis: LenisType | null = null;

export function getLenis() {
  return lenis;
}

export function loadMotionKit() {
  kitPromise ??= Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("lenis"),
  ]).then(([{ gsap }, { ScrollTrigger }, { default: Lenis }]) => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out" });
    return createKit(gsap, ScrollTrigger, Lenis);
  });
  return kitPromise;
}

const REVEAL_START = "top 90%";

function createKit(
  gsap: Gsap,
  ScrollTrigger: ScrollTriggerType,
  Lenis: typeof import("lenis").default,
): MotionKit {
  function startSmoothScroll() {
    const instance = new Lenis({
      lerp: 0.11,
      wheelMultiplier: 0.95,
      anchors: { offset: -96 },
      allowNestedScroll: true,
      prevent: (node: HTMLElement) =>
        !!node.closest?.(
          "dialog, #mobile-navigation, .archive-table-scroll, [data-lenis-prevent]",
        ),
    });
    lenis = instance;
    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    // Pause smooth scrolling while a modal or the mobile menu locks the page.
    const observer = new MutationObserver(() => {
      if (document.body.style.overflow === "hidden") instance.stop();
      else instance.start();
    });
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });
    return () => {
      observer.disconnect();
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }

  function startScrollScenes() {
    const context = gsap.context(() => {
      const viewport = window.innerHeight;
      // Content inside collapsed disclosures is revealed by the disclosure
      // itself, so it is never hidden by scroll choreography.
      const belowFold = (element: Element) =>
        !element.closest("details:not([open])") &&
        element.getBoundingClientRect().top > viewport * 0.92;

      // Single elements fade and rise into place.
      for (const element of gsap.utils.toArray<HTMLElement>("[data-reveal]")) {
        if (!belowFold(element)) continue;
        const distance = Number(element.dataset.reveal) || 32;
        gsap.set(element, { opacity: 0, y: distance });
        ScrollTrigger.create({
          trigger: element,
          start: REVEAL_START,
          once: true,
          onEnter: () =>
            gsap.to(element, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              clearProps: "transform,opacity",
            }),
        });
      }

      // Groups reveal their direct children with a stagger.
      for (const group of gsap.utils.toArray<HTMLElement>(
        "[data-reveal-group]",
      )) {
        const children = [...group.children].filter(belowFold);
        if (!children.length) continue;
        gsap.set(children, { opacity: 0, y: 24 });
        ScrollTrigger.batch(children, {
          start: REVEAL_START,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.75,
              stagger: 0.07,
              clearProps: "transform,opacity",
            }),
        });
      }

      // Gentle depth on decorative layers.
      for (const element of gsap.utils.toArray<HTMLElement>(
        "[data-parallax]",
      )) {
        const depth = Number(element.dataset.parallax) || 0.12;
        gsap.fromTo(
          element,
          { yPercent: -depth * 50 },
          {
            yPercent: depth * 50,
            ease: "none",
            scrollTrigger: {
              trigger: element.parentElement || element,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      // Experience timeline: the rail fills as the reader moves through roles
      // and each milestone lights up when it reaches the reading line.
      const timeline = document.querySelector<HTMLElement>(".timeline");
      const rail = timeline?.querySelector<HTMLElement>(".timeline-progress");
      if (timeline && rail) {
        gsap.fromTo(
          rail,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: timeline,
              start: "top 65%",
              end: "bottom 65%",
              scrub: 0.4,
            },
          },
        );
        for (const node of timeline.querySelectorAll<HTMLElement>(
          ".timeline-item",
        ))
          ScrollTrigger.create({
            trigger: node,
            start: "top 65%",
            end: "bottom 65%",
            toggleClass: "is-current",
          });
      }

      // Hero copy drifts up (parallax) as the scene scrolls out; it never fades,
      // so its text keeps full contrast.
      const heroCopy = document.querySelector<HTMLElement>(".hero-copy");
      if (heroCopy)
        gsap.to(heroCopy, {
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });

      // Reading progress in the header.
      const progress = document.querySelector<HTMLElement>(".scroll-progress");
      if (progress)
        gsap.fromTo(
          progress,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              start: 0,
              end: "max",
              scrub: 0.2,
            },
          },
        );
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    // Opening a disclosure changes the page height below it.
    const toggled = (event: Event) => {
      if (event.target instanceof HTMLDetailsElement) refresh();
    };
    document.addEventListener("toggle", toggled, true);
    void document.fonts?.ready.then(refresh);
    // Printing or "find in page" must never meet hidden content.
    const revealAll = () =>
      gsap.set("[data-reveal], [data-reveal-group] > *", {
        opacity: 1,
        y: 0,
      });
    window.addEventListener("beforeprint", revealAll);
    return () => {
      window.removeEventListener("load", refresh);
      window.removeEventListener("beforeprint", revealAll);
      document.removeEventListener("toggle", toggled, true);
      context.revert();
    };
  }

  function startPointerEffects() {
    const root = document.documentElement;
    root.classList.add("has-cursor");
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    ring.setAttribute("aria-hidden", "true");
    ring.dataset.state = "hidden";
    const label = document.createElement("span");
    ring.append(label);
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    dot.style.opacity = "0";
    document.body.append(ring, dot);
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "none" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "none" });

    const MAGNETIC = "[data-magnetic], .button, .header-resume, .header-ask";
    const INTERACTIVE = "a, button, summary, [role='tab'], input, textarea";
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;

    const release = (element: HTMLElement | null) => {
      if (!element) return;
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.45)",
      });
    };
    const releaseTilt = (element: HTMLElement | null) => {
      if (!element) return;
      gsap.to(element, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.8,
        ease: "power3.out",
      });
      element.style.removeProperty("--glare-opacity");
    };

    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      dot.style.opacity = "1";
      ringX(event.clientX);
      ringY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);
      const target = event.target instanceof Element ? event.target : null;

      const nextMagnet =
        (target?.closest(MAGNETIC) as HTMLElement | null) || null;
      if (nextMagnet !== magnet) {
        release(magnet);
        magnet = nextMagnet;
      }
      if (magnet) {
        const box = magnet.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        gsap.to(magnet, {
          x: dx * 0.22,
          y: dy * 0.32,
          duration: 0.4,
          ease: "power3.out",
        });
      }

      const nextTilt =
        (target?.closest("[data-tilt]") as HTMLElement | null) || null;
      if (nextTilt !== tilt) {
        releaseTilt(tilt);
        tilt = nextTilt;
      }
      if (tilt) {
        const box = tilt.getBoundingClientRect();
        const px = (event.clientX - box.left) / box.width;
        const py = (event.clientY - box.top) / box.height;
        const strength = Number(tilt.dataset.tilt) || 6;
        gsap.to(tilt, {
          rotateY: (px - 0.5) * strength,
          rotateX: (0.5 - py) * strength,
          transformPerspective: 1100,
          duration: 0.5,
          ease: "power2.out",
        });
        tilt.style.setProperty("--glare-x", `${(px * 100).toFixed(1)}%`);
        tilt.style.setProperty("--glare-y", `${(py * 100).toFixed(1)}%`);
        tilt.style.setProperty("--glare-opacity", "1");
      }

      const cursorTarget = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest(INTERACTIVE);
      ring.dataset.state = cursorTarget ? "label" : interactive ? "hover" : "";
      label.textContent = cursorTarget?.dataset.cursor || "";
    };
    const leave = () => {
      ring.dataset.state = "hidden";
      dot.style.opacity = "0";
      release(magnet);
      releaseTilt(tilt);
      magnet = tilt = null;
    };
    const down = () => ring.classList.add("is-pressed");
    const up = () => ring.classList.remove("is-pressed");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      release(magnet);
      releaseTilt(tilt);
      ring.remove();
      dot.remove();
      root.classList.remove("has-cursor");
    };
  }

  return {
    gsap,
    ScrollTrigger,
    startSmoothScroll,
    startScrollScenes,
    startPointerEffects,
  };
}
