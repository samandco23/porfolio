"use client";
import { usePreferences, useSiteContent } from "@/components/site-content";
import { normalizeLocale, normalizeTheme } from "@/lib/preferences";
export function PreferenceControls() {
  const { locale, theme, setLocale, setTheme, pending } = usePreferences();
  const copy = useSiteContent();
  return <div className="flex shrink-0 items-center gap-1.5" aria-busy={pending}>
    <label><span className="sr-only">{copy["preferences.language"]}</span><select className="border border-zinc-800 bg-base-400 px-1 py-1.5 font-mono text-[11px] text-zinc-300 focus-visible:outline-accent" value={locale} disabled={pending} onChange={(event) => setLocale(normalizeLocale(event.target.value))}><option value="fr" lang="fr">FR</option><option value="en" lang="en">EN</option></select></label>
    <label><span className="sr-only">{copy["preferences.theme"]}</span><select className="max-w-20 border border-zinc-800 bg-base-400 px-1 py-1.5 font-mono text-[11px] text-zinc-300 focus-visible:outline-accent" value={theme} onChange={(event) => setTheme(normalizeTheme(event.target.value))}><option value="light">{copy["preferences.light"]}</option><option value="dark">{copy["preferences.dark"]}</option><option value="system">{copy["preferences.system"]}</option></select></label>
  </div>;
}
