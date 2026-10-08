import { cookies } from "next/headers";
import { headers } from "next/headers";
import { normalizeLocale, normalizeTheme, type Locale } from "./preferences";
export async function readPreferences(defaultLocale: Locale = "fr", defaultTheme = "system") {
  const [store, requestHeaders] = await Promise.all([cookies(), headers()]);
  return { locale: normalizeLocale(requestHeaders.get("x-portfolio-locale") ?? store.get("portfolio-locale")?.value, defaultLocale), theme: normalizeTheme(store.get("portfolio-theme")?.value ?? defaultTheme) };
}
