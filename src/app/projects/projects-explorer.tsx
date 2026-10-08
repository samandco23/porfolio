"use client";

import { SiteText } from "@/components/site-content";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ProjectsFilter, type FilterTag } from "./projects-filter";
import { ProjectCard } from "@/components/project-card";

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
  const reduceMotion = useReducedMotion();

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

      <p className="mt-6 font-mono text-xs text-zinc-400" role="status">{filtered.length} <SiteText name="redesign.projectsCount" /></p>
      <div className="mt-10 grid gap-x-8 gap-y-12 md:grid-cols-2">
        <AnimatePresence initial={false} mode="popLayout">
          {filtered.map((project, i) => <motion.div
            key={project.slug}
            layout={reduceMotion ? false : "position"}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8, transition: { duration: 0.16 } }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.34, delay: Math.min(i, 4) * 0.035, ease: [0.22, 1, 0.36, 1] }}
          ><ProjectCard project={project} index={i} headingLevel={2} /></motion.div>)}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 font-mono text-sm text-zinc-600"><SiteText name="app.projects.projects-explorer.1" /></p>
      )}
    </div>
  );
}
