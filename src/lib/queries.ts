import { publicCache } from "@/lib/public-cache";
import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/utils";

/**
 * Public data-access layer.
 * Public reads are cached across requests for five minutes and invalidated
 * after admin edits. React cache also deduplicates each render.
 */

export type PublicProfile = Awaited<ReturnType<typeof getProfile>>;

export const getProfile = publicCache("getProfile", async () => {
  const profile = await prisma.profile.findUnique({
    where: { id: "default" },
    include: {
      socialLinks: { where: { isVisible: true }, orderBy: { order: "asc" } },
    },
  });
  return profile ?? null;
});

export const getFeaturedProjects = publicCache("getFeaturedProjects", async (take: number = 3) => {
  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED", featured: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    take,
  });
  return rows.map((p) => ({ ...p, tagList: parseTags(p.tags) }));
});

export const getHomeProjects = publicCache("getHomeProjects", async (take: number = 3) => {
  const featured = await getFeaturedProjects(take);
  if (featured.length > 0) return { projects: featured, hasFeatured: true };

  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take,
  });
  return {
    projects: rows.map((p) => ({ ...p, tagList: parseTags(p.tags) })),
    hasFeatured: false,
  };
});

export const getPublishedProjects = publicCache("getPublishedProjects", async () => {
  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return rows.map((p) => ({ ...p, tagList: parseTags(p.tags) }));
});

export const getProjectBySlug = publicCache("getProjectBySlug", async (slug: string) => {
  const row = await prisma.project.findUnique({ where: { slug } });
  if (!row || row.status !== "PUBLISHED") return null;
  return { ...row, tagList: parseTags(row.tags) };
});

export const getVisibleSkills = publicCache("getVisibleSkills", async () => {
  return prisma.skill.findMany({
    where: { isVisible: true },
    orderBy: [{ category: "asc" }, { order: "asc" }, { name: "asc" }],
  });
});

export const getPublishedArticles = publicCache("getPublishedArticles", async () => {
  const rows = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return rows.map((a) => ({ ...a, tagList: parseTags(a.tags) }));
});

export const getArticleBySlug = publicCache("getArticleBySlug", async (slug: string) => {
  const row = await prisma.article.findUnique({ where: { slug } });
  if (!row || row.status !== "PUBLISHED") return null;
  return { ...row, tagList: parseTags(row.tags) };
});

/** All slugs for generateStaticParams. */
export const getPublishedProjectSlugs = publicCache("project-sitemap", async () => {
  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
  return rows.map((r) => ({ slug: r.slug, updatedAt: r.updatedAt }));
});

export const getPublishedArticleSlugs = publicCache("article-sitemap", async () => {
  const rows = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });
  return rows.map((r) => ({ slug: r.slug, updatedAt: r.updatedAt }));
});

export const getSiteContent = publicCache("site-content-v1", async () => {
  const { resolveSiteContent } = await import("@/lib/site-content");
  const row = await prisma.siteContent.findUnique({ where: { id: "default" } });
  const copy = resolveSiteContent(row?.data);
  if (!Object.keys(copy).some((key) => key.includes(":entity."))) return copy;
  const [projects, articles, moments] = await Promise.all([
    prisma.project.findMany({ where: { status: "PUBLISHED" }, select: { id: true } }),
    prisma.article.findMany({ where: { status: "PUBLISHED" }, select: { id: true } }),
    prisma.moment.findMany({ where: { status: "PUBLISHED" }, select: { id: true } }),
  ]);
  const { publicTranslations } = await import("./translations");
  return publicTranslations(copy, { project: new Set(projects.map((p) => p.id)), article: new Set(articles.map((a) => a.id)), moment: new Set(moments.map((m) => m.id)) });
});

export const getPublishedMoments = publicCache("published-moments", async (take?: number) => {
  return prisma.moment.findMany({ where: { status: "PUBLISHED" }, orderBy: [{ order: "asc" }, { createdAt: "desc" }], ...(take ? { take } : {}) });
});
export const getFeaturedMoments = publicCache("featured-moments", async () => {
  return prisma.moment.findMany({ where: { status: "PUBLISHED", featured: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }], take: 3 });
});
export const getMomentBySlug = publicCache("moment-by-slug", async (slug: string) => {
  const row = await prisma.moment.findUnique({ where: { slug } });
  return row?.status === "PUBLISHED" ? row : null;
});
