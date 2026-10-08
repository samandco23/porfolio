import Link from "next/link";
import {
  FolderKanban,
  Newspaper,
  Inbox,
  Eye,
  ArrowRight,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { getAdminPath } from "@/lib/admin-path";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Dashboard" };

export default async function AdminDashboardPage() {
  const base = getAdminPath();

  const [projects, articles, skills, unread, totalMessages, recentMessages, topProjects, topArticles] =
    await Promise.all([
      prisma.project.count(),
      prisma.article.count(),
      prisma.skill.count(),
      prisma.message.count({ where: { status: "UNREAD" } }),
      prisma.message.count(),
      prisma.message.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.project.findMany({
        orderBy: { views: "desc" },
        take: 3,
        select: { title: true, slug: true, views: true },
      }),
      prisma.article.findMany({
        orderBy: { views: "desc" },
        take: 3,
        select: { title: true, slug: true, views: true },
      }),
    ]);

  const projectViews = await prisma.project.aggregate({ _sum: { views: true } });
  const articleViews = await prisma.article.aggregate({ _sum: { views: true } });
  const totalViews = (projectViews._sum.views ?? 0) + (articleViews._sum.views ?? 0);

  return (
    <div className="max-w-5xl">
      <p className="section-label">{"// system overview"}</p>
      <h1 className="mt-2 font-mono text-2xl text-white">Dashboard</h1>
      <p className="mt-1 font-mono text-xs text-zinc-600">{totalMessages} total messages received</p>

      {/* Stats grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={FolderKanban}
          label="Projects"
          value={projects}
          href={`${base}/projects`}
        />
        <StatCard icon={Newspaper} label="Articles" value={articles} href={`${base}/blog`} />
        <StatCard icon={Wrench} label="Skills" value={skills} href={`${base}/skills`} />
        <StatCard
          icon={Inbox}
          label="Unread messages"
          value={unread}
          href={`${base}/messages`}
          highlight={unread > 0}
        />
      </div>

      {/* Views */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="card-dark p-5">
          <div className="flex items-center justify-between">
            <p className="section-label">{"// total content views"}</p>
            <Eye className="h-4 w-4 text-zinc-600" />
          </div>
          <p className="mt-2 font-mono text-3xl text-accent">{totalViews}</p>
          <p className="mt-1 font-mono text-[11px] text-zinc-600">
            {projectViews._sum.views ?? 0} projects · {articleViews._sum.views ?? 0} articles
          </p>
        </div>
        <div className="card-dark p-5">
          <div className="flex items-center justify-between">
            <p className="section-label">{"// most viewed project"}</p>
            <TrendingUp className="h-4 w-4 text-zinc-600" />
          </div>
          {topProjects[0] ? (
            <Link
              href={`/projects/${topProjects[0].slug}`}
              className="mt-2 block font-mono text-lg text-zinc-200 hover:text-accent"
            >
              {topProjects[0].title}
            </Link>
          ) : (
            <p className="mt-2 font-mono text-sm text-zinc-600">—</p>
          )}
          <p className="mt-1 font-mono text-[11px] text-zinc-600">
            {topProjects[0]?.views ?? 0} views
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        {/* Recent messages */}
        <div className="card-dark">
          <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-3">
            <p className="section-label">{"// latest messages"}</p>
            <Link
              href={`${base}/messages`}
              className="inline-flex items-center gap-1 font-mono text-xs text-zinc-500 hover:text-accent"
            >
              inbox <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-zinc-800/60">
            {recentMessages.length === 0 && (
              <p className="px-5 py-4 font-mono text-xs text-zinc-600">No messages yet.</p>
            )}
            {recentMessages.map((m) => (
              <div key={m.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0">
                  <p className="truncate font-mono text-sm text-zinc-300">
                    {m.status === "UNREAD" && <span className="mr-2 text-accent">●</span>}
                    {m.name} <span className="text-zinc-600">— {m.subject || "(no subject)"}</span>
                  </p>
                </div>
                <span className="ml-4 shrink-0 font-mono text-[11px] text-zinc-600">
                  {formatDate(m.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top content */}
        <div className="card-dark">
          <div className="border-b border-zinc-800 px-5 py-3">
            <p className="section-label">{"// top content by views"}</p>
          </div>
          <div className="grid gap-0 sm:grid-cols-2 sm:divide-x sm:divide-zinc-800/60">
            <div className="p-5">
              <p className="font-mono text-[11px] uppercase text-zinc-600">Projects</p>
              <ul className="mt-3 space-y-2">
                {topProjects.map((p) => (
                  <li key={p.slug} className="flex justify-between font-mono text-xs">
                    <span className="truncate text-zinc-300">{p.title}</span>
                    <span className="ml-3 shrink-0 text-zinc-500">{p.views}</span>
                  </li>
                ))}
                {topProjects.length === 0 && <li className="font-mono text-xs text-zinc-600">—</li>}
              </ul>
            </div>
            <div className="p-5">
              <p className="font-mono text-[11px] uppercase text-zinc-600">Articles</p>
              <ul className="mt-3 space-y-2">
                {topArticles.map((a) => (
                  <li key={a.slug} className="flex justify-between font-mono text-xs">
                    <span className="truncate text-zinc-300">{a.title}</span>
                    <span className="ml-3 shrink-0 text-zinc-500">{a.views}</span>
                  </li>
                ))}
                {topArticles.length === 0 && <li className="font-mono text-xs text-zinc-600">—</li>}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  href: string;
  highlight?: boolean;
}) {
  return (
    <Link href={href} className="card-dark block p-5 transition-colors hover:border-zinc-600">
      <div className="flex items-center justify-between">
        <p className="font-mono text-[11px] uppercase tracking-wider text-zinc-500">{label}</p>
        <Icon className={`h-4 w-4 ${highlight ? "text-accent" : "text-zinc-600"}`} />
      </div>
      <p
        className={`mt-2 font-mono text-3xl ${
          highlight ? "text-accent text-glow" : "text-white"
        }`}
      >
        {value}
      </p>
    </Link>
  );
}
