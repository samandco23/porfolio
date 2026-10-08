"use client";
import { useState, useTransition } from "react";
import { DEFAULT_SITE_CONTENT } from "@/lib/site-content";
import { saveSiteContent } from "@/lib/actions/admin";
import { Field } from "./profile-form";

export function SiteContentForm({ content }: { content: Record<string, string> }) {
  const [pending, startTransition] = useTransition();
  const [filter, setFilter] = useState("");
  const [state, setState] = useState({ ok: false, message: "", errors: {} as Record<string, string> });
  return <section className="card-dark space-y-5 p-6">
    <h2 className="font-mono text-sm text-zinc-300">Public site content</h2>
    <p className="text-sm text-zinc-500">Edit page headings, navigation, buttons, contact copy, category names and SEO. Empty text hides the corresponding wording. Profile, projects, articles and skills have their own editors.</p>
    <Field label="Find a text"><input type="search" className="input-dark" value={filter} onChange={(event) => setFilter(event.target.value)} /></Field>
    <form onSubmit={(event) => { event.preventDefault(); const data = new FormData(event.currentTarget); startTransition(async () => setState(await saveSiteContent(state, data))); }} className="space-y-5">
      {Object.keys(DEFAULT_SITE_CONTENT).map((key) => <div key={key} hidden={!!filter && !`${key} ${content[key]}`.toLowerCase().includes(filter.toLowerCase())}>
        <Field label={DEFAULT_SITE_CONTENT[key] || key} hint={key} error={state.errors[key]}><textarea name={key} defaultValue={content[key]} rows={content[key]?.length > 100 ? 3 : 1} className="input-dark resize-y" maxLength={4000} /></Field>
      </div>)}
      <button disabled={pending} className="btn-primary">{pending ? "Saving…" : "Save site content"}</button>
      {state.message && <p role="status" className={state.ok ? "text-[#00FF66]" : "text-red-400"}>{state.message}</p>}
    </form>
  </section>;
}
