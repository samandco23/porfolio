export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const THEMES = ["light", "dark", "system"] as const;
export type Theme = (typeof THEMES)[number];
export function normalizeLocale(value: unknown, fallback: Locale = "fr"): Locale {
  return value === "fr" || value === "en" ? value : fallback;
}
export function normalizeTheme(value: unknown): Theme {
  return value === "light" || value === "dark" ? value : "system";
}
export function localizedContent(content: Record<string, string>, locale: Locale): Record<string, string> {
  const output = { ...content };
  if (locale === "en") for (const [key, value] of Object.entries(content)) {
    if (key.startsWith("en:") && !key.includes(":entity.")) output[key.slice(3)] = value;
  }
  return output;
}

// Run before paint to resolve the automatic theme without flashing another theme.
export const THEME_BOOTSTRAP = `(()=>{const root=document.documentElement;const mode=root.dataset.themeMode;const theme=mode==='light'||mode==='dark'?mode:window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';root.dataset.theme=theme;root.style.colorScheme=theme;})()`;
