import { cookies } from "next/headers";
import { normalizeLocale, normalizeTheme, type Locale } from "./preferences";
export async function readPreferences(defaultLocale: Locale = "fr", defaultTheme = "system") {
  const store = await cookies();
  return { locale: normalizeLocale(store.get("portfolio-locale")?.value, defaultLocale), theme: normalizeTheme(store.get("portfolio-theme")?.value ?? defaultTheme) };
}
