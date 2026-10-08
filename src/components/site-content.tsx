"use client";

import { createContext, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";
import { localizedContent, type Locale, type Theme } from "@/lib/preferences";
import { localizedPath } from "@/lib/locale-routes";

const ContentContext = createContext(DEFAULT_SITE_CONTENT);
const PreferencesContext = createContext({ locale: "fr" as Locale, theme: "system" as Theme, pending: false, setLocale: (() => {}) as (value: Locale) => void, setTheme: (() => {}) as (value: Theme) => void });
function persist(name: string, value: string) {
  document.cookie = `${name}=${value}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === "https:" ? "; Secure" : ""}`;
}
export function SiteContentProvider({ content, locale: initialLocale = "fr", theme: initialTheme = "system", children }: { content: Record<string, string>; locale?: Locale; theme?: Theme; children: React.ReactNode }) {
  const [locale, updateLocale] = useState(initialLocale);
  const [theme, updateTheme] = useState(initialTheme);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => { updateLocale(initialLocale); }, [initialLocale]);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      const resolved = theme === "system" ? media.matches ? "dark" : "light" : theme;
      document.documentElement.dataset.theme = resolved;
      document.documentElement.dataset.themeMode = theme;
      document.documentElement.style.colorScheme = resolved;
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", resolved === "dark" ? "#050505" : "#f8faf9");
    };
    apply(); media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);
  const translated = useMemo(() => localizedContent(content, locale), [content, locale]);
  return <PreferencesContext.Provider value={{ locale, theme, pending,
    setLocale: (value) => { persist("portfolio-locale", value); updateLocale(value); startTransition(() => router.push(localizedPath(`${pathname}${window.location.search}${window.location.hash}`, value))); },
    setTheme: (value) => { persist("portfolio-theme", value); updateTheme(value); },
  }}><ContentContext.Provider value={translated}>{children}</ContentContext.Provider></PreferencesContext.Provider>;
}
export function usePreferences() { return useContext(PreferencesContext); }
export function useSiteContent() { return useContext(ContentContext); }
export function SiteText({ name, stripArrow = false }: { name: string; stripArrow?: boolean }) {
  const content = useSiteContent();
  const text = content[name] ?? DEFAULT_SITE_CONTENT[name] ?? "";
  return <>{stripArrow ? text.replace(/\s*[→↗]\s*$/, "") : text}</>;
}
