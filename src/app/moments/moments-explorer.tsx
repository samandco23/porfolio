"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutGrid, List, ArrowRight } from "lucide-react";
import { MOMENT_KINDS } from "@/lib/moments";
import { MomentCard, type MomentCardData } from "@/components/moment-card";
import { SiteText, useSiteContent } from "@/components/site-content";
import { cn } from "@/lib/utils";

export function MomentsExplorer({ moments }: { moments: MomentCardData[] }) {
  const [view, setView] = useState("timeline");
  const [kind, setKind] = useState<string>("ALL");
  const [album, setAlbum] = useState("");
  const reduceMotion = useReducedMotion();
  const content = useSiteContent();
  const albums = [...new Set(moments.map((moment) => moment.album).filter((name): name is string => !!name))].sort();
  const filtered = moments.filter((moment) => (kind === "ALL" || moment.kind === kind) && (!album || moment.album === album));
  const years = [...new Set(filtered.map((moment) => moment.date?.slice(0, 4) || "undated"))].sort((a, b) => b.localeCompare(a));

  return <section className="mt-8">
    <div className="flex flex-wrap items-center justify-between gap-6 border-b border-zinc-800 pb-6">
      <div className="flex flex-wrap gap-2">
        {["ALL", ...MOMENT_KINDS].map((value) => <button key={value} type="button" aria-pressed={kind === value} onClick={() => setKind(value)} className={cn("min-h-11 rounded-sm border px-4 font-mono text-xs transition-colors", kind === value ? "border-accent bg-accent/10 text-accent" : "border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-white")}><SiteText name={`moments.kind.${value}`} /></button>)}
      </div>
      <div className="flex flex-wrap items-center gap-5">
        {albums.length > 0 && <label><span className="sr-only">{content["moments.albumLabel"]}</span><select className="input-dark min-h-11 w-auto max-w-full text-xs" value={album} onChange={(event) => setAlbum(event.target.value)}><option value="">{content["moments.allAlbums"]}</option>{albums.map((name) => <option key={name} value={name}>{name}</option>)}</select></label>}
        <div className="flex gap-3">
          {[{ mode: "timeline", Icon: List }, { mode: "gallery", Icon: LayoutGrid }].map(({ mode, Icon }) => <button type="button" key={mode} aria-pressed={view === mode} onClick={() => setView(mode)} className={cn("inline-flex min-h-11 items-center gap-2 border-b-2 font-mono text-xs transition-colors", view === mode ? "border-accent text-zinc-200" : "border-transparent text-zinc-400 hover:text-white")}><Icon aria-hidden="true" className="h-4 w-4" /><SiteText name={`moments.${mode}`} /></button>)}
        </div>
      </div>
    </div>
    <p role="status" className="mt-6 font-mono text-xs text-zinc-400">{filtered.length} <SiteText name="redesign.momentsCount" /></p>
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={`${view}:${kind}:${album}`}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8, transition: { duration: 0.15 } }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        {!filtered.length ? <p className="empty-editorial mt-10"><SiteText name="moments.empty" /></p> : view === "gallery" ?
          <div className="mt-8 grid gap-x-8 gap-y-12 md:grid-cols-2">{filtered.map((moment) => <MomentCard key={moment.id} moment={moment} headingLevel={2} />)}</div> :
          <div className="mt-10 space-y-16">{years.map((year) => <section key={year} className="grid items-start gap-6 md:grid-cols-[160px_1fr] lg:grid-cols-[200px_1fr]"><div className="md:sticky md:top-28"><h2 className="timeline-year">{year === "undated" ? <span className="text-xl"><SiteText name="moments.undated" /></span> : year}</h2><ArrowRight aria-hidden="true" className="mt-4 hidden h-8 w-8 text-accent md:block" /></div><div className="relative space-y-12 border-l border-accent/40 pl-6 md:pl-8">{filtered.filter((moment) => (moment.date?.slice(0, 4) || "undated") === year).sort((a, b) => (b.date || "").localeCompare(a.date || "")).map((moment) => <div key={moment.id} className="relative before:absolute before:-left-[29px] before:top-8 before:h-2 before:w-2 before:rounded-full before:bg-accent md:before:-left-[37px]"><MomentCard moment={moment} /></div>)}</div></section>)}</div>}
      </motion.div>
    </AnimatePresence>
  </section>;
}
