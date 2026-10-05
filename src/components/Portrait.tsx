import { ArrowUpRight, Braces, Layers3 } from "lucide-react";

export function Portrait() {
  return (
    <div className="portrait-composition">
      <span className="portrait-coordinate" aria-hidden="true">
        THE PERSON / BEHIND THE PRODUCTS
      </span>
      <div className="portrait-depth depth-surface">
        <figure className="portrait-frame">
          <img
            src="/portrait/harsh.jpeg"
            width="522"
            height="1160"
            alt="Harsh Gavand"
            fetchPriority="high"
          />
          <figcaption>
            <span>Harsh Gavand</span>
            <span>
              Mumbai, India <ArrowUpRight size={13} aria-hidden="true" />
            </span>
          </figcaption>
        </figure>
        <div className="portrait-note portrait-note-front">
          <Layers3 size={16} aria-hidden="true" />
          <span>
            <small>01 / THE EXPERIENCE</small>Thoughtful interfaces
          </span>
        </div>
        <div className="portrait-note portrait-note-back">
          <Braces size={16} aria-hidden="true" />
          <span>
            <small>02 / THE ENGINEERING</small>Reliable systems
          </span>
        </div>
      </div>
      <div className="portrait-signature">
        <span className="tiny-dot" /> Full-stack thinking. Human perspective.
      </div>
    </div>
  );
}
