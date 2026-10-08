import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { parseTags } from "@/lib/utils";
import { getAdminPath } from "@/lib/admin-path";
import { ArticleDetail } from "@/components/article-detail";

export const dynamic = "force-dynamic";
export const metadata = { title: "Article preview", robots: { index: false, follow: false } };

export default async function PreviewArticle({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) notFound();
  return <>
    <div className="border-b border-zinc-800 pb-4 font-mono text-sm text-zinc-400">
      Private preview · {article.status === "DRAFT" ? "Draft" : "Published"} ·{" "}
      <Link href={`${getAdminPath()}/blog/${id}`} className="text-[#00FF66] hover:underline">Back to editor</Link>
    </div>
    <ArticleDetail article={{ ...article, tagList: parseTags(article.tags) }} preview />
  </>;
}
