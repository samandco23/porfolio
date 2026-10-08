import { MomentDate } from "@/components/moment-date";
import Link from "next/link";
import Image from "next/image";
import type { Moment } from "@prisma/client";
import { ArrowUpRight, Camera, MapPin } from "lucide-react";
import { SiteText } from "./site-content";
import { parseMomentPhotos } from "@/lib/moments";
import { cn } from "@/lib/utils";
export type MomentCardData = Pick<Moment, "id" | "slug" | "title" | "description" | "kind" | "date" | "location" | "album" | "coverUrl" | "images">;
export function MomentCard({ moment, wide = false, headingLevel = 3 }: { moment: MomentCardData; wide?: boolean; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const cover = moment.coverUrl || parseMomentPhotos(moment.images)[0]?.url;
  return <Link href={`/moments/${moment.slug}`} className={cn("moment-card group", wide && "moment-card-wide")}>
    <div className="moment-media">{cover ? <Image unoptimized src={cover} alt={moment.title} fill loading="lazy" sizes="(max-width: 768px) 100vw, 60vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" /> : <div className="grid-backdrop flex h-full items-center justify-center"><Camera aria-hidden="true" className="h-12 w-12 text-zinc-500" /></div>}</div>
    <div className="border-b border-zinc-800 pb-6 pt-6">
      <p className="flex flex-wrap gap-3 font-mono text-xs uppercase tracking-wider text-zinc-400"><span className="text-accent"><SiteText name={`moments.kind.${moment.kind}`} /></span>{moment.date && <><span aria-hidden="true">/</span><MomentDate date={moment.date} /></>}</p>
      <Heading className="mt-4 font-mono text-xl leading-snug text-white transition-colors group-hover:text-accent md:text-2xl">{moment.title}</Heading>
      <p className="mt-4 text-base leading-relaxed text-zinc-400">{moment.description}</p>
      <div className="mt-6 flex items-end justify-between gap-4"><div className="space-y-2 font-mono text-xs text-zinc-400">{moment.album && <p>{moment.album}</p>}{moment.location && <p className="inline-flex items-center gap-2"><MapPin aria-hidden="true" className="h-4 w-4" />{moment.location}</p>}</div><span className="arrow-circle shrink-0" aria-hidden="true"><ArrowUpRight className="h-5 w-5" /></span></div>
    </div>
  </Link>;
}
