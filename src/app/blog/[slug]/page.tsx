import { notFound } from "next/navigation";
import { getArticleBySlug, getProfile } from "@/lib/localized-queries";
import { ArticleDetail } from "@/components/article-detail";
import { ViewTracker } from "@/components/view-tracker";
import { pageMetadata, serializeJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found", robots: { index: false } };
  return pageMetadata({ title: article.title, description: article.excerpt,
    path: `/blog/${article.slug}`, kind: "article", slug: article.slug,
    publishedAt: article.publishedAt ?? article.createdAt, updatedAt: article.updatedAt });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  const profile = await getProfile();
  const structuredData = {
    "@context": "https://schema.org", "@type": "BlogPosting",
    headline: article.title, description: article.excerpt,
    url: new URL(`/blog/${article.slug}`, profile?.siteUrl || getSiteUrl()).toString(),
    image: article.coverUrl || undefined,
    datePublished: new Date(article.publishedAt ?? article.createdAt).toISOString(),
    dateModified: new Date(article.updatedAt).toISOString(),
    author: profile?.fullName ? { "@type": "Person", name: profile.fullName } : undefined,
    keywords: article.tagList.join(", "),
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
    <ArticleDetail article={article} />
    <ViewTracker kind="article" slug={slug} />
  </>;
}
