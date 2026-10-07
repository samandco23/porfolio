import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github, Eye } from "lucide-react";
import { getProjectBySlug, getPublishedProjects } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { Markdown } from "@/components/markdown";
import { TagList } from "@/components/tag-list";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  // Fire-and-forget view counter
  prisma.project
    .update({ where: { id: project.id }, data: { views: { increment: 1 } } })
    .catch(() => undefined);

  const related = (await getPublishedProjects())
    .filter((p) => p.slug !== project.slug && p.tagList.some((t) => project.tagList.includes(t)))
    .slice(0, 3);

  return (
    <article className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-[#00FF66]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> cd ../projects
      </Link>

      <header className="mt-8">
        <p className="section-label">
          {project.year || new Date(project.createdAt).getFullYear()} {"//"} project
        </p>
        <h1 className="mt-2 font-mono text-3xl text-white md:text-4xl">{project.title}</h1>
        <p className="mt-4 max-w-2xl text-lg text-zinc-400">{project.description}</p>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <TagList tags={project.tagList} />
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-600">
            <Eye className="h-3.5 w-3.5" /> {project.views + 1} views
          </span>
        </div>

        {(project.repoUrl || project.demoUrl) && (
          <div className="mt-8 flex flex-wrap gap-4">
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                <Github className="h-4 w-4" /> Source code
              </a>
            )}
            {project.demoUrl && (
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <ExternalLink className="h-4 w-4" /> Live demo
              </a>
            )}
          </div>
        )}
      </header>

      {project.imageUrl && (
        <div className="mt-12 border border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.imageUrl}
            alt={project.title}
            width={1200}
            height={675}
            loading="lazy"
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      <div className="mt-12 border-t border-zinc-800 pt-10">
        <Markdown content={project.content || "_No content yet._"} />
      </div>

      {related.length > 0 && (
        <section className="mt-20 border-t border-zinc-800 pt-10">
          <p className="section-label">{"// related projects"}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/projects/${p.slug}`}
                className="group border border-zinc-800 bg-[#0a0a0a] p-5 transition-colors hover:border-[#00FF66]/50"
              >
                <h3 className="font-mono text-sm text-zinc-200 group-hover:text-[#00FF66]">
                  {p.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-zinc-500 line-clamp-2">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
