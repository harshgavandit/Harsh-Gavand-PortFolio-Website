export const THEME_STORAGE_KEY = "portfolio-theme";

export function resolveTheme(savedTheme, prefersDark = false) {
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return prefersDark ? "dark" : "light";
}

export function getCurrentTheme(root = globalThis.document?.documentElement) {
  return root?.dataset?.theme === "dark" ? "dark" : "light";
}

export function applyTheme(
  theme,
  { root = globalThis.document?.documentElement, storage } = {},
) {
  if (theme !== "light" && theme !== "dark")
    throw new Error("Theme must be light or dark.");

  if (root) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  }

  try {
    const targetStorage = storage ?? globalThis.localStorage;
    targetStorage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Private browsing can disable storage; keep the in-page switch working.
  }

  try {
    globalThis.document
      ?.querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#0c111a" : "#f5f8fc");
  } catch {
    // The meta color is optional in non-browser and embedded contexts.
  }

  return theme;
}
