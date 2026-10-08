import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/utils";
import { getAdminPath } from "@/lib/admin-path";
import { ProjectEditor } from "../project-editor";
import { imageUploadConfigured } from "@/lib/integrations";
import { parseProjectContent } from "@/lib/project-content";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Edit project" };

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = getAdminPath();

  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();
  const { content, details } = parseProjectContent(project.content);

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href={`${base}/projects`}
          className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-accent"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> back to projects
        </Link>
        <a
          href={project.status === "DRAFT" ? `${base}/projects/${project.id}/preview` : `/projects/${project.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-zinc-600 hover:text-accent"
        >
          {project.status === "DRAFT" ? "preview draft →" : "view public page →"}
        </a>
      </div>

      <h1 className="mt-6 font-mono text-2xl text-white">{project.title}</h1>
      <p className="mt-1 font-mono text-xs text-zinc-600">/{project.slug}</p>

      <div className="mt-8">
        <ProjectEditor
          adminBase={base}
          uploadEnabled={imageUploadConfigured()}
          project={{
            id: project.id,
            title: project.title,
            slug: project.slug,
            description: project.description,
            content,
            ...details,
            imageUrl: project.imageUrl,
            repoUrl: project.repoUrl,
            demoUrl: project.demoUrl,
            tags: parseTags(project.tags).join(", "),
            featured: project.featured,
            status: project.status,
            year: project.year,
            order: project.order,
          }}
        />
      </div>
    </div>
  );
}
