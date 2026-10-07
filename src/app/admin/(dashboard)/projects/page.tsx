import Link from "next/link";
import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/utils";
import { getAdminPath } from "@/lib/admin-path";
import { ProjectRow } from "./project-row";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Projects" };

export default async function AdminProjectsPage() {
  const base = getAdminPath();

  const projects = await prisma.project.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label">{"// content"}</p>
          <h1 className="mt-2 font-mono text-2xl text-white">Projects</h1>
        </div>
        <Link href={`${base}/projects/new`} className="btn-primary">
          <Plus className="h-4 w-4" /> New project
        </Link>
      </div>

      <div className="mt-8 space-y-2">
        {projects.length === 0 && (
          <p className="font-mono text-xs text-zinc-600">
            No projects yet. Create your first one.
          </p>
        )}
        {projects.map((p) => (
          <ProjectRow
            key={p.id}
            adminBase={base}
            project={{
              id: p.id,
              title: p.title,
              slug: p.slug,
              status: p.status,
              featured: p.featured,
              views: p.views,
              tagList: parseTags(p.tags),
            }}
          />
        ))}
      </div>
    </div>
  );
}
