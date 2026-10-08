import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminPath } from "@/lib/admin-path";
import { ProjectEditor } from "../project-editor";
import { imageUploadConfigured } from "@/lib/integrations";

export const metadata = { title: "Admin — New project" };

export default function NewProjectPage() {
  const base = getAdminPath();

  return (
    <div className="max-w-4xl">
      <Link
        href={`${base}/projects`}
        className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-accent"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> back to projects
      </Link>
      <h1 className="mt-6 font-mono text-2xl text-white">New project</h1>
      <div className="mt-8">
        <ProjectEditor adminBase={base} uploadEnabled={imageUploadConfigured()} />
      </div>
    </div>
  );
}
