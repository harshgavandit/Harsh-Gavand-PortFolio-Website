// Tiny shared store so the stack filter buttons and the 3D constellation
// highlight the same category.
type Listener = (focus: string | null) => void;
let current: string | null = null;
const listeners = new Set<Listener>();

export const stackFocus = {
  get: () => current,
  set(next: string | null) {
    if (next === current) return;
    current = next;
    listeners.forEach((listener) => listener(next));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
