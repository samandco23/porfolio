
import { SiteText } from "@/components/site-content";
import { pageMetadata } from "@/lib/seo";
import { getProfile, getSiteContent } from "@/lib/queries";
import { ContactForm } from "./contact-form";

export async function generateMetadata() {
  const copy = await getSiteContent();
  return pageMetadata({ title: copy["seo.contact.title"], description: copy["seo.contact.description"], path: "/contact" });
}

export default async function ContactPage() {
  const profile = await getProfile();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <p className="section-label">04 {"//"} <SiteText name="app.contact.page.1" /> </p>
      <h1 className="mt-2 font-mono text-3xl text-white md:text-4xl"> <SiteText name="app.contact.page.2" /> </h1>
      <p className="mt-3 max-w-2xl text-zinc-400"> <SiteText name="app.contact.page.3" /> </p>

      <div className="mt-12 grid gap-10 md:grid-cols-[1fr_320px]">
        <ContactForm />

        <aside className="card-dark h-fit p-6">
          <p className="section-label"><SiteText name="app.contact.page.4" /></p>
          <div className="mt-4 space-y-3 font-mono text-sm">
            <p className="text-zinc-400">
              <span className="text-zinc-600"> <SiteText name="app.contact.page.5" /> </span>{" "}
              <a href={`mailto:${profile?.email}`} className="text-[#00FF66] hover:underline">
                {profile?.email}
              </a>
            </p>
            {profile?.phone && (
              <p className="text-zinc-400">
                <span className="text-zinc-600"> <SiteText name="app.contact.page.6" /> </span>{" "}
                <a
                  href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`}
                  className="text-[#00FF66] hover:underline"
                >
                  {profile.phone}
                </a>
              </p>
            )}
            {profile?.socialLinks.map((link) => (
              <p key={link.id} className="text-zinc-400">
                <span className="text-zinc-600">{link.label.toLowerCase()}:</span>{" "}
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#00FF66] hover:underline"
                >
                  {link.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                </a>
              </p>
            ))}
          </div>
          <p className="mt-6 border-t border-zinc-800 pt-4 font-mono text-[11px] leading-relaxed text-zinc-600"> <SiteText name="app.contact.page.7" /> </p>
        </aside>
      </div>
    </div>
  );
}
