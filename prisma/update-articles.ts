import type { PrismaClient } from "@prisma/client";
import { articlesContent, baseArticlesContent } from "./articles";
import { DEFAULT_SITE_CONTENT } from "../src/lib/site-content";

/** Add missing articles and translations without changing edits made in the admin panel. */
export async function updateArticles(prisma: PrismaClient) {
  const publishedAt = Date.now();
  const result = await prisma.article.createMany({
    data: articlesContent.map((article, index) => ({
      slug: article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      tags: JSON.stringify(article.tags),
      status: "PUBLISHED" as const,
      publishedAt: new Date(publishedAt - index * 60_000),
    })),
    skipDuplicates: true,
  });

  const [initialRows, settings] = await Promise.all([
    prisma.article.findMany({
      where: { slug: { in: articlesContent.map((article) => article.slug) } },
      select: { id: true, slug: true, title: true, excerpt: true, content: true, status: true },
    }),
    prisma.siteContent.findUnique({ where: { id: "default" } }),
  ]);
  let rows = initialRows;
  // Upgrade only untouched v1 seed copy. Admin-authored edits keep priority.
  for (const row of rows) {
    const previous = baseArticlesContent.find((article) => article.slug === row.slug);
    const current = articlesContent.find((article) => article.slug === row.slug);
    if (previous && current && row.content === previous.content) {
      await prisma.article.updateMany({ where: { id: row.id, content: previous.content }, data: { content: current.content } });
    }
  }
  rows = await prisma.article.findMany({
    where: { slug: { in: articlesContent.map((article) => article.slug) } },
    select: { id: true, slug: true, title: true, excerpt: true, content: true, status: true },
  });
  const current = settings?.data && typeof settings.data === "object" && !Array.isArray(settings.data)
    ? settings.data as Record<string, string>
    : {};
  const copy = { ...DEFAULT_SITE_CONTENT, ...current };
  for (const row of rows) {
    const source = articlesContent.find((article) => article.slug === row.slug);
    if (!source) continue;
    for (const field of ["title", "excerpt", "content"] as const) {
      const key = `en:entity.article.${row.id}.${field}`;
      const previous = baseArticlesContent.find((article) => article.slug === row.slug);
      if (field === "content" && previous && current[key] === previous.en.content && row.content === source.content) copy[key] = source.en.content;
      else if (!(key in current) && row[field] === source[field]) copy[key] = source.en[field];
    }
  }
  await prisma.siteContent.upsert({
    where: { id: "default" },
    create: { id: "default", data: copy },
    update: { data: copy },
  });
  console.log(`Articles ready: ${rows.length} seeded topics, ${result.count} created, ${rows.filter((row) => row.status === "PUBLISHED").length} published. Admin edits preserved.`);
}
