"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, FolderGit2, Star } from "lucide-react";
import { TagList } from "@/components/tag-list";

type ProjectCardProject = {
  slug: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  year?: string | null;
  featured: boolean;
  tagList: string[];
};

export function ProjectCard({ project }: { project: ProjectCardProject }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div whileHover={reduceMotion ? undefined : { y: -4 }} transition={{ duration: 0.2 }} className="h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="group relative flex h-full flex-col border border-zinc-800 bg-[#0a0a0a] transition-colors duration-300 hover:border-[#00FF66]/50 hover:shadow-[0_0_30px_rgba(0,255,102,0.07)]"
      >
        {project.imageUrl ? (
          <div className="relative aspect-video overflow-hidden border-b border-zinc-800">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              // Admin image URLs can use any host; load directly until an asset host is configured.
              unoptimized
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
            />
          </div>
        ) : (
          <div className="grid-backdrop flex aspect-video items-center justify-center border-b border-zinc-800">
            <FolderGit2 className="h-8 w-8 text-zinc-700 transition-colors group-hover:text-[#00FF66]/70" />
          </div>
        )}

        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-mono text-base text-zinc-100 group-hover:text-white">
              {project.title}
            </h3>
            {project.featured && <Star className="h-3.5 w-3.5 shrink-0 text-[#00FF66]" />}
          </div>

          {project.year && (
            <p className="mt-1 font-mono text-[11px] text-zinc-600">{project.year}</p>
          )}

          <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400 line-clamp-3">
            {project.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <TagList tags={project.tagList.slice(0, 4)} />
            <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-700 transition-colors group-hover:text-[#00FF66]" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
