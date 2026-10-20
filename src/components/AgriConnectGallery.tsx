import { useId, useRef, useState } from "react";
import { ArrowUpRight, Images } from "lucide-react";
import { agriConnectGallery } from "../data/agriConnectGallery";
import { nextTabIndex } from "../lib/interaction";

export function AgriConnectGallery() {
  const id = useId();
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  return (
    <div
      className="project-gallery"
      aria-label="AgriConnect platform screenshots"
    >
      <div className="project-gallery-heading">
        <span>
          <Images size={15} aria-hidden="true" /> Platform walkthrough
        </span>
        <span>
          {String(active + 1).padStart(2, "0")} /{" "}
          {String(agriConnectGallery.length).padStart(2, "0")}
        </span>
      </div>
      {agriConnectGallery.map((capture, index) => (
        <div
          key={capture.id}
          id={`${id}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${index}`}
          hidden={active !== index}
          tabIndex={0}
        >
          <figure className="capture-evidence project-gallery-capture">
            <a
              href={capture.src}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Enlarge AgriConnect ${capture.label} screenshot`}
            >
              <img
                src={capture.src}
                alt={capture.alt}
                width={capture.width}
                height={capture.height}
                loading="lazy"
              />
              <span className="project-gallery-enlarge" aria-hidden="true">
                <ArrowUpRight size={15} /> Enlarge
              </span>
            </a>
            <figcaption>
              <strong>{capture.label}</strong>
              <span>{capture.description}</span>
            </figcaption>
          </figure>
        </div>
      ))}
      <div
        className="project-gallery-tabs"
        role="tablist"
        aria-label="Choose an AgriConnect screenshot"
      >
        {agriConnectGallery.map((capture, index) => (
          <button
            key={capture.id}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            id={`${id}-tab-${index}`}
            role="tab"
            type="button"
            aria-selected={active === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const next = nextTabIndex(
                event.key,
                index,
                agriConnectGallery.length,
              );
              if (next !== null) {
                event.preventDefault();
                setActive(next);
                buttons.current[next]?.focus();
              }
            }}
          >
            <span className="project-gallery-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span>{capture.label}</span>
          </button>
        ))}
      </div>
      <p className="project-gallery-note">
        Live app captures · 21 October 2026 · Admin areas require authorised
        access.
      </p>
    </div>
  );
}
