"use client";
import { useState } from "react";
import { MOMENT_KINDS } from "@/lib/moments";
import { MomentCard, type MomentCardData } from "@/components/moment-card";
import { SiteText, useSiteContent } from "@/components/site-content";
export function MomentsExplorer({ moments }: { moments: MomentCardData[] }) {
  const [kind, setKind] = useState<string>("ALL");
  const [album, setAlbum] = useState("");
  const content = useSiteContent();
  const albums = [...new Set(moments.map((moment) => moment.album).filter((name): name is string => !!name))].sort();
  const filtered = moments.filter((moment) => (kind === "ALL" || moment.kind === kind) && (!album || moment.album === album));
  return <section className="mt-10">
    <div className="flex flex-wrap items-center gap-3">
      {["ALL", ...MOMENT_KINDS].map((value) => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)} className={`border px-4 py-2 font-mono text-xs ${kind === value ? "border-[#00FF66]/50 text-[#00FF66]" : "border-zinc-800 text-zinc-400 hover:text-white"}`}><SiteText name={`moments.kind.${value}`} /></button>)}
      {albums.length > 0 && <select aria-label={content["moments.albumLabel"]} className="input-dark ml-auto w-auto max-w-full" value={album} onChange={(event) => setAlbum(event.target.value)}><option value="">{content["moments.allAlbums"]}</option>{albums.map((name) => <option key={name} value={name}>{name}</option>)}</select>}
    </div>
    <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{filtered.map((moment) => <MomentCard key={moment.id} moment={moment} />)}</div>
    {!filtered.length && <p className="mt-10 font-mono text-sm text-zinc-500"><SiteText name="moments.empty" /></p>}
  </section>;
}
