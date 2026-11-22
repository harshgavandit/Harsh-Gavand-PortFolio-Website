import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const MotionPreferences = createContext(true);

export function MotionPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Read the media query after hydration: a value that differs from the
  // server render during hydration would force React to discard the
  // pre-rendered HTML inside Suspense boundaries (React error #421).
  const [systemReduced, setSystemReduced] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    // A transition lets React finish hydrating Suspense boundaries before
    // applying the preference instead of discarding their server HTML.
    const update = () =>
      startTransition(() => setSystemReduced(preference.matches));
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);
  const enabled = !systemReduced;
  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "off";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [enabled]);
  return (
    <MotionPreferences.Provider value={enabled}>
      {children}
    </MotionPreferences.Provider>
  );
}

// Interactive demos follow the system's live reduced-motion preference.
// eslint-disable-next-line react-refresh/only-export-components
export function useMotionEnabled() {
  return useContext(MotionPreferences);
}
