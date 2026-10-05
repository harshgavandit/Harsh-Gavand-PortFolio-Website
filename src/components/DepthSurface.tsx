import type { ReactNode } from "react";

// Stable surfaces keep portraits and project previews easy to inspect.
export function DepthSurface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`depth-surface ${className}`}>{children}</div>;
}
