import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { getProfile, getFeaturedProjects } from "@/lib/queries";
import { Reveal } from "@/components/motion/reveal";
import { ProjectCard } from "@/components/project-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, featured] = await Promise.all([getProfile(), getFeaturedProjects(3)]);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="grid-backdrop relative overflow-hidden border-b border-zinc-800">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[42rem] -translate-x-1/2 rounded-full bg-[#00FF66]/5 blur-3xl" />
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <Reveal>
            <p className="font-mono text-micro uppercase text-zinc-500">
              {"> init portfolio_"}
              <span className="animate-blink text-[#00FF66]">▊</span>
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <h1 className="mt-6 max-w-3xl font-mono text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              {profile?.fullName ?? "Your Name"}
              <span className="mt-2 block text-xl font-normal text-zinc-500 sm:text-2xl">
                {profile?.title ?? "Full-Stack Developer"}
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-8 max-w-2xl text-lg text-zinc-400">{profile?.shortBio}</p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/projects" className="btn-primary">
                View projects <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/contact" className="btn-ghost">
                Get in touch
              </Link>
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
                  <span className="text-zinc-400">whoami</span>
                </p>
                <p className="text-zinc-300">
                  {profile?.fullName} — {profile?.title}
                </p>
                <p>
                  <span className="text-[#00FF66]">$</span>{" "}
                  <span className="text-zinc-400">cat contact.txt</span>
                </p>
                <p className="text-zinc-300">{profile?.email}</p>
                <p>
                  <span className="text-[#00FF66]">$</span>{" "}
                  <span className="text-zinc-400">uptime</span>{" "}
                  <span className="text-zinc-500">{"// available for new missions"}</span>{" "}
                  <span className="animate-blink text-[#00FF66]">▊</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURED PROJECTS ────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="flex items-end justify-between">
            <div>
              <p className="section-label">01 {"//"} selected work</p>
              <h2 className="mt-2 font-mono text-2xl text-white">Featured projects</h2>
            </div>
            <Link href="/projects" className="font-mono text-xs text-zinc-500 hover:text-[#00FF66]">
              all projects →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((project, i) => (
            <Reveal key={project.id} delay={0.08 * i}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
          {featured.length === 0 && (
            <p className="font-mono text-sm text-zinc-600">
              No featured projects yet — add them from the admin panel.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
