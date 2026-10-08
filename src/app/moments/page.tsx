import { getPublishedMoments, getSiteContent } from "@/lib/localized-queries";
import { pageMetadata } from "@/lib/seo";
import { SiteText } from "@/components/site-content";
import { PageHeading } from "@/components/page-heading";
import { MomentsExplorer } from "./moments-explorer";
export async function generateMetadata() {
  const copy = await getSiteContent();
  return pageMetadata({ title: copy["seo.moments.title"], description: copy["seo.moments.description"], path: "/moments" });
}
export default async function MomentsPage() {
  const moments = await getPublishedMoments();
  return <div className="page-shell section-space">
    <PageHeading label={<SiteText name="moments.label" />} title={<SiteText name="moments.title" />} description={<SiteText name="moments.intro" />} />
    <MomentsExplorer moments={moments.map(({ id, slug, title, description, kind, date, location, album, coverUrl, images }) => ({ id, slug, title, description, kind, date, location, album, coverUrl, images }))} />
  </div>;
}
