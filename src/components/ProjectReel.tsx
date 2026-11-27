import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects, type CaseStudy } from "../data/portfolio";
import { curatedArchive } from "../data/recruiter";
import type { PrivateProject } from "../data/privateProjects";
import { displayProject, displayStudy } from "../data/informaPresentation";
import { projectImage } from "../data/projectCaptures";
import { useMotionEnabled } from "./MotionPreferences";
import { getLenis, loadMotionKit } from "../motion/kit";

const AI =
  /OpenAI|LangChain|LangGraph|Google ADK|RAG|LLM|TensorFlow|MCP|Claude|Anthropic|Whisper/i;

/*
 * Featured reel: the real application captures on a 3D cylinder. On desktop
 * the reel pins and scrolling turns it one project at a time; everywhere else
 * (phones, reduced motion, no JavaScript) it is a plain horizontal snap row.
 * Every card is ordinary HTML with real links, so the reel is fully keyboard
 * and screen-reader accessible: focusing a card turns the reel to it.
 */
type ReelItem = {
  slug: string;
  title: string;
  kind: string;
  summary: string;
  image: ReturnType<typeof projectImage>;
  live?: string;
  github?: string;
  details: string;
  detailsLabel: string;
  stack: string;
  technologies: string[];
  year?: string;
  imageHref?: string;
  note?: string;
};

export function ProjectReel({
  studies,
  privateWork = [],
}: {
  studies: CaseStudy[];
  privateWork?: PrivateProject[];
}) {
  const motion = useMotionEnabled();
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [enhanced, setEnhanced] = useState(false);
  const jump = useRef<(index: number) => void>(() => {});

  const featured: ReelItem[] = studies.map((record) => {
    const study = displayStudy(record);
    const project = displayProject(
      projects.find((item) => item.id === study.projectId)!,
    );
    const ai = project.technologies.some((item) => AI.test(item));
    return {
      slug: project.slug,
      title: study.shortName.split(" — ")[0],
      kind: ai ? "Applied AI" : "Full-stack product",
      summary: study.summary.split(/(?<=\.)\s/)[0],
      image: projectImage(project.slug),
      live: project.demoUrl,
      github: project.githubUrl,
      details: `/work/${project.slug}/`,
      detailsLabel: "Case study",
      imageHref: `/work/${project.slug}/`,
      stack: project.technologies.slice(0, 3).join(" · "),
      technologies: project.technologies,
    };
  });
  // Repositories from the curated archive join the reel with a generated
  // cover (they have no deployed capture) and link to source and catalog.
  const repositories: ReelItem[] = curatedArchive
    .filter(
      (entry) => !studies.some((study) => study.projectId === entry.projectId),
    )
    .map((entry) => {
      const project = projects.find((item) => item.id === entry.projectId)!;
      const ai = project.technologies.some((item) => AI.test(item));
      return {
        slug: project.slug,
        title: project.title.split(" — ")[0],
        kind: ai ? "AI repository" : "Engineering repository",
        summary: entry.feature,
        image: null,
        live: project.demoUrl,
        github: project.githubUrl,
        details: `/archive/#${project.slug}`,
        detailsLabel: "Details",
        stack: project.technologies.slice(0, 3).join(" · "),
        technologies: project.technologies,
        year: entry.year,
      };
    });
  // Private professional work: real capture, no public source or site.
  const internal: ReelItem[] = privateWork.map((project) => ({
    slug: project.slug,
    title: project.title,
    kind: "Private internal project",
    summary: project.role,
    image: project.preview
      ? {
          src: project.preview.src,
          alt: project.preview.alt,
          width: project.preview.width,
          height: project.preview.height,
        }
      : null,
    details: `#${project.slug}-details`,
    detailsLabel: "Details",
    stack: project.technologies.slice(0, 3).join(" · "),
    technologies: project.technologies,
    imageHref: project.preview?.src,
    note: "Source code and application access are not public.",
  }));
  const items = [...featured, ...internal, ...repositories];
  const count = items.length;
  const slugs = items.map((item) => item.slug).join("|");

  useEffect(() => {
    const element = root.current;
    if (!element || !motion) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    let disposed = false;
    let revert = () => {};
    let removeHash = () => {};
    void loadMotionKit().then(({ gsap, ScrollTrigger }) => {
      if (disposed) return;
      setEnhanced(true);
      const track = element.querySelector<HTMLElement>(".reel-track");
      if (!track) return;
      const step = 360 / count;
      const context = gsap.context(() => {
        const trigger = ScrollTrigger.create({
          trigger: element,
          start: "top top+=104",
          end: () => `+=${(count - 1) * window.innerHeight * 0.24}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const turn = self.progress * (count - 1);
            track.style.setProperty("--turn", `${-turn * step}deg`);
            const index = Math.round(turn);
            setActive((current) => (current === index ? current : index));
          },
        });
        jump.current = (index: number) => {
          const target =
            trigger.start +
            (index / (count - 1)) * (trigger.end - trigger.start);
          const lenis = getLenis();
          if (lenis) lenis.scrollTo(target, { duration: 1.1 });
          else window.scrollTo({ top: target, behavior: "smooth" });
        };
        // Shared links to a project (/#slug) turn the reel to that card.
        const openHash = () => {
          const slug = decodeURIComponent(window.location.hash.slice(1));
          const index = slugs.split("|").indexOf(slug);
          if (index >= 0) requestAnimationFrame(() => jump.current(index));
        };
        openHash();
        window.addEventListener("hashchange", openHash);
        removeHash = () => window.removeEventListener("hashchange", openHash);
      }, element);
      revert = () => context.revert();
    });
    return () => {
      disposed = true;
      removeHash();
      revert();
      setEnhanced(false);
      jump.current = () => {};
    };
  }, [motion, count, slugs]);

  return (
    <div
      ref={root}
      className={`reel${enhanced ? " is-3d" : ""}`}
      role="region"
      aria-labelledby="reel-title"
    >
      <div className="reel-header">
        <div>
          <p className="eyebrow">Featured reel</p>
          <h3 id="reel-title">Scroll through the work</h3>
        </div>
        <p className="reel-counter" aria-hidden="true">
          <span>{String(active + 1).padStart(2, "0")}</span> /{" "}
          {String(count).padStart(2, "0")}
        </p>
      </div>
      <div className="reel-stage">
        <ol className="reel-track" style={{ ["--count" as string]: count }}>
          {items.map((item, index) => (
            <li
              key={item.slug}
              id={item.slug}
              tabIndex={-1}
              className="reel-card"
              style={{ ["--i" as string]: index }}
              data-active={enhanced && index === active ? "true" : undefined}
              onFocus={() => {
                if (enhanced) jump.current(index);
              }}
            >
              <a
                className={`reel-media${item.image ? "" : " reel-cover"}`}
                onPointerMove={(event) => {
                  if (!motion || event.pointerType !== "mouse") return;
                  const frame = event.currentTarget;
                  const bounds = frame.getBoundingClientRect();
                  if (!bounds.width || !bounds.height) return;
                  const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
                  const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
                  frame.style.setProperty("--preview-yaw", `${(x - 0.5) * 8}deg`);
                  frame.style.setProperty("--preview-pitch", `${(0.5 - y) * 6}deg`);
                  frame.style.setProperty("--preview-light", `${x * 100}% ${y * 100}%`);
                }}
                href={item.imageHref ?? item.details}
                data-cursor={item.note ? "Enlarge" : "Open"}
                aria-label={
                  item.note
                    ? `View full-size ${item.title} screenshot`
                    : `${item.title}: ${item.detailsLabel.toLowerCase()}`
                }
              >
                {item.image ? (
                  <img
                    src={item.image.src}
                    width={item.image.width}
                    height={item.image.height}
                    alt={item.image.alt}
                    loading="lazy"
                  />
                ) : (
                  <span className="reel-cover-art" aria-hidden="true">
                    <span className="reel-cover-mark">
                      {item.title
                        .split(/[\s&-]+/)
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                    <span className="reel-cover-tags">
                      {item.technologies.slice(0, 4).map((tech) => (
                        <span key={tech}>{tech}</span>
                      ))}
                    </span>
                    {item.year && (
                      <span className="reel-cover-year">{item.year}</span>
                    )}
                  </span>
                )}
              </a>
              <div className="reel-meta">
                <p className="project-kind">{item.kind}</p>
                <h4>{item.title}</h4>
                <p className="reel-summary">{item.summary}</p>
                <p className="reel-stack">{item.stack}</p>
                <div className="reel-links">
                  {item.live && (
                    <a
                      href={item.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live site <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                  {item.github && (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub source for ${item.title}`}
                    >
                      GitHub <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                  {item.detailsLabel && (
                    <a
                      href={item.details}
                      onClick={(event) => {
                        // In-page details (private work): open, then scroll.
                        if (!item.details.startsWith("#")) return;
                        const target = document.getElementById(
                          item.details.slice(1),
                        );
                        if (!(target instanceof HTMLDetailsElement)) return;
                        event.preventDefault();
                        event.stopPropagation();
                        target.open = true;
                        window.history.replaceState(null, "", item.details);
                        requestAnimationFrame(() => {
                          const lenis = getLenis();
                          if (lenis) lenis.scrollTo(target, { offset: -110 });
                          else
                            target.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          target.querySelector("summary")?.focus({
                            preventScroll: true,
                          });
                        });
                      }}
                    >
                      {item.detailsLabel}{" "}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  )}
                  {item.note && <p className="reel-note">{item.note}</p>}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <div className="reel-progress" aria-hidden="true">
        <span
          style={{ ["--p" as string]: count > 1 ? active / (count - 1) : 0 }}
        />
      </div>
    </div>
  );
}
