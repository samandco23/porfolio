
import { SiteText } from "@/components/site-content";
import Link from "next/link";
import type { Project } from "@prisma/client";
import { ArrowLeft, ExternalLink, Github, Eye } from "lucide-react";
import { Markdown } from "@/components/markdown";
import { TagList } from "@/components/tag-list";
import { parseProjectContent } from "@/lib/project-content";

type DetailProject = Project & { tagList: string[] };

export function ProjectDetail({ project, related = [], preview = false }: {
  project: DetailProject; related?: DetailProject[]; preview?: boolean;
}) {
  const { content, details } = parseProjectContent(project.content);
  const screenshots = details.screenshots.split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
  const sections = [
    { key: "project.challenge", content: details.challenge },
    { key: "project.approach", content: details.approach },
    { key: "project.outcome", content: details.outcome },
  ].filter((section) => section.content);

  return (
    <article className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      {!preview && <Link href="/projects" className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-[#00FF66]">
        <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" /> <SiteText name="components.project-detail.1" /> </Link>}
      <header className="mt-8">
        <p className="section-label">{project.year} {"//"} <SiteText name="components.project-detail.2" /> </p>
        <h1 className="mt-2 font-mono text-3xl text-white md:text-4xl">{project.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">{project.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <TagList tags={project.tagList} />
          {!preview && <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
            <Eye aria-hidden="true" className="h-3.5 w-3.5" /> {project.views} <SiteText name="components.project-detail.3" /> </span>}
        </div>
        {(project.repoUrl || project.demoUrl) && <div className="mt-8 flex flex-wrap gap-4">
          {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            <Github aria-hidden="true" className="h-4 w-4" /> <SiteText name="components.project-detail.4" /> </a>}
          {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <ExternalLink aria-hidden="true" className="h-4 w-4" /> <SiteText name="components.project-detail.5" /> </a>}
        </div>}
      </header>
      {project.imageUrl && <div className="mt-12 border border-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={project.imageUrl} alt={project.title} width={1200} height={675} loading="lazy" className="aspect-video w-full object-cover" />
      </div>}
      {sections.length > 0 && <div className="mt-12 border-t border-zinc-800">
        {sections.map((section, index) => <section key={section.key} className="grid gap-5 border-b border-zinc-800 py-8 sm:grid-cols-[180px_1fr]">
          <h2 className="font-mono text-base text-white"><span className="mr-3 text-[#00FF66]">0{index + 1}</span><SiteText name={section.key} /></h2>
          <Markdown content={section.content} />
        </section>)}
      </div>}
      {screenshots.length > 0 && <section className="mt-12">
        <h2 className="font-mono text-xl text-white"> <SiteText name="components.project-detail.6" /> </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {screenshots.map((url, index) => <figure key={`${index}-${url}`}>
            <a href={url} target="_blank" rel="noopener noreferrer" className="block border border-zinc-800 hover:border-[#00FF66]/50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt={`${project.title} — screenshot ${index + 1}`} width={960} height={600} loading="lazy" className="aspect-[8/5] w-full object-contain bg-black" />
            </a>
            <figcaption className="mt-2 font-mono text-xs text-zinc-500"> <SiteText name="components.project-detail.7" /> {index + 1} <SiteText name="components.project-detail.8" /> </figcaption>
          </figure>)}
        </div>
      </section>}
      {content && <div className="mt-12 border-t border-zinc-800 pt-10"><Markdown content={content} /></div>}
      {related.length > 0 && <section className="mt-20 border-t border-zinc-800 pt-10">
        <h2 className="section-label"> <SiteText name="components.project-detail.9" /> </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => <Link key={item.id} href={`/projects/${item.slug}`} className="group border border-zinc-800 bg-[#0a0a0a] p-5 transition-colors hover:border-[#00FF66]/50">
            <h3 className="font-mono text-sm text-zinc-200 group-hover:text-[#00FF66]">{item.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 line-clamp-2">{item.description}</p>
          </Link>)}
        </div>
      </section>}
    </article>
  );
}
