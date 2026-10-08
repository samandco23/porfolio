
import { SiteText } from "@/components/site-content";
import { pageMetadata } from "@/lib/seo";
import { LocalizedLink as Link } from "@/components/localized-link";
import { getPublishedArticles, getSiteContent } from "@/lib/localized-queries";
import { formatDate } from "@/lib/utils";
import { TagList } from "@/components/tag-list";
import { PageHeading } from "@/components/page-heading";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata() {
  const copy = await getSiteContent();
  return pageMetadata({ title: copy["seo.blog.title"], description: copy["seo.blog.description"], path: "/blog" });
}

export default async function BlogPage() {
  const articles = await getPublishedArticles();

  return (
    <div className="page-shell section-space">
      <PageHeading label={<SiteText name="app.blog.page.1" />} title={<SiteText name="app.blog.page.2" />} description={<SiteText name="redesign.blogIntro" />} />

      <div className="mt-12 space-y-0 border-t border-zinc-800">
        {articles.map((article, i) => (
          <Reveal key={article.id} delay={Math.min(i, 6) * 0.05}>
            <article className="group border-b border-zinc-800 py-10">
              <Link href={`/blog/${article.slug}`} className="block">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="font-mono text-2xl text-zinc-100 md:text-3xl transition-colors group-hover:text-accent">
                    {article.title}
                  </h2>
                  <time className="font-mono text-xs text-zinc-400">
                    {formatDate(article.publishedAt ?? article.createdAt)}
                  </time>
                </div>
                <p className="mt-3 max-w-3xl text-base leading-relaxed text-zinc-400">{article.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <TagList tags={article.tagList.slice(0, 5)} />
                  <span className="inline-flex items-center gap-3 font-mono text-xs text-zinc-400 group-hover:text-accent"> <SiteText name="app.blog.page.3" stripArrow /><ArrowUpRight aria-hidden="true" className="h-5 w-5" /> </span>
                </div>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>

      {articles.length === 0 && (
        <p className="empty-editorial mt-12"><SiteText name="app.blog.page.4" /></p>
      )}
    </div>
  );
}
