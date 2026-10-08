
import { SiteText } from "@/components/site-content";
import { pageMetadata } from "@/lib/seo";
import { Mail, FileDown } from "lucide-react";
import { getProfile, getVisibleSkills, getSiteContent } from "@/lib/queries";
import { SKILL_CATEGORIES } from "@/lib/constants";
import { Markdown } from "@/components/markdown";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata() {
  const copy = await getSiteContent();
  return pageMetadata({ title: copy["seo.about.title"], description: copy["seo.about.description"], path: "/about" });
}

export default async function AboutPage() {
  const [profile, skills, content] = await Promise.all([getProfile(), getVisibleSkills(), getSiteContent()]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <Reveal>
        <p className="section-label">00 {"//"} <SiteText name="app.about.page.1" /> </p>
        <h1 className="mt-2 font-mono text-3xl text-white md:text-4xl"> <SiteText name="app.about.page.2" /> </h1>
      </Reveal>

      <div className="mt-10 grid gap-10 md:grid-cols-[2fr_1fr]">
        <div>
          <Reveal delay={0.08}>
            <Markdown content={profile?.longBio || content["app.about.page.3"]} />
          </Reveal>

          {profile?.resumeUrl && (
            <Reveal delay={0.12}>
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8">
                <FileDown className="h-4 w-4" /> <SiteText name="app.about.page.4" /> </a>
            </Reveal>
          )}
        </div>

        <Reveal delay={0.16}>
          <aside className="card-dark h-fit p-5">
            {profile?.avatarUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                width={640}
                height={640}
                loading="lazy"
                className="mb-4 aspect-square w-full border border-zinc-800 object-cover"
              />
            ) : (
              <div className="grid-backdrop mb-4 flex aspect-square items-center justify-center border border-zinc-800">
                <span className="font-mono text-4xl text-[#00FF66]/70">
                  {profile?.fullName?.slice(0, 1).toUpperCase() ?? "?"}
                </span>
              </div>
            )}
            <dl className="space-y-3 font-mono text-xs">
              {profile?.location && (
                <div>
                  <dt className="text-zinc-600"> <SiteText name="app.about.page.5" /> </dt>
                  <dd className="mt-0.5 text-zinc-300">{profile.location}</dd>
                </div>
              )}
              <div>
                <dt className="text-zinc-600"> <SiteText name="app.about.page.6" /> </dt>
                <dd className="mt-0.5">
                  <a href={`mailto:${profile?.email}`} className="text-[#00FF66] hover:underline">
                    {profile?.email}
                  </a>
                </dd>
              </div>
              {profile?.phone && (
                <div>
                  <dt className="text-zinc-600"> <SiteText name="app.about.page.7" /> </dt>
                  <dd className="mt-0.5">
                    <a href={`tel:${profile.phone.replace(/[^\d+]/g, "")}`} className="text-[#00FF66] hover:underline">
                      {profile.phone}
                    </a>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-zinc-600"> <SiteText name="app.about.page.8" /> </dt>
                <dd className={profile?.available ? "text-[#00FF66]" : "text-zinc-500"}>
                  {profile?.available ? <SiteText name="app.about.page.11" /> : <SiteText name="app.about.page.12" />}
                </dd>
              </div>
            </dl>

            {profile?.email && (
              <a href={`mailto:${profile.email}`} className="btn-ghost mt-5 w-full justify-center">
                <Mail className="h-4 w-4" /> <SiteText name="app.about.page.13" /> </a>
            )}
          </aside>
        </Reveal>
      </div>

      {/* ── SKILLS ─────────────────────────────────────────── */}
      <section id="skills" className="mt-20 scroll-mt-24">
        <Reveal>
          <p className="section-label">01 {"//"} <SiteText name="app.about.page.14" /> </p>
          <h2 className="mt-2 font-mono text-2xl text-white"> <SiteText name="app.about.page.15" /> </h2>
        </Reveal>

        <div className="mt-8 space-y-10">
          {SKILL_CATEGORIES.map((category) => {
            const group = skills.filter((s) => s.category === category);
            if (!group.length) return null;

            return (
              <Reveal key={category} delay={0.05}>
                <div>
                  <h3 className="font-mono text-micro uppercase tracking-[0.18em] text-[#00FF66]">
                    <SiteText name={`category.${category}`} />
                  </h3>
                  <div className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {group.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between font-mono text-xs">
                          <span className="text-zinc-300">{skill.name}</span>
                          {skill.level !== null && <span className="text-zinc-600">{skill.level}%</span>}
                        </div>
                        {skill.level !== null && <div className="mt-1.5 h-px bg-zinc-800">
                          <div
                            className="h-px bg-[#00FF66]/70"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>}
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
          {skills.length === 0 && (
            <p className="font-mono text-sm text-zinc-600"> <SiteText name="app.about.page.16" /> </p>
          )}
        </div>
      </section>
    </div>
  );
}
