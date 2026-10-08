import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { getMomentBySlug, getProfile } from "@/lib/queries";
import { pageMetadata, serializeJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { parseMomentPhotos } from "@/lib/moments";
import { Markdown } from "@/components/markdown";
import { SiteText } from "@/components/site-content";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moment = await getMomentBySlug(slug);
  if (!moment) notFound();
  return pageMetadata({ title: moment.title, description: moment.description, path: `/moments/${moment.slug}`, kind: "moment", slug: moment.slug });
}
export default async function MomentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [moment, profile] = await Promise.all([getMomentBySlug(slug), getProfile()]);
  if (!moment) notFound();
  const photos = parseMomentPhotos(moment.images);
  const jsonLd = { "@context": "https://schema.org", "@type": "CreativeWork", name: moment.title, description: moment.description, url: new URL(`/moments/${moment.slug}`, profile?.siteUrl || getSiteUrl()).toString(), creator: profile?.fullName ? { "@type": "Person", name: profile.fullName } : undefined, image: [moment.coverUrl, ...photos.map((photo) => photo.url)].filter(Boolean) };
  return <article className="mx-auto max-w-5xl px-6 py-16 md:py-24">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
    <Link href="/moments" className="font-mono text-xs text-zinc-500 hover:text-[#00FF66]"><SiteText name="moments.back" /></Link>
    <header className="mt-8">
      <p className="section-label"><SiteText name={`moments.kind.${moment.kind}`} /></p>
      <h1 className="mt-3 font-mono text-3xl text-white md:text-4xl">{moment.title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-zinc-400">{moment.description}</p>
      <div className="mt-5 flex flex-wrap gap-5 font-mono text-xs text-zinc-500">{moment.date && <span className="inline-flex items-center gap-2"><CalendarDays aria-hidden="true" className="h-4 w-4" /><time dateTime={moment.date}>{moment.date}</time></span>}{moment.location && <span className="inline-flex items-center gap-2"><MapPin aria-hidden="true" className="h-4 w-4" />{moment.location}</span>}{moment.album && <span className="text-[#00FF66]">{moment.album}</span>}</div>
    </header>
    {moment.coverUrl && <Image unoptimized src={moment.coverUrl} alt={moment.title} width={1200} height={750} className="mt-10 max-h-[38rem] w-full border border-zinc-800 object-contain" />}
    {moment.content && <div className="mt-10 max-w-3xl"><Markdown content={moment.content} /></div>}
    {photos.length > 0 && <section className="mt-14 border-t border-zinc-800 pt-8">
      <h2 className="font-mono text-xl text-white"><SiteText name="moments.photos" /></h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{photos.map((photo, index) => <figure key={`${index}-${photo.url}`}><a href={photo.url} target="_blank" rel="noopener noreferrer" className="block border border-zinc-800 hover:border-[#00FF66]/50"><Image unoptimized src={photo.url} alt={photo.caption || `${moment.title} — ${index + 1}`} width={960} height={720} loading="lazy" className="aspect-[4/3] w-full object-contain bg-black" /></a>{photo.caption && <figcaption className="mt-2 text-sm text-zinc-400">{photo.caption}</figcaption>}</figure>)}</div>
    </section>}
  </article>;
}
