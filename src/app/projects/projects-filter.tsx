"use client";

import { SiteText } from "@/components/site-content";

import { cn } from "@/lib/utils";

export type FilterTag = { tag: string; count: number };

export function ProjectsFilter({
  tags,
  active,
  onSelect,
}: {
  tags: FilterTag[];
  active: string | null;
  onSelect: (tag: string) => void;
}) {
  if (!tags.length) return null;

  return (
    <div className="mt-8 flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(active ?? "")}
        className={cn(
          "border px-3 py-1 font-mono text-xs transition-colors",
          active === null
            ? "border-[#00FF66]/60 bg-[#00FF66]/10 text-[#00FF66]"
            : "border-zinc-800 text-zinc-500 hover:text-zinc-300",
        )}
      > <SiteText name="app.projects.projects-filter.1" /> </button>
      {tags.map(({ tag, count }) => (
        <button
          key={tag}
          onClick={() => onSelect(tag)}
          className={cn(
            "border px-3 py-1 font-mono text-xs transition-colors",
            active === tag
              ? "border-[#00FF66]/60 bg-[#00FF66]/10 text-[#00FF66]"
              : "border-zinc-800 text-zinc-500 hover:text-zinc-300",
          )}
        >
          {tag} <span className="text-zinc-700">{count}</span>
        </button>
      ))}
    </div>
  );
}
