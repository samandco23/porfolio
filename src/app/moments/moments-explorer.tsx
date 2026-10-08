"use client";
import { useState } from "react";
import { MOMENT_KINDS } from "@/lib/moments";
import { MomentCard, type MomentCardData } from "@/components/moment-card";
import { SiteText, useSiteContent } from "@/components/site-content";
export function MomentsExplorer({ moments }: { moments: MomentCardData[] }) {
  const [view, setView] = useState("timeline");
  const [kind, setKind] = useState<string>("ALL");
  const [album, setAlbum] = useState("");
  const content = useSiteContent();
  const albums = [...new Set(moments.map((moment) => moment.album).filter((name): name is string => !!name))].sort();
  const filtered = moments.filter((moment) => (kind === "ALL" || moment.kind === kind) && (!album || moment.album === album));
  const years = [...new Set(filtered.map((moment) => moment.date?.slice(0, 4) || "undated"))].sort((a, b) => b.localeCompare(a));
  return <section className="mt-10">
    <div className="flex flex-wrap items-center gap-3">
      {["ALL", ...MOMENT_KINDS].map((value) => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)} className={`border px-4 py-2 font-mono text-xs ${kind === value ? "border-accent/50 text-accent" : "border-zinc-800 text-zinc-400 hover:text-white"}`}><SiteText name={`moments.kind.${value}`} /></button>)}
      {albums.length > 0 && <select aria-label={content["moments.albumLabel"]} className="input-dark ml-auto w-auto max-w-full" value={album} onChange={(event) => setAlbum(event.target.value)}><option value="">{content["moments.allAlbums"]}</option>{albums.map((name) => <option key={name} value={name}>{name}</option>)}</select>}
    </div>
    <div className="mt-6 flex gap-3">{["timeline", "gallery"].map((mode) => <button type="button" key={mode} aria-pressed={view === mode} onClick={() => setView(mode)} className={`font-mono text-xs ${view === mode ? "text-accent underline underline-offset-4" : "text-zinc-500"}`}><SiteText name={`moments.${mode}`} /></button>)}</div>
    {view === "gallery" ? <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map((moment) => <MomentCard key={moment.id} moment={moment} />)}</div> : <div className="mt-8 space-y-12">{years.map((year) => <section key={year} className="border-l border-accent/30 pl-6"><h2 className="mb-6 font-mono text-2xl text-accent">{year === "undated" ? <SiteText name="moments.undated" /> : year}</h2><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.filter((moment) => (moment.date?.slice(0, 4) || "undated") === year).sort((a, b) => (b.date || "").localeCompare(a.date || "")).map((moment) => <MomentCard key={moment.id} moment={moment} />)}</div></section>)}</div>}
    {!filtered.length && <p className="mt-10 font-mono text-sm text-zinc-500"><SiteText name="moments.empty" /></p>}
  </section>;
}
