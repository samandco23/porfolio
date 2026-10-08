"use client";

import { SiteText } from "@/components/site-content";

import { useMemo, useState } from "react";
import { ProjectsFilter, type FilterTag } from "./projects-filter";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/motion/reveal";

export type ExplorerProject = {
  slug: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  year?: string | null;
  featured: boolean;
  tagList: string[];
};

export function ProjectsExplorer({ projects }: { projects: ExplorerProject[] }) {
  const [active, setActive] = useState<string | null>(null);

  const tags = useMemo<FilterTag[]>(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      for (const tag of p.tagList) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 14)
      .map(([tag, count]) => ({ tag, count }));
  }, [projects]);

  const filtered = useMemo(
    () => (active ? projects.filter((p) => p.tagList.includes(active)) : projects),
    [projects, active],
  );

  return (
    <div>
      <ProjectsFilter
        tags={tags}
        active={active}
        onSelect={(tag) => setActive((prev) => (prev === tag ? null : tag))}
      />

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <Reveal key={project.slug} delay={Math.min(i, 6) * 0.06}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 font-mono text-sm text-zinc-600"><SiteText name="app.projects.projects-explorer.1" /></p>
      )}
    </div>
  );
}
