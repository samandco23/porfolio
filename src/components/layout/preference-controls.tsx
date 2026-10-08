"use client";
import { usePreferences, useSiteContent } from "@/components/site-content";
import { normalizeLocale, normalizeTheme } from "@/lib/preferences";
export function PreferenceControls() {
  const { locale, theme, setLocale, setTheme, pending } = usePreferences();
  const copy = useSiteContent();
  return <div className="flex shrink-0 items-center rounded-sm border border-zinc-800" aria-busy={pending}>
    <label><span className="sr-only">{copy["preferences.language"]}</span><select className="min-h-11 min-w-11 border-0 bg-transparent pl-2 font-mono text-xs text-zinc-300 disabled:opacity-50" value={locale} disabled={pending} onChange={(event) => setLocale(normalizeLocale(event.target.value))}><option className="bg-base-400" value="fr" lang="fr">FR</option><option className="bg-base-400" value="en" lang="en">EN</option></select></label>
    <label className="border-l border-zinc-800"><span className="sr-only">{copy["preferences.theme"]}</span><select className="min-h-11 max-w-20 border-0 bg-transparent pl-2 font-mono text-xs text-zinc-300" value={theme} onChange={(event) => setTheme(normalizeTheme(event.target.value))}><option className="bg-base-400" value="light">{copy["preferences.light"]}</option><option className="bg-base-400" value="dark">{copy["preferences.dark"]}</option><option className="bg-base-400" value="system">{copy["preferences.system"]}</option></select></label>
  </div>;
}
