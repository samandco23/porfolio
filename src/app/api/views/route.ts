import { z } from "zod";
import { prisma } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

const viewSchema = z.object({
  kind: z.enum(["project", "article"]),
  slug: z.string().max(96).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export async function POST(request: Request) {
  // Counters are independent of the cached page render and never touch drafts.
  if (Number(request.headers.get("content-length")) > 1024) return new Response(null, { status: 413 });
  try {
    const parsed = viewSchema.safeParse(await request.json());
    if (!parsed.success) return new Response(null, { status: 400 });
    const ip = request.headers.get("x-real-ip")?.trim() || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (!ip) return new Response(null, { status: 204 });
    const { kind, slug } = parsed.data;
    const allowed = await rateLimit(`view:${ip}:${kind}:${slug}`, 1, 30 * 60 * 1000);
    if (allowed.ok) {
      const query = { where: { slug, status: "PUBLISHED" as const }, data: { views: { increment: 1 } } };
      if (kind === "project") await prisma.project.updateMany(query);
      else await prisma.article.updateMany(query);
    }
  } catch {
    // Analytics failures must not affect the reader's navigation.
    return new Response(null, { status: 503 });
  }
  return new Response(null, { status: 204 });
}
