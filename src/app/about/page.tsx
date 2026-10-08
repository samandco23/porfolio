import Image from "next/image";
import { SiteText } from "@/components/site-content";
import { pageMetadata } from "@/lib/seo";
import { Mail, FileDown, ChevronDown } from "lucide-react";
import { getProfile, getVisibleSkills, getSiteContent } from "@/lib/localized-queries";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { Markdown } from "@/components/markdown";
import { PageHeading } from "@/components/page-heading";
import { OrbitMark } from "@/components/orbit-mark";
export async function generateMetadata() {
  const copy = await getSiteContent();
  return pageMetadata({ title: copy["seo.about.title"], description: copy["seo.about.description"], path: "/about" });
}
export default async function AboutPage() {
  const [profile, skills, content] = await Promise.all([getProfile(), getVisibleSkills(), getSiteContent()]);
  const initials = profile?.fullName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  return <div className="page-shell section-space">
    <PageHeading label={<><SiteText name="app.about.page.1" /></>} title={<SiteText name="app.about.page.2" />} description={profile?.tagline} />
    <div className="mt-12 grid items-start gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-20">
      <div><Markdown content={profile?.longBio || content["app.about.page.3"]} />{profile?.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8"><FileDown aria-hidden="true" className="h-4 w-4" /><SiteText name="app.about.page.4" /></a>}</div>
      <aside className="min-w-0 lg:sticky lg:top-28">
        {profile?.avatarUrl ? <div className="overflow-hidden rounded-md border border-zinc-800"><Image unoptimized src={profile.avatarUrl} alt={profile.fullName} width={640} height={640} loading="lazy" className="aspect-square w-full object-cover" /></div> : <div className="rounded-md border border-zinc-800 bg-base-400 p-6"><OrbitMark initials={initials} /></div>}
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-5 border-b border-zinc-800 pb-6 text-sm">
          {profile?.location && <div><dt className="font-mono text-xs text-zinc-400"><SiteText name="app.about.page.5" /></dt><dd className="mt-2 text-zinc-200">{profile.location}</dd></div>}
          <div><dt className="font-mono text-xs text-zinc-400"><SiteText name="app.about.page.8" /></dt><dd className="mt-2 text-accent"><SiteText name={profile?.available ? "app.about.page.11" : "app.about.page.12"} /></dd></div>
          {profile?.email && <div className="col-span-2"><dt className="font-mono text-xs text-zinc-400"><SiteText name="app.about.page.6" /></dt><dd className="mt-2"><a href={`mailto:${profile.email}`} className="text-zinc-200 hover:text-accent">{profile.email}</a></dd></div>}
          {profile?.phone && <div className="col-span-2"><dt className="font-mono text-xs text-zinc-400"><SiteText name="app.about.page.7" /></dt><dd className="mt-2"><a href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`} className="text-zinc-200 hover:text-accent">{profile.phone}</a></dd></div>}
        </dl>
        {profile?.email && <a href={`mailto:${profile.email}`} className="text-link mt-5"><Mail aria-hidden="true" className="h-4 w-4" /><SiteText name="app.about.page.13" /></a>}
      </aside>
    </div>
    <section id="skills" className="mt-20 scroll-mt-28 border-t border-zinc-800 pt-12 md:mt-28">
      <div className="mb-10 grid gap-6 md:grid-cols-[1fr_1.4fr]"><div><p className="section-label"><SiteText name="app.about.page.14" /></p><h2 className="section-heading mt-5"><SiteText name="app.about.page.15" /></h2></div><p className="max-w-xl self-end text-base leading-relaxed text-zinc-400"><SiteText name="redesign.skillsIntro" /></p></div>
      <div className="border-t border-zinc-800">{SKILL_CATEGORIES.map((category) => {
        const group = skills.filter((skill) => skill.category === category);
        if (!group.length) return null;
        return <details className="skill-group" key={category} open={category === "LANGUAGES"}>
          <summary><h3 className="font-mono text-base text-zinc-200 md:text-xl"><SiteText name={`category.${category}`} /></h3><span className="flex shrink-0 items-center gap-5"><span className="font-mono text-xs text-zinc-400">{group.length}<span className="sr-only"> <SiteText name="redesign.skillsCount" /></span></span><ChevronDown aria-hidden="true" className="skill-chevron h-4 w-4 text-accent transition-transform duration-200" /></span></summary>
          <ul className="grid gap-x-8 gap-y-5 pb-8 sm:grid-cols-2 lg:grid-cols-3">{group.map((skill) => <li key={skill.id} className="min-w-0"><div className="flex items-center justify-between gap-4 text-sm"><span className="text-zinc-300">{skill.name}</span>{skill.level !== null && <span className="font-mono text-xs text-zinc-400">{skill.level}%</span>}</div>{skill.level !== null && <div className="mt-2 h-px bg-zinc-800"><div className="h-px bg-accent" style={{ width: `${skill.level}%` }} /></div>}</li>)}</ul>
        </details>;
      })}</div>
      {!skills.length && <p className="empty-editorial"><SiteText name="app.about.page.16" /></p>}
    </section>
  </div>;
}
