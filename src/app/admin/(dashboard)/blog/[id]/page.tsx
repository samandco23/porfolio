import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/db";
import { parseTags, toDateTimeLocalValue } from "@/lib/utils";
import { getAdminPath } from "@/lib/admin-path";
import { ArticleEditor } from "../article-editor";
import { imageUploadConfigured } from "@/lib/integrations";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Edit article" };

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const base = getAdminPath();

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between">
        <Link
          href={`${base}/blog`}
          className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-[#00FF66]"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> back to articles
        </Link>
        <a
          href={article.status === "DRAFT" ? `${base}/blog/${article.id}/preview` : `/blog/${article.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-zinc-600 hover:text-[#00FF66]"
        >
          {article.status === "DRAFT" ? "preview draft →" : "view public page →"}
        </a>
      </div>

      <h1 className="mt-6 font-mono text-2xl text-white">{article.title}</h1>
      <p className="mt-1 font-mono text-xs text-zinc-600">/{article.slug}</p>

      <div className="mt-8">
        <ArticleEditor
          adminBase={base}
          uploadEnabled={imageUploadConfigured()}
          article={{
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt,
            content: article.content,
            coverUrl: article.coverUrl,
            tags: parseTags(article.tags).join(", "),
            status: article.status,
            publishedAt: toDateTimeLocalValue(article.publishedAt),
          }}
        />
      </div>
    </div>
  );
}
