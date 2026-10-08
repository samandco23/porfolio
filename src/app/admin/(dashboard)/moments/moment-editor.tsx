"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveMoment } from "@/lib/actions/admin";
import { MOMENT_KINDS, photoLines } from "@/lib/moments";
import type { MomentInput } from "@/lib/moments";
import { slugify } from "@/lib/utils";
import { Field } from "../settings/profile-form";
import { ImageUpload } from "@/app/admin/_components/image-upload";

type EditableMoment = MomentInput & { id?: string };
const EMPTY: EditableMoment = { title: "", slug: "", kind: "MEMORY", description: "", content: "", date: "", location: "", album: "", coverUrl: "", images: "", status: "DRAFT", featured: false, order: 0 };
export function MomentEditor({ moment, adminBase, uploadEnabled }: { moment?: Omit<EditableMoment, "date" | "location" | "album" | "coverUrl"> & { date: string | null; location: string | null; album: string | null; coverUrl: string | null }; adminBase: string; uploadEnabled: boolean }) {
  const [values, setValues] = useState<EditableMoment>(moment ? { ...moment, date: moment.date ?? "", location: moment.location ?? "", album: moment.album ?? "", coverUrl: moment.coverUrl ?? "", images: photoLines(moment.images) } : EMPTY);
  const [precision, setPrecision] = useState(moment?.date?.length === 4 ? "year" : moment?.date?.length === 7 ? "month" : "day");
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState({ ok: false, message: "", errors: {} as Record<string, string> });
  const router = useRouter();
  const textField = (name: keyof EditableMoment, label: string, rows?: number) => <Field label={label} error={state.errors[name]}>{rows ? <textarea name={name} className="input-dark resize-y" rows={rows} value={String(values[name] ?? "")} onChange={(event) => setValues({ ...values, [name]: event.target.value })} /> : <input name={name} className="input-dark" type={name === "date" ? precision === "year" ? "number" : precision === "month" ? "month" : "date" : name === "order" ? "number" : "text"} min={name === "order" ? 0 : name === "date" && precision === "year" ? 1900 : undefined} max={name === "order" ? 999 : name === "date" && precision === "year" ? 2199 : undefined} value={String(values[name] ?? "")} onChange={(event) => setValues({ ...values, [name]: event.target.value })} />}</Field>;
  return <form className="card-dark space-y-5 p-6" onSubmit={(event) => {
    event.preventDefault(); const formData = new FormData(event.currentTarget);
    startTransition(async () => { const result = await saveMoment(state, formData); setState(result); if (result.ok && result.id) { router.replace(`${adminBase}/moments?edit=${result.id}`); router.refresh(); } });
  }}>
    {moment?.id && <input type="hidden" name="id" value={moment.id} />}
    <h2 className="font-mono text-xl text-white">{moment ? "Edit moment" : "New event, memory or gallery"}</h2>
    <div className="grid gap-5 sm:grid-cols-2">
      <Field label="Title *" error={state.errors.title}><input name="title" required className="input-dark" value={values.title} onChange={(event) => setValues({ ...values, title: event.target.value, slug: !moment && values.slug === slugify(values.title) ? slugify(event.target.value) : values.slug })} /></Field>
      {textField("slug", "Slug *")}
      <Field label="Type" error={state.errors.kind}><select name="kind" className="input-dark" value={values.kind} onChange={(event) => setValues({ ...values, kind: event.target.value as MomentInput["kind"] })}>{MOMENT_KINDS.map((kind) => <option key={kind} value={kind}>{kind}</option>)}</select></Field>
      <Field label="Publication"><select name="status" className="input-dark" value={values.status} onChange={(event) => setValues({ ...values, status: event.target.value as MomentInput["status"] })}><option value="DRAFT">Draft — private</option><option value="PUBLISHED">Published — public</option></select></Field>
      <Field label="Date precision"><select className="input-dark" value={precision} onChange={(event) => { setPrecision(event.target.value); setValues({ ...values, date: "" }); }}><option value="day">Exact date</option><option value="month">Month only</option><option value="year">Year only</option></select></Field>
      {textField("date", "Date (optional)")}{textField("location", "Location (optional)")}{textField("album", "Album (optional)")}{textField("order", "Order")}
    </div>
    {textField("description", "Summary *", 3)}{textField("content", "Story / event details (Markdown)", 8)}
    {textField("coverUrl", "Cover image URL")}
    <ImageUpload enabled={uploadEnabled} onUploaded={(url) => setValues((current) => ({ ...current, coverUrl: url }))} />
    <Field label="Gallery photos" hint="One HTTP(S) image URL per line, optionally followed by | caption. Up to 20 photos." error={state.errors.images}><textarea name="images" rows={8} className="input-dark resize-y" value={values.images} onChange={(event) => setValues({ ...values, images: event.target.value })} /></Field>
    <ImageUpload enabled={uploadEnabled} onUploaded={(url) => setValues((current) => ({ ...current, images: [current.images, url].filter(Boolean).join("\n") }))} />
    <label className="flex items-center gap-3 text-sm text-zinc-300"><input name="featured" type="checkbox" checked={values.featured} onChange={(event) => setValues({ ...values, featured: event.target.checked })} /> Feature on homepage</label>
    <button disabled={pending} className="btn-primary">{pending ? "Saving…" : "Save moment"}</button>
    {state.message && <p role="status" className={state.ok ? "text-accent" : "text-red-400"}>{state.message}</p>}
  </form>;
}
