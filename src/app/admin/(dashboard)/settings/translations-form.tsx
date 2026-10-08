"use client";
import { useState, useTransition } from "react";
import { saveSiteContent } from "@/lib/actions/admin";
import { translationKey, type TranslationKind } from "@/lib/translations";
import { Field } from "./profile-form";
export type TranslationSource = { kind: TranslationKind; id: string; title: string; fields: Record<string, string> };
export function TranslationsForm({ sources, content }: { sources: TranslationSource[]; content: Record<string, string> }) {
  const [locale, setLocale] = useState<"fr" | "en">("en");
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState({ ok: false, message: "", errors: {} as Record<string, string> });
  return <section className="card-dark space-y-5 p-6">
    <h2 className="font-mono text-lg text-white">Content translations</h2>
    <p className="text-sm text-zinc-400">Translate profile, projects, articles, events and photo captions. Blank fields use the original content. Translations follow publication status.</p>
    <Field label="Language to edit"><select className="input-dark" value={locale} onChange={(event) => setLocale(event.target.value as "fr" | "en")}><option value="en">English</option><option value="fr">Français</option></select></Field>
    <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); startTransition(async () => setState(await saveSiteContent(state, data))); }} className="space-y-5">
      {sources.map((source) => <details key={source.id} className="border border-zinc-800 p-4"><summary className="cursor-pointer font-mono text-sm text-zinc-300">{source.title} · {source.kind}</summary>
        {(["en", "fr"] as const).map((language) => <div key={language} hidden={language !== locale} className="mt-5 space-y-5">{Object.entries(source.fields).map(([field, original]) => {
          const key = translationKey(language, source.kind, source.id, field);
          return <Field key={key} label={field} error={state.errors[key]} hint={`Original: ${original.slice(0, 180)}${original.length > 180 ? "…" : ""}`}><textarea name={key} defaultValue={content[key] ?? ""} placeholder={original.slice(0, 280)} maxLength={60000} rows={field === "content" || field === "longBio" ? 8 : 2} className="input-dark resize-y" /></Field>;
        })}</div>)}
      </details>)}
      <button disabled={pending} className="btn-primary">{pending ? "Saving…" : "Save translations"}</button>
      {state.message && <p role="status" className={state.ok ? "text-accent" : "text-red-400"}>{state.message}</p>}
    </form>
  </section>;
}
