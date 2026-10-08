import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import {
  LayoutDashboard,
  UserCog,
  FolderKanban,
  Wrench,
  Newspaper,
  Inbox,
  Images,
  ExternalLink,
} from "lucide-react";
import { authOptions } from "@/auth";
import { prisma } from "@/lib/db";
import { getAdminPath } from "@/lib/admin-path";
import { AdminSidebarMobile } from "../_components/sidebar-mobile";
import { SignOutButton } from "../_components/signout-button";

export const dynamic = "force-dynamic";
export const metadata = { robots: { index: false, follow: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const base = getAdminPath();
  if (!session) redirect(`${base}/login`);

  const NAV = [
    { href: base, label: "Dashboard", icon: LayoutDashboard },
    { href: `${base}/settings`, label: "Profile & Settings", icon: UserCog },
    { href: `${base}/projects`, label: "Projects", icon: FolderKanban },
    { href: `${base}/skills`, label: "Skills", icon: Wrench },
    { href: `${base}/blog`, label: "Articles", icon: Newspaper },
    { href: `${base}/moments`, label: "Events & Gallery", icon: Images },
    { href: `${base}/messages`, label: "Inbox", icon: Inbox },
  ];

  const unread = await prisma.message.count({ where: { status: "UNREAD" } });

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden w-60 shrink-0 border-r border-zinc-800 bg-black/40 md:block">
        <div className="sticky top-16 p-4">
          <p className="section-label px-2">{"// control panel"}</p>
          <nav className="mt-4 space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center justify-between border border-transparent px-3 py-2 font-mono text-sm text-zinc-400 transition-colors hover:border-zinc-800 hover:bg-base-400 hover:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4" /> {label}
                </span>
                {href === `${base}/messages` && unread > 0 && (
                  <span className="border border-accent/50 bg-accent/10 px-1.5 py-0.5 font-mono text-[10px] text-accent">
                    {unread}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-8 border-t border-zinc-800 pt-4">
            <p className="truncate px-3 font-mono text-[11px] text-zinc-600">
              {session.user?.email}
            </p>
            <Link
              href="/"
              className="mt-2 flex items-center gap-2 px-3 py-1.5 font-mono text-xs text-zinc-500 hover:text-accent"
            >
              <ExternalLink className="h-3.5 w-3.5" /> View site
            </Link>
            <SignOutButton />
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1 p-6 md:p-10">{children}</div>

      <AdminSidebarMobile items={NAV.map(({ href, label }) => ({ href, label }))} />
    </div>
  );
}
