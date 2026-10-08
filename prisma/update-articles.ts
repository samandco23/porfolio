import type { PrismaClient } from "@prisma/client";
import { articlesContent } from "./articles";
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

  const [rows, settings] = await Promise.all([
    prisma.article.findMany({
      where: { slug: { in: articlesContent.map((article) => article.slug) } },
      select: { id: true, slug: true, title: true, excerpt: true, content: true, status: true },
    }),
    prisma.siteContent.findUnique({ where: { id: "default" } }),
  ]);
  const current = settings?.data && typeof settings.data === "object" && !Array.isArray(settings.data)
    ? settings.data as Record<string, string>
    : {};
  const copy = { ...DEFAULT_SITE_CONTENT, ...current };
  for (const row of rows) {
    const source = articlesContent.find((article) => article.slug === row.slug);
    if (!source) continue;
    for (const field of ["title", "excerpt", "content"] as const) {
      const key = `en:entity.article.${row.id}.${field}`;
      if (!(key in current) && row[field] === source[field]) copy[key] = source.en[field];
    }
  }
  await prisma.siteContent.upsert({
    where: { id: "default" },
    create: { id: "default", data: copy },
    update: { data: copy },
  });
  console.log(`Articles ready: ${rows.length} seeded topics, ${result.count} created, ${rows.filter((row) => row.status === "PUBLISHED").length} published. Admin edits preserved.`);
}
