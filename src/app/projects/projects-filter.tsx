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
        aria-pressed={active === null}
        onClick={() => onSelect(active ?? "")}
        className={cn(
          "min-h-11 rounded-sm border px-4 py-2 font-mono text-xs transition-colors",
          active === null
            ? "border-accent/60 bg-accent/10 text-accent"
            : "border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
        )}
      > <SiteText name="app.projects.projects-filter.1" /> </button>
      {tags.map(({ tag, count }) => (
        <button
          key={tag}
          aria-pressed={active === tag}
          onClick={() => onSelect(tag)}
          className={cn(
            "min-h-11 rounded-sm border px-4 py-2 font-mono text-xs transition-colors",
            active === tag
              ? "border-accent/60 bg-accent/10 text-accent"
              : "border-zinc-800 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200",
          )}
        >
          {tag} <span className="text-zinc-400">{count}</span>
        </button>
      ))}
    </div>
  );
}
