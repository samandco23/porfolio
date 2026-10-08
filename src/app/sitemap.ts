import { connection } from "next/server";
import type { MetadataRoute } from "next";
import { getPublishedArticleSlugs, getPublishedProjectSlugs, getProfile, getPublishedMoments } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const profile = await getProfile();
  const siteUrl = profile?.siteUrl ? new URL(profile.siteUrl) : getSiteUrl();
  const [projects, articles, moments] = await Promise.all([
    getPublishedProjectSlugs(),
    getPublishedArticleSlugs(),
    getPublishedMoments(),
  ]);

  const pages: MetadataRoute.Sitemap = ["", "/about", "/projects", "/blog", "/moments", "/contact"].map(
    (path) => ({
      url: new URL(path, siteUrl).toString(),
    }),
  );

  return [
    ...pages,
    ...moments.map(({ slug, updatedAt }) => ({ url: new URL(`/moments/${encodeURIComponent(slug)}`, siteUrl).toString(), lastModified: updatedAt })),
    ...projects.map(({ slug, updatedAt }) => ({
      url: new URL(`/projects/${encodeURIComponent(slug)}`, siteUrl).toString(),
      lastModified: updatedAt,
    })),
    ...articles.map(({ slug, updatedAt }) => ({
      url: new URL(`/blog/${encodeURIComponent(slug)}`, siteUrl).toString(),
      lastModified: updatedAt,
    })),
  ];
}
