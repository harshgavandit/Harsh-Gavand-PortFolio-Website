import { useRef, useState, type ReactNode } from "react";
import { nextTabIndex } from "../lib/interaction";
export function Tabs({
  id,
  label,
  items,
}: {
  id: string;
  label: string;
  items: { label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(0);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  return (
    <div className="tab-widget">
      <div className="tab-list" role="tablist" aria-label={label}>
        {items.map((item, index) => (
          <button
            key={item.label}
            ref={(element) => {
              buttons.current[index] = element;
            }}
            id={`${id}-tab-${index}`}
            type="button"
            role="tab"
            aria-selected={active === index}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              const next = nextTabIndex(event.key, index, items.length);
              if (next !== null) {
                event.preventDefault();
                setActive(next);
                buttons.current[next]?.focus();
              }
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.label}
          className="tab-panel"
          id={`${id}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${index}`}
          hidden={active !== index}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
