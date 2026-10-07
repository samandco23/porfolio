import { cache } from "react";
import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/utils";

/**
 * Public data-access layer.
 * All functions are cached per-request via React `cache`,
 * so the Profile row is read once per render pass no matter
 * how many components need it.
 */

export type PublicProfile = Awaited<ReturnType<typeof getProfile>>;

export const getProfile = cache(async () => {
  const profile = await prisma.profile.findUnique({
    where: { id: "default" },
    include: {
      socialLinks: { where: { isVisible: true }, orderBy: { order: "asc" } },
    },
  });
  return profile ?? null;
});

export const getFeaturedProjects = cache(async (take = 3) => {
  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take,
  });
  return rows.map((p) => ({ ...p, tagList: parseTags(p.tags) }));
});

export const getPublishedProjects = cache(async () => {
  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((p) => ({ ...p, tagList: parseTags(p.tags) }));
});

export const getProjectBySlug = cache(async (slug: string) => {
  const row = await prisma.project.findUnique({ where: { slug } });
  if (!row || row.status !== "PUBLISHED") return null;
  return { ...row, tagList: parseTags(row.tags) };
});

export const getVisibleSkills = cache(async () => {
  return prisma.skill.findMany({
    where: { isVisible: true },
    orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
  });
});

export const getPublishedArticles = cache(async () => {
  const rows = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((a) => ({ ...a, tagList: parseTags(a.tags) }));
});

export const getArticleBySlug = cache(async (slug: string) => {
  const row = await prisma.article.findUnique({ where: { slug } });
  if (!row || row.status !== "PUBLISHED") return null;
  return { ...row, tagList: parseTags(row.tags) };
});

/** All slugs for generateStaticParams. */
export async function getPublishedProjectSlugs() {
  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}

export async function getPublishedArticleSlugs() {
  const rows = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true },
  });
  return rows.map((r) => ({ slug: r.slug }));
}
