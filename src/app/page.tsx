import { SiteText } from "@/components/site-content";
import { pageMetadata } from "@/lib/seo";
import { LocalizedLink as Link } from "@/components/localized-link";
import { ArrowRight, ArrowUpRight, Code2, MapPin, ShieldCheck, Cloud, FileDown, Github } from "lucide-react";
import { getProfile, getHomeProjects, getVisibleSkills, getFeaturedMoments } from "@/lib/localized-queries";
import { Reveal } from "@/components/motion/reveal";
import { MomentCard } from "@/components/moment-card";
import { ProjectCard } from "@/components/project-card";
import { OrbitMark } from "@/components/orbit-mark";

export async function generateMetadata() {
  const profile = await getProfile();
  const title = profile?.seoTitle || `${profile?.fullName || "Portfolio"} — ${profile?.title || "Developer"}`;
  const metadata = await pageMetadata({ title, description: profile?.seoDescription || profile?.shortBio || "Portfolio", path: "/" });
  return { ...metadata, title: { absolute: title } };
}
export default async function HomePage() {
  const [profile, { projects, hasFeatured }, skills, moments] = await Promise.all([getProfile(), getHomeProjects(3), getVisibleSkills(), getFeaturedMoments()]);
  const name = profile?.fullName || "Berlin Koueni";
  const names = name.trim().split(/\s+/);
  const initials = names.map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const github = profile?.socialLinks?.find((link) => link.iconKey === "github");
  const areas = [
    { key: "software", Icon: Code2, categories: ["LANGUAGES", "FRONTEND", "BACKEND", "MOBILE"] },
    { key: "security", Icon: ShieldCheck, categories: ["SECURITY"] },
    { key: "cloud", Icon: Cloud, categories: ["CLOUD", "DEVOPS", "SYSTEMS"] },
  ];
  return <div>
    <section className="relative isolate overflow-hidden">
      <div className="page-shell">
        <div className="hero-grid">
          <div className="relative z-10 min-w-0">
            <p className="hero-enter hero-enter-1 mb-7 inline-flex items-center gap-3 font-mono text-xs text-zinc-300"><span className={`h-2 w-2 rounded-full ${profile?.available ? "bg-accent" : "bg-zinc-500"}`} aria-hidden="true" /><SiteText name={profile?.available ? "redesign.available" : "redesign.unavailable"} /></p>
            <h1 className="hero-enter hero-enter-2 hero-name"><span>{names[0]}</span>{names.length > 1 && <span className="text-accent">{names.slice(1).join(" ")}</span>}</h1>
            <p className="hero-enter hero-enter-3 mt-5 max-w-xl font-mono text-lg leading-snug text-zinc-200 md:text-2xl">{profile?.title}</p>
            <p className="hero-enter hero-enter-4 mt-6 max-w-xl text-base leading-relaxed text-zinc-400">{profile?.shortBio}</p>
            <div className="hero-enter hero-enter-5 mt-8 flex flex-wrap gap-3"><Link href="/projects" className="btn-primary"><SiteText name="app.page.4" /><ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link><Link href="/contact" className="btn-ghost"><SiteText name="app.page.5" /><ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div>
            {(profile?.resumeUrl || github) && <div className="hero-enter hero-enter-5 mt-3 flex flex-wrap gap-x-6 gap-y-1">
              {profile?.resumeUrl && <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-mono text-xs text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-accent focus-visible:text-accent"><FileDown aria-hidden="true" className="h-4 w-4" /><SiteText name="home.resumeLink" /></a>}
              {github && <a href={github.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-mono text-xs text-zinc-300 underline decoration-zinc-600 underline-offset-4 transition-colors hover:text-accent focus-visible:text-accent"><Github aria-hidden="true" className="h-4 w-4" /><SiteText name="home.githubLink" /></a>}
            </div>}
          </div>
          <OrbitMark initials={initials} />
        </div>
        <div className="hero-baseline">{profile?.location && <span className="inline-flex items-center gap-2"><MapPin aria-hidden="true" className="h-4 w-4 text-accent" />{profile.location}</span>}<span className="max-w-2xl">{profile?.specialties || profile?.tagline}</span></div>
      </div>
    </section>
    {skills.some((skill) => skill.featured) && <section className="page-shell"><h2 className="sr-only"><SiteText name="home.stackTitle" /></h2><ul className="stack-strip">{skills.filter((skill) => skill.featured).map((skill) => <li key={skill.id}>{skill.name}</li>)}</ul></section>}
    <section className="page-shell section-space">
      <Reveal><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="section-label">01 / <SiteText name={hasFeatured ? "app.page.12" : "app.page.13"} /></p><h2 className="section-heading mt-5"><SiteText name="redesign.projectsTitle" /> <span className="text-accent"><SiteText name="redesign.projectsAccent" /></span></h2></div><Link href="/projects" className="text-link"><SiteText name="app.page.16" stripArrow /><ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div></Reveal>
      <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2">{projects.map((project, i) => <Reveal key={project.id} className={i === 0 ? "md:col-span-2" : ""}><ProjectCard project={project} wide={i === 0} index={i} /></Reveal>)}</div>
      {!projects.length && <p className="empty-editorial mt-10"><SiteText name="app.page.17" /> <Link href="/contact" className="text-accent"><SiteText name="app.page.18" /></Link></p>}
    </section>
    <section className="border-y border-zinc-800 bg-base-400/50">
      <div className="page-shell section-space grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <Reveal><p className="section-label">02 / <SiteText name="redesign.expertiseLabel" /></p><h2 className="section-heading mt-6"><SiteText name="redesign.expertiseTitle" /><br /><span className="text-accent"><SiteText name="redesign.expertiseAccent" /></span></h2>{profile?.tagline && <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-400">{profile.tagline}</p>}<Link href="/about#skills" className="text-link mt-8"><SiteText name="home.stackLink" stripArrow /><ArrowUpRight aria-hidden="true" className="h-4 w-4" /></Link></Reveal>
        <div>{areas.map(({ key, Icon, categories }, i) => <Reveal key={key} delay={i * 0.07}><div className="expertise-row"><Icon aria-hidden="true" className="mt-1 h-6 w-6 text-accent" /><div><div className="flex items-center justify-between gap-4"><h3 className="font-mono text-lg font-medium text-white md:text-xl"><SiteText name={`redesign.${key}Title`} /></h3><span className="font-mono text-xs text-zinc-400">0{i + 1}</span></div><p className="mt-3 text-base leading-relaxed text-zinc-400"><SiteText name={`redesign.${key}Description`} /></p><p className="mt-4 font-mono text-xs leading-loose text-accent">{skills.filter((skill) => categories.includes(skill.category)).slice(0, 5).map((skill) => skill.name).join(" · ")}</p></div></div></Reveal>)}</div>
      </div>
    </section>
    <section className="page-shell section-space">
      <Reveal><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="section-label">03 / <SiteText name="moments.label" /></p><h2 className="section-heading mt-5"><SiteText name="redesign.momentsTitle" /> <span className="text-accent"><SiteText name="redesign.momentsAccent" /></span></h2></div><Link href="/moments" className="text-link"><SiteText name="home.momentsLink" stripArrow /><ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></div></Reveal>
      {moments.length > 0 ? <div className="mt-10 space-y-12">{moments.map((moment, i) => <Reveal key={moment.id} delay={i * 0.07}><MomentCard moment={moment} wide /></Reveal>)}</div> : <p className="mt-6 text-base text-zinc-400"><SiteText name="moments.intro" /></p>}
    </section>
    <section className="border-t border-zinc-800"><div className="page-shell section-space flex flex-wrap items-end justify-between gap-8"><div><p className="section-label"><SiteText name="redesign.contactLabel" /></p><h2 className="section-heading mt-5"><SiteText name="redesign.contactTitle" /> <span className="text-accent"><SiteText name="redesign.contactAccent" /></span></h2></div><Link href="/contact" className="btn-primary"><SiteText name="app.page.5" /><ArrowUpRight aria-hidden="true" className="h-5 w-5" /></Link></div></section>
  </div>;
}
