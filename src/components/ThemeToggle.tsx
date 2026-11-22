import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyTheme, getCurrentTheme, type Theme } from "../lib/theme.mjs";

export function ThemeToggle() {
  // Keep the prerender and first hydration render in the same light state.
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setTheme(getCurrentTheme());
  }, []);

  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <button
      className="theme-toggle"
      type="button"
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${nextTheme} mode`}
      onClick={() => {
        const selected = nextTheme;
        applyTheme(selected);
        setTheme(selected);
      }}
    >
      <Sun
        className="theme-icon theme-icon-light"
        size={18}
        aria-hidden="true"
      />
      <Moon
        className="theme-icon theme-icon-dark"
        size={18}
        aria-hidden="true"
      />
      <span className="sr-only">Color theme</span>
    </button>
  );
}
