import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects, type CaseStudy } from "../data/portfolio";
import { curatedArchive } from "../data/recruiter";
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
};

export function ProjectReel({ studies }: { studies: CaseStudy[] }) {
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
      details: `/work/${project.slug}/`,
      detailsLabel: "Case study",
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
  const items = [...featured, ...repositories];
  const count = items.length;

  useEffect(() => {
    const element = root.current;
    if (!element || !motion) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;
    let disposed = false;
    let revert = () => {};
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
      }, element);
      revert = () => context.revert();
    });
    return () => {
      disposed = true;
      revert();
      setEnhanced(false);
      jump.current = () => {};
    };
  }, [motion, count]);

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
              className="reel-card"
              style={{ ["--i" as string]: index }}
              data-active={enhanced && index === active ? "true" : undefined}
              onFocus={() => {
                if (enhanced) jump.current(index);
              }}
            >
              <a
                className={`reel-media${item.image ? "" : " reel-cover"}`}
                href={item.image ? `#${item.slug}` : item.details}
                data-cursor="Details"
                aria-label={
                  item.image
                    ? `${item.title}: jump to project details`
                    : `${item.title}: open repository details`
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
                  <a href={item.details}>
                    {item.detailsLabel}{" "}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
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
