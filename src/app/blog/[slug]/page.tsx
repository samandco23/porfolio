import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import { getArticleBySlug } from "@/lib/queries";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { Markdown } from "@/components/markdown";
import { TagList } from "@/components/tag-list";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  prisma.article
    .update({ where: { id: article.id }, data: { views: { increment: 1 } } })
    .catch(() => undefined);

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-[#00FF66]"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> cd ../blog
      </Link>

      <header className="mt-8 border-b border-zinc-800 pb-8">
        <time className="font-mono text-xs text-zinc-600">
          {formatDate(article.publishedAt ?? article.createdAt)}
        </time>
        <h1 className="mt-3 font-mono text-3xl text-white md:text-4xl">{article.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <TagList tags={article.tagList} />
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-600">
            <Eye className="h-3.5 w-3.5" /> {article.views + 1} views
          </span>
        </div>
      </header>

      {article.coverUrl && (
        <div className="mt-10 border border-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverUrl}
            alt={article.title}
            width={1200}
            height={675}
            loading="lazy"
            className="aspect-video w-full object-cover"
          />
        </div>
      )}

      <div className="prose-dark mt-10">
        <Markdown content={article.content} />
      </div>
    </article>
  );
}
