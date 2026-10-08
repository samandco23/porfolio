"use client";
import { LocalizedLink as Link } from "@/components/localized-link";
import { ArrowUpRight } from "lucide-react";
import { ProjectCover } from "./project-cover";
import { TagList } from "./tag-list";
import { cn } from "@/lib/utils";

type ProjectCardProject = { slug: string; title: string; description: string; imageUrl?: string | null; year?: string | null; featured: boolean; tagList: string[] };
export function ProjectCard({ project, wide = false, index, headingLevel = 3 }: { project: ProjectCardProject; wide?: boolean; index?: number; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return <Link href={`/projects/${project.slug}`} className={cn("project-card group", wide && "project-card-wide")}>
    <ProjectCover title={project.title} slug={project.slug} imageUrl={project.imageUrl} tags={project.tagList} />
    <div className="project-card-copy">
      <div className="mb-4 flex items-center gap-3 font-mono text-xs text-zinc-400">{index !== undefined && <span>{String(index + 1).padStart(2, "0")}<span className="ml-3 text-zinc-700">/</span></span>}{project.year && <span>{project.year}</span>}</div>
      <Heading className="font-mono text-2xl leading-tight text-white transition-colors group-hover:text-accent md:text-3xl">{project.title}</Heading>
      <p className="mt-4 text-base leading-relaxed text-zinc-400 line-clamp-3">{project.description}</p>
      <div className="mt-6 flex items-end justify-between gap-4"><TagList tags={project.tagList.slice(0, 3)} /><span className="arrow-circle shrink-0" aria-hidden="true"><ArrowUpRight className="h-5 w-5" /></span></div>
    </div>
  </Link>;
}
