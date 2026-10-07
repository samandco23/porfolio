import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAdminPath } from "@/lib/admin-path";
import { ArticleEditor } from "../article-editor";

export const metadata = { title: "Admin — New article" };

export default function NewArticlePage() {
  const base = getAdminPath();

  return (
    <div className="max-w-4xl">
      <Link
        href={`${base}/blog`}
        className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-[#00FF66]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> back to articles
      </Link>
      <h1 className="mt-6 font-mono text-2xl text-white">New article</h1>
      <div className="mt-8">
        <ArticleEditor />
      </div>
    </div>
  );
}
