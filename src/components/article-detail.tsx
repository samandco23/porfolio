
import { SiteText } from "@/components/site-content";
import Link from "next/link";
import type { Article } from "@prisma/client";
import { ArrowLeft, Eye } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Markdown } from "@/components/markdown";
import { TagList } from "@/components/tag-list";

export function ArticleDetail({ article, preview = false }: { article: Article & { tagList: string[] }; preview?: boolean }) {
  const date = article.publishedAt ?? article.createdAt;
  return <article className="mx-auto max-w-3xl px-6 py-16 md:py-24">
    {!preview && <Link href="/blog" className="inline-flex items-center gap-2 font-mono text-xs text-zinc-500 hover:text-accent">
      <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" /> <SiteText name="components.article-detail.1" /> </Link>}
    <header className="mt-8 border-b border-zinc-800 pb-8">
      <time dateTime={new Date(date).toISOString()} className="font-mono text-xs text-zinc-500">{formatDate(date)}</time>
      <h1 className="mt-3 font-mono text-3xl text-white md:text-4xl">{article.title}</h1>
      <p className="mt-4 text-lg text-zinc-400">{article.excerpt}</p>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <TagList tags={article.tagList} />
        {!preview && <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-zinc-500">
          <Eye aria-hidden="true" className="h-3.5 w-3.5" /> {article.views} <SiteText name="components.article-detail.2" /> </span>}
      </div>
    </header>
    {article.coverUrl && <div className="mt-10 border border-zinc-800">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={article.coverUrl} alt={article.title} width={1200} height={675} loading="lazy" className="aspect-video w-full object-cover" />
    </div>}
    <div className="mt-10"><Markdown content={article.content} /></div>
  </article>;
}
