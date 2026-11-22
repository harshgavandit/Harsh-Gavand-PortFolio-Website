export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY: string;
export function resolveTheme(
  savedTheme: string | null | undefined,
  prefersDark?: boolean,
): Theme;
export function getCurrentTheme(root?: HTMLElement): Theme;
export function applyTheme(
  theme: Theme,
  options?: { root?: HTMLElement; storage?: Storage | null },
): Theme;
