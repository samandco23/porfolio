
import { SiteText } from "@/components/site-content";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { getPublishedArticles, getSiteContent } from "@/lib/localized-queries";
import { formatDate } from "@/lib/utils";
import { TagList } from "@/components/tag-list";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata() {
  const copy = await getSiteContent();
  return pageMetadata({ title: copy["seo.blog.title"], description: copy["seo.blog.description"], path: "/blog" });
}

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <p className="section-label">03 {"//"} <SiteText name="app.blog.page.1" /> </p>
      <h1 className="mt-2 font-mono text-3xl text-white md:text-4xl"> <SiteText name="app.blog.page.2" /> </h1>

      <div className="mt-12 space-y-0 border-t border-zinc-800">
        {articles.map((article, i) => (
          <Reveal key={article.id} delay={Math.min(i, 6) * 0.05}>
            <article className="group border-b border-zinc-800 py-8">
              <Link href={`/blog/${article.slug}`} className="block">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-mono text-xl text-zinc-100 transition-colors group-hover:text-accent">
                    {article.title}
                  </h2>
                  <time className="font-mono text-xs text-zinc-600">
                    {formatDate(article.publishedAt ?? article.createdAt)}
                  </time>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{article.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <TagList tags={article.tagList.slice(0, 5)} />
                  <span className="font-mono text-xs text-zinc-600 group-hover:text-zinc-400"> <SiteText name="app.blog.page.3" /> </span>
                </div>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="mt-12 font-mono text-sm text-zinc-600"><SiteText name="app.blog.page.4" /></p>
      )}
    </div>
  );
}
