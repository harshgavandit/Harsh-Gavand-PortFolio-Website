import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const MotionPreferences = createContext(true);

function subscribeReducedMotion(onChange: () => void) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  preference.addEventListener("change", onChange);
  return () => preference.removeEventListener("change", onChange);
}

function getReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MotionPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const systemReduced = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotion,
    () => false,
  );
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
