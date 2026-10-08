import { MomentDate } from "@/components/moment-date";
import { LocalizedLink as Link } from "@/components/localized-link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";
import { getMomentBySlug, getProfile } from "@/lib/localized-queries";
import { pageMetadata, serializeJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { parseMomentPhotos } from "@/lib/moments";
import { Markdown } from "@/components/markdown";
import { SiteText } from "@/components/site-content";
import { localizedPath } from "@/lib/locale-routes";
import { readPreferences } from "@/lib/server-preferences";
import { canOptimizeImage } from "@/lib/media";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const moment = await getMomentBySlug(slug);
  if (!moment) notFound();
  return pageMetadata({ title: moment.title, description: moment.description, path: `/moments/${moment.slug}`, kind: "moment", slug: moment.slug });
}
export default async function MomentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [moment, profile, { locale }] = await Promise.all([getMomentBySlug(slug), getProfile(), readPreferences()]);
  if (!moment) notFound();
  const photos = parseMomentPhotos(moment.images);
  const coverPhoto = photos.find((photo) => photo.url === moment.coverUrl);
  const galleryPhotos = photos.filter((photo) => photo.url !== moment.coverUrl);
  const jsonLd = { "@context": "https://schema.org", "@type": "CreativeWork", name: moment.title, description: moment.description, url: new URL(localizedPath(`/moments/${moment.slug}`, locale), profile?.siteUrl || getSiteUrl()).toString(), creator: profile?.fullName ? { "@type": "Person", name: profile.fullName } : undefined, image: [moment.coverUrl, ...photos.map((photo) => photo.url)].filter(Boolean) };
  return <article className="mx-auto max-w-5xl px-6 py-16 md:py-24">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }} />
    <Link href="/moments" className="inline-flex min-h-11 items-center font-mono text-xs text-zinc-400 hover:text-accent"><SiteText name="moments.back" /></Link>
    <header className="mt-8">
      <p className="section-label"><SiteText name={`moments.kind.${moment.kind}`} /></p>
      <h1 className="display-heading mt-5">{moment.title}</h1>
      <p className="mt-4 max-w-3xl text-lg text-zinc-400">{moment.description}</p>
      <div className="mt-5 flex flex-wrap gap-5 font-mono text-xs text-zinc-400">{moment.date && <span className="inline-flex items-center gap-2"><CalendarDays aria-hidden="true" className="h-4 w-4" /><MomentDate date={moment.date} /></span>}{moment.location && <span className="inline-flex items-center gap-2"><MapPin aria-hidden="true" className="h-4 w-4" />{moment.location}</span>}{moment.album && <span className="text-accent">{moment.album}</span>}</div>
    </header>
    {moment.coverUrl && <figure className="mt-10"><a href={moment.coverUrl} target="_blank" rel="noopener noreferrer" className="block"><Image unoptimized={!canOptimizeImage(moment.coverUrl)} src={moment.coverUrl} alt={moment.title} width={1200} height={750} sizes="(max-width: 1024px) 100vw, 960px" className="max-h-[38rem] w-full rounded-md border border-zinc-800 object-contain" /></a>{coverPhoto?.caption && <figcaption className="mt-3 text-sm leading-relaxed text-zinc-400">{coverPhoto.caption}</figcaption>}</figure>}
    {moment.content && <div className="mt-10 max-w-3xl"><Markdown content={moment.content} /></div>}
    {galleryPhotos.length > 0 && <section className="mt-14 border-t border-zinc-800 pt-8">
      <h2 className="font-mono text-xl text-white"><SiteText name="moments.photos" /></h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{galleryPhotos.map((photo, index) => <figure key={`${index}-${photo.url}`}><a href={photo.url} target="_blank" rel="noopener noreferrer" className="block border border-zinc-800 hover:border-accent/50"><Image unoptimized={!canOptimizeImage(photo.url)} src={photo.url} alt={photo.caption || `${moment.title} — ${index + 1}`} width={960} height={720} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" className="aspect-[4/3] w-full object-contain bg-black" /></a>{photo.caption && <figcaption className="mt-2 text-sm text-zinc-400">{photo.caption}</figcaption>}</figure>)}</div>
    </section>}
  </article>;
}
