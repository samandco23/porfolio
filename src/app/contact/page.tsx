import { SiteText } from "@/components/site-content";
import { pageMetadata } from "@/lib/seo";
import { ArrowUpRight, MapPin } from "lucide-react";
import { getProfile, getSiteContent } from "@/lib/localized-queries";
import { ContactForm } from "./contact-form";
export async function generateMetadata() {
  const copy = await getSiteContent();
  return pageMetadata({ title: copy["seo.contact.title"], description: copy["seo.contact.description"], path: "/contact" });
}
export default async function ContactPage() {
  const profile = await getProfile();
  return <div className="page-shell section-space">
    <header><p className="section-label"><SiteText name="app.contact.page.1" /></p><h1 className="display-heading mt-6"><SiteText name="redesign.contactTitle" /> <span className="text-accent"><SiteText name="redesign.contactAccent" /></span></h1></header>
    <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
      <aside className="min-w-0"><p className="max-w-md text-lg leading-relaxed text-zinc-400"><SiteText name="app.contact.page.3" /></p>
        <div className="mt-10 space-y-8">
          {profile?.email && <div><p className="section-label"><SiteText name="app.contact.page.5" /></p><a href={`mailto:${profile.email}`} className="mt-3 inline-flex min-h-11 items-center gap-3 font-mono text-base text-white transition-colors hover:text-accent md:text-lg">{profile.email}<ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" /></a></div>}
          {profile?.location && <div><p className="section-label"><SiteText name="app.about.page.5" /></p><p className="mt-4 inline-flex items-center gap-2 text-zinc-300"><MapPin aria-hidden="true" className="h-4 w-4 text-accent" />{profile.location}</p></div>}
          {profile?.phone && <div><p className="section-label"><SiteText name="app.contact.page.6" /></p><a href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`} className="mt-3 inline-flex min-h-11 items-center font-mono text-sm text-zinc-300 hover:text-accent">{profile.phone}</a></div>}
          <div className="flex flex-wrap gap-6 border-t border-zinc-800 pt-5">{profile?.socialLinks.map((link) => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="text-link">{link.label}<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>)}</div>
        </div>
        <p className="mt-8 max-w-md text-sm leading-relaxed text-zinc-400"><SiteText name="app.contact.page.7" /></p>
      </aside>
      <div className="contact-form min-w-0"><ContactForm /></div>
    </div>
  </div>;
}
