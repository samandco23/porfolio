import { MomentDate } from "@/components/moment-date";
import Link from "next/link";
import Image from "next/image";
import type { Moment } from "@prisma/client";
import { CalendarDays, Camera, MapPin } from "lucide-react";
import { SiteText } from "./site-content";
import { parseMomentPhotos } from "@/lib/moments";

export type MomentCardData = Pick<Moment, "id" | "slug" | "title" | "description" | "kind" | "date" | "location" | "album" | "coverUrl" | "images">;
export function MomentCard({ moment }: { moment: MomentCardData }) {
  const cover = moment.coverUrl || parseMomentPhotos(moment.images)[0]?.url;
  return <Link href={`/moments/${moment.slug}`} className="group flex h-full flex-col border border-zinc-800 bg-base-400 transition-colors hover:border-accent/50">
    {cover ? <Image unoptimized src={cover} alt={moment.title} width={960} height={600} loading="lazy" className="aspect-[8/5] w-full border-b border-zinc-800 object-cover" /> : <div className="grid-backdrop flex aspect-[8/5] items-center justify-center border-b border-zinc-800"><Camera aria-hidden="true" className="h-8 w-8 text-zinc-700" /></div>}
    <div className="flex flex-1 flex-col gap-3 p-5">
      <p className="section-label"><SiteText name={`moments.kind.${moment.kind}`} /></p>
      <h2 className="font-mono text-lg text-white group-hover:text-accent">{moment.title}</h2>
      <p className="flex-1 text-sm leading-relaxed text-zinc-400">{moment.description}</p>
      <div className="flex flex-wrap gap-4 font-mono text-xs text-zinc-500">
        {moment.date && <span className="inline-flex items-center gap-1.5"><CalendarDays aria-hidden="true" className="h-3.5 w-3.5" /><MomentDate date={moment.date} /></span>}
        {moment.location && <span className="inline-flex items-center gap-1.5"><MapPin aria-hidden="true" className="h-3.5 w-3.5" />{moment.location}</span>}
      </div>
      {moment.album && <p className="font-mono text-xs text-accent">{moment.album}</p>}
    </div>
  </Link>;
}
