import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";

const MotionPreferences = createContext({
  enabled: true,
  systemReduced: false,
  toggle: () => {},
});

export function MotionPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const systemReduced = Boolean(useReducedMotion());
  const [paused, setPaused] = useState(false);
  const enabled = !paused && !systemReduced;
  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? "on" : "off";
    return () => {
      delete document.documentElement.dataset.motion;
    };
  }, [enabled]);
  return (
    <MotionPreferences.Provider
      value={{
        enabled,
        systemReduced,
        toggle: () => setPaused((value) => !value),
      }}
    >
      <MotionConfig reducedMotion={enabled ? "user" : "always"}>
        {children}
      </MotionConfig>
    </MotionPreferences.Provider>
  );
}

// Hook shares the same motion context as its provider and control.
// eslint-disable-next-line react-refresh/only-export-components
export function useMotionEnabled() {
  return useContext(MotionPreferences).enabled;
}

export function MotionToggle() {
  const { enabled, systemReduced, toggle } = useContext(MotionPreferences);
  return (
    <button
      className="motion-toggle"
      type="button"
      onClick={toggle}
      disabled={systemReduced}
      aria-label={
        systemReduced
          ? "Reduced motion follows your system preference"
          : enabled
            ? "Pause visual motion"
            : "Enable visual motion"
      }
      title={
        systemReduced
          ? "Following your reduced-motion preference"
          : enabled
            ? "Pause visual motion"
            : "Enable visual motion"
      }
    >
      {enabled ? (
        <Pause size={13} aria-hidden="true" />
      ) : (
        <Play size={13} aria-hidden="true" />
      )}
      <span>
        {systemReduced
          ? "Reduced motion"
          : enabled
            ? "Motion on"
            : "Motion off"}
      </span>
    </button>
  );
}
