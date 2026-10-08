import { getPublishedMoments, getSiteContent } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { SiteText } from "@/components/site-content";
import { MomentsExplorer } from "./moments-explorer";
export async function generateMetadata() {
  const copy = await getSiteContent();
  return pageMetadata({ title: copy["seo.moments.title"], description: copy["seo.moments.description"], path: "/moments" });
}
export default async function MomentsPage() {
  const moments = await getPublishedMoments();
  return <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
    <p className="section-label">05 // <SiteText name="moments.label" /></p>
    <h1 className="mt-2 font-mono text-3xl text-white md:text-4xl"><SiteText name="moments.title" /></h1>
    <p className="mt-4 max-w-2xl text-zinc-400"><SiteText name="moments.intro" /></p>
    <MomentsExplorer moments={moments.map(({ id, slug, title, description, kind, date, location, album, coverUrl, images }) => ({ id, slug, title, description, kind, date, location, album, coverUrl, images }))} />
  </div>;
}
