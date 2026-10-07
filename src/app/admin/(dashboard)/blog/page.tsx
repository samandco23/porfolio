import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate, parseTags } from "@/lib/utils";
import { getAdminPath } from "@/lib/admin-path";
import { ArticleRow } from "./article-row";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Articles" };

export default async function AdminBlogPage() {
  const base = getAdminPath();

  const articles = await prisma.article.findMany({
    orderBy: [{ status: "asc" }, { publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="section-label">{"// content"}</p>
          <h1 className="mt-2 font-mono text-2xl text-white">Articles</h1>
        </div>
        <Link href={`${base}/blog/new`} className="btn-primary">
          <Plus className="h-4 w-4" /> New article
        </Link>
      </div>

      <div className="mt-8 space-y-2">
        {articles.length === 0 && (
          <p className="font-mono text-xs text-zinc-600">No articles yet.</p>
        )}
        {articles.map((a) => (
          <ArticleRow
            key={a.id}
            adminBase={base}
            article={{
              id: a.id,
              title: a.title,
              slug: a.slug,
              status: a.status,
              views: a.views,
              publishedAt: a.publishedAt ? formatDate(a.publishedAt) : null,
              tagList: parseTags(a.tags),
            }}
          />
        ))}
      </div>
    </div>
  );
}
