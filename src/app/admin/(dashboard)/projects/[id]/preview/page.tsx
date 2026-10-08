import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/utils";
import { getAdminPath } from "@/lib/admin-path";
import { ProjectDetail } from "@/components/project-detail";

export const dynamic = "force-dynamic";
export const metadata = { title: "Project preview", robots: { index: false, follow: false } };

export default async function PreviewProject({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) notFound();
  return <>
    <div className="border-b border-zinc-800 pb-4 font-mono text-sm text-zinc-400">
      Private preview · {project.status === "DRAFT" ? "Draft" : "Published"} ·{" "}
      <Link href={`${getAdminPath()}/projects/${id}`} className="text-accent hover:underline">Back to editor</Link>
    </div>
    <ProjectDetail project={{ ...project, tagList: parseTags(project.tags) }} preview />
  </>;
}
