import { connection } from "next/server";
import type { MetadataRoute } from "next";
import { getPublishedArticleSlugs, getPublishedProjectSlugs, getProfile, getPublishedMoments } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";
import { localizedPath } from "@/lib/locale-routes";
import { LOCALES } from "@/lib/preferences";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const profile = await getProfile();
  const siteUrl = profile?.siteUrl ? new URL(profile.siteUrl) : getSiteUrl();
  const [projects, articles, moments] = await Promise.all([
    getPublishedProjectSlugs(),
    getPublishedArticleSlugs(),
    getPublishedMoments(),
  ]);

  const paths: { path: string; updatedAt?: Date }[] = [
    ...["/", "/about", "/projects", "/blog", "/moments", "/contact"].map((path) => ({ path })),
    ...moments.map(({ slug, updatedAt }) => ({ path: `/moments/${encodeURIComponent(slug)}`, updatedAt })),
    ...projects.map(({ slug, updatedAt }) => ({ path: `/projects/${encodeURIComponent(slug)}`, updatedAt })),
    ...articles.map(({ slug, updatedAt }) => ({ path: `/blog/${encodeURIComponent(slug)}`, updatedAt })),
  ];
  return paths.flatMap(({ path, updatedAt }) => LOCALES.map((locale) => ({
    url: new URL(localizedPath(path, locale), siteUrl).toString(),
    lastModified: updatedAt,
    alternates: { languages: Object.fromEntries(LOCALES.map((language) => [language, new URL(localizedPath(path, language), siteUrl).toString()])) },
  })));
}
