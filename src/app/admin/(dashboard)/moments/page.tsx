import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminPath } from "@/lib/admin-path";
import { imageUploadConfigured } from "@/lib/integrations";
import { MomentEditor } from "./moment-editor";
import { MomentDelete } from "./moment-delete";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin — Events, memories & gallery" };
export default async function AdminMomentsPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  await requireAdmin();
  const { edit } = await searchParams;
  const moments = await prisma.moment.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
  const selected = moments.find((moment) => moment.id === edit);
  const base = getAdminPath();
  return <div className="max-w-4xl space-y-8">
    <div><p className="section-label">{"// moments"}</p><h1 className="mt-2 font-mono text-2xl text-white">Events, memories & gallery</h1><p className="mt-3 text-sm text-zinc-500">Publish events, tell a story or create a photo album. Drafts stay private.</p></div>
    <Link href={`${base}/moments`} className="btn-ghost">New moment</Link>
    <MomentEditor key={selected?.id ?? "new"} moment={selected ? { id: selected.id, title: selected.title, slug: selected.slug, kind: selected.kind, description: selected.description, content: selected.content, date: selected.date, location: selected.location, album: selected.album, coverUrl: selected.coverUrl, images: selected.images, status: selected.status, order: selected.order, featured: selected.featured } : undefined} adminBase={base} uploadEnabled={imageUploadConfigured()} />
    <div className="space-y-3">{moments.map((moment) => <div key={moment.id} className="flex flex-wrap items-center gap-4 border border-zinc-800 p-4">
      <div className="min-w-0 flex-1"><Link className="font-mono text-sm text-white hover:text-accent" href={`${base}/moments?edit=${moment.id}`}>{moment.title}</Link><p className="mt-1 font-mono text-xs text-zinc-500">{moment.kind} · {moment.status}{moment.date ? ` · ${moment.date}` : ""}</p></div>
      {moment.status === "PUBLISHED" && <Link href={`/moments/${moment.slug}`} className="text-xs text-accent">View public page →</Link>}
      <MomentDelete id={moment.id} title={moment.title} />
    </div>)}{!moments.length && <p className="text-sm text-zinc-500">No moments yet. Add your first event, memory or gallery above.</p>}</div>
  </div>;
}
