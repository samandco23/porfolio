
import { SiteText } from "@/components/site-content";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { getProfile, getHomeProjects, getVisibleSkills, getFeaturedMoments } from "@/lib/queries";
import { Reveal } from "@/components/motion/reveal";
import { MomentCard } from "@/components/moment-card";
import { ProjectCard } from "@/components/project-card";

export async function generateMetadata() {
  const profile = await getProfile();
  const title = profile?.seoTitle || `${profile?.fullName || "Portfolio"} — ${profile?.title || "Developer"}`;
  const metadata = await pageMetadata({ title,
    description: profile?.seoDescription || profile?.shortBio || "Portfolio", path: "/" });
  return { ...metadata, title: { absolute: title } };
}

export default async function HomePage() {
  const [profile, { projects, hasFeatured }, skills, moments] = await Promise.all([getProfile(), getHomeProjects(3), getVisibleSkills(), getFeaturedMoments()]);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="grid-backdrop relative overflow-hidden border-b border-zinc-800">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[#00FF66]/5 blur-3xl" />
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <p className="font-mono text-micro uppercase text-zinc-500">
              <SiteText name="app.page.1" />
              <span className="animate-blink text-[#00FF66]">▊</span>
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-3xl font-mono text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              {profile?.fullName ?? <SiteText name="app.page.2" />}
              <span className="mt-2 block text-xl font-normal text-zinc-500 sm:text-2xl">
                {profile?.title ?? <SiteText name="app.page.3" />}
              </span>
            </h1>
          </Reveal>

          {profile?.specialties && <p className="mt-5 max-w-3xl font-mono text-sm text-[#00FF66]">{profile.specialties}</p>}
          {profile?.tagline && <p className="mt-4 max-w-2xl font-mono text-sm text-zinc-300">{profile.tagline}</p>}

          <Reveal delay={0.16}>
            <p className="mt-8 max-w-2xl text-lg text-zinc-400">{profile?.shortBio}</p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/projects" className="btn-primary"> <SiteText name="app.page.4" /> <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-ghost"> <SiteText name="app.page.5" /> </Link>
              {profile?.location && (
                <span className="inline-flex items-center gap-1.5 font-mono text-xs text-zinc-500">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </span>
              )}
            </div>
          </Reveal>

          {/* Terminal block */}
          <Reveal delay={0.32}>
            <div className="mt-16 max-w-2xl border border-zinc-800 bg-black/60">
              <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-2.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-900/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-900/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-900/70" />
                <span className="ml-3 font-mono text-[11px] text-zinc-600">
                  {profile?.alias ? `${profile.alias.toLowerCase()}@dev` : "guest"}: ~
                </span>
              </div>
              <div className="space-y-1.5 p-4 font-mono text-[13px] leading-relaxed">
                <p>
                  <span className="text-[#00FF66]">$</span>{" "}
                  <span className="text-zinc-400"> <SiteText name="app.page.7" /> </span>
                </p>
                <p className="text-zinc-300">
                  {profile?.fullName} — {profile?.title}
                </p>
                <p>
                  <span className="text-[#00FF66]">$</span>{" "}
                  <span className="text-zinc-400"> <SiteText name="app.page.8" /> </span>
                </p>
                <p className="text-zinc-300">{profile?.email}</p>
                <p>
                  <span className="text-[#00FF66]">$</span>{" "}
                  <span className="text-zinc-400"> <SiteText name="app.page.9" /> </span>{" "}
                  <span className="text-zinc-500">
                    {profile?.available ? <SiteText name="app.page.10" /> : <SiteText name="app.page.11" />}
                  </span>{" "}
                  <span className="animate-blink text-[#00FF66]">▊</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {skills.some((skill) => skill.featured) && <section className="mx-auto max-w-6xl border-b border-zinc-800 px-6 py-10">
        <h2 className="section-label"><SiteText name="home.stackTitle" /></h2>
        <ul className="mt-5 flex flex-wrap gap-3">{skills.filter((skill) => skill.featured).map((skill) => <li key={skill.id} className="border border-zinc-800 px-3 py-2 font-mono text-xs text-zinc-300">{skill.name}</li>)}</ul>
        <Link href="/about#skills" className="mt-5 inline-block font-mono text-xs text-[#00FF66]"><SiteText name="home.stackLink" /></Link>
      </section>}

      {/* ── FEATURED PROJECTS ────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">01 {"//"} {hasFeatured ? <SiteText name="app.page.12" /> : <SiteText name="app.page.13" />}</p>
              <h2 className="mt-2 font-mono text-2xl text-white">
                {hasFeatured ? <SiteText name="app.page.14" /> : <SiteText name="app.page.15" />}
              </h2>
            </div>
            <Link href="/projects" className="font-mono text-xs text-zinc-500 hover:text-[#00FF66]"> <SiteText name="app.page.16" /> </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <Reveal key={project.id} delay={0.08 * i}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
          {projects.length === 0 && (
            <p className="font-mono text-sm text-zinc-600"> <SiteText name="app.page.17" /> {" "}
              <Link href="/contact" className="text-[#00FF66] hover:underline"> <SiteText name="app.page.18" /> </Link>
            </p>
          )}
        </div>
      </section>
      <section className="mx-auto max-w-6xl border-t border-zinc-800 px-6 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="font-mono text-2xl text-white"><SiteText name="moments.title" /></h2><Link href="/moments" className="font-mono text-xs text-[#00FF66]"><SiteText name="home.momentsLink" /></Link></div>
        {moments.length > 0 ? <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{moments.map((moment) => <MomentCard key={moment.id} moment={moment} />)}</div> : <p className="mt-4 text-sm text-zinc-500"><SiteText name="moments.intro" /></p>}
      </section>
    </div>
  );
}
