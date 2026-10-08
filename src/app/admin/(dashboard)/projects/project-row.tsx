"use client";

import Link from "next/link";
import { useTransition } from "react";
import { Star, Trash2, Pencil, Eye } from "lucide-react";
import { deleteProject, toggleProjectFeatured } from "@/lib/actions/admin";

type Row = {
  id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  views: number;
  tagList: string[];
};

export function ProjectRow({ adminBase, project }: { adminBase: string; project: Row }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={`flex items-center gap-4 border bg-[#0a0a0a] px-4 py-3 ${
        project.status === "PUBLISHED" ? "border-zinc-800" : "border-dashed border-zinc-800"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link            href={`${adminBase}/projects/${project.id}`}
            className="truncate font-mono text-sm text-zinc-200 hover:text-[#00FF66]">
            {project.title}
          </Link>
          {project.status === "DRAFT" && (
            <span className="border border-zinc-700 px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-500">
              draft
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-600">
          /{project.slug} · {project.tagList.map((t) => `#${t}`).join(" ")}
        </p>
      </div>

      <span className="hidden items-center gap-1 font-mono text-[11px] text-zinc-600 sm:flex">
        <Eye className="h-3.5 w-3.5" /> {project.views}
      </span>

      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => toggleProjectFeatured(makeFd({ id: project.id })))}
        title="Toggle featured"
        aria-label={`Toggle ${project.title} featured status`}
        aria-pressed={project.featured}
        className={`p-1.5 ${project.featured ? "text-[#00FF66]" : "text-zinc-700 hover:text-zinc-400"}`}
      >
        <Star className="h-4 w-4" fill={project.featured ? "currentColor" : "none"} />
      </button>

      <Link
        href={`${adminBase}/projects/${project.id}`}
        className="p-1.5 text-zinc-600 hover:text-white"
        title="Edit"
        aria-label={`Edit ${project.title}`}
      >
        <Pencil className="h-4 w-4" />
      </Link>

      <form action={deleteProject} onSubmit={(event) => {
        if (!window.confirm(`Delete “${project.title}”? This cannot be undone.`)) event.preventDefault();
      }}>
        <input type="hidden" name="id" value={project.id} />
        <button type="submit" className="p-1.5 text-zinc-600 hover:text-red-400" title="Delete" aria-label={`Delete ${project.title}`}>
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function makeFd(obj: Record<string, string>) {
  const fd = new FormData();
  for (const [k, v] of Object.entries(obj)) fd.append(k, v);
  return fd;
}
