import { useEffect, useRef } from "react";
import { m } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Layers3, X } from "lucide-react";
import { caseStudies, projects } from "../data/portfolio";
import { Tags, ActionLink } from "./Primitives";
import { useMotionEnabled } from "./MotionPreferences";

export function ProjectFocus({
  selected,
  onSelect,
  onClose,
}: {
  selected: number | null;
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const enabled = useMotionEnabled();
  const open = selected !== null;
  useEffect(() => {
    if (!open) {
      dialog.current?.close();
      return;
    }
    const previous = document.body.style.overflow;
    dialog.current?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);
  useEffect(() => {
    if (body.current) body.current.scrollTop = 0;
  }, [selected]);
  const index = selected ?? 0;
  const study = caseStudies[index];
  const project = projects.find((item) => item.id === study.projectId)!;
  return (
    <dialog
      ref={dialog}
      className="project-focus"
      aria-labelledby="focus-title"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex="0"]',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClose={onClose}
    >
      <header className="focus-header">
        <span className="eyebrow">PROJECT STUDIO / 0{index + 1}</span>
        <button
          type="button"
          aria-label="Close project viewer"
          onClick={onClose}
        >
          <X size={20} />
        </button>
      </header>
      <div className="focus-scroll" ref={body}>
        <m.div
          key={project.id}
          initial={enabled ? { opacity: 0.5, y: 16 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: enabled ? 0.4 : 0 }}
        >
          <div className="focus-intro">
            <span className="eyebrow">{project.category}</span>
            <h2 id="focus-title">{study.shortName}</h2>
            <p>{study.problem}</p>
          </div>
          <div className="focus-layout">
            <div className="focus-preview">
              {study.image ? (
                <img
                  src={`/projects/${study.image}-1280.webp`}
                  alt={study.imageAlt}
                  width={1280}
                  height={720}
                />
              ) : (
                <div className="focus-blueprint">
                  <Layers3 size={34} aria-hidden="true" />
                  <h3>{study.diagram?.title}</h3>
                  <ol>
                    {study.diagram?.nodes.map((node, i) => (
                      <li key={node}>
                        <span>0{i + 1}</span>
                        {node}
                      </li>
                    ))}
                  </ol>
                  <small>Conceptual implementation map</small>
                </div>
              )}
            </div>
            <div className="focus-brief">
              <h3>The brief</h3>
              <p>{project.overview}</p>
              <h3>My contribution</h3>
              <p>{project.role}</p>
              <Tags items={project.technologies} />
              <div className="actions">
                {project.demoUrl && (
                  <ActionLink href={project.demoUrl} primary external>
                    Live demo
                  </ActionLink>
                )}
                <ActionLink href={project.githubUrl} external>
                  Source code
                </ActionLink>
              </div>
            </div>
          </div>
          <div className="focus-notes">
            <section>
              <h3>Engineering challenge</h3>
              <p>{project.challenges}</p>
            </section>
            <section>
              <h3>Outcome</h3>
              <p>{project.impact}</p>
            </section>
          </div>
          <a
            href={`#project-${project.id}`}
            className="text-link"
            onClick={() => {
              onClose();
              requestAnimationFrame(() =>
                document
                  .getElementById(`project-${project.id}`)
                  ?.focus({ preventScroll: true }),
              );
            }}
          >
            Continue to the full case study{" "}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </m.div>
      </div>
      <footer className="focus-footer">
        <button
          type="button"
          onClick={() =>
            onSelect((index + caseStudies.length - 1) % caseStudies.length)
          }
        >
          <ArrowLeft size={16} aria-hidden="true" /> Previous
        </button>
        <span aria-live="polite">
          0{index + 1} / 0{caseStudies.length}
        </span>
        <button
          type="button"
          onClick={() => onSelect((index + 1) % caseStudies.length)}
        >
          Next project <ArrowRight size={16} aria-hidden="true" />
        </button>
      </footer>
    </dialog>
  );
}
