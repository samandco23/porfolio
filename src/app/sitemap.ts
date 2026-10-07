import type { MetadataRoute } from "next";
import { getPublishedArticleSlugs, getPublishedProjectSlugs } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const [projects, articles] = await Promise.all([
    getPublishedProjectSlugs(),
    getPublishedArticleSlugs(),
  ]);

  const pages: MetadataRoute.Sitemap = ["", "/about", "/projects", "/blog", "/contact"].map(
    (path) => ({
      url: new URL(path, siteUrl).toString(),
    }),
  );

  return [
    ...pages,
    ...projects.map(({ slug }) => ({
      url: new URL(`/projects/${encodeURIComponent(slug)}`, siteUrl).toString(),
    })),
    ...articles.map(({ slug }) => ({
      url: new URL(`/blog/${encodeURIComponent(slug)}`, siteUrl).toString(),
    })),
  ];
}
