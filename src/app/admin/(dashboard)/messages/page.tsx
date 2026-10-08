import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";
import { getAdminPath } from "@/lib/admin-path";
import { MessageCard } from "./message-card";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Inbox" };

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const base = getAdminPath();
  const { filter: requestedFilter } = await searchParams;
  const filter = requestedFilter ?? "UNREAD";
  const where =
    filter === "ALL"
      ? {}
      : filter === "ARCHIVED"
        ? { status: "ARCHIVED" as const }
        : filter === "READ"
          ? { status: "READ" as const }
          : { status: "UNREAD" as const };

  const messages = await prisma.message.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  const [unreadCount, totalCount] = await Promise.all([
    prisma.message.count({ where: { status: "UNREAD" } }),
    prisma.message.count(),
  ]);

  return (
    <div className="max-w-4xl">
      <p className="section-label">{"// inbox"}</p>
      <h1 className="mt-2 font-mono text-2xl text-white">Messages</h1>
      <p className="mt-2 font-mono text-xs text-zinc-600">
        {unreadCount} unread · {totalCount} total
      </p>

      <div className="mt-6 flex gap-2">
        {["UNREAD", "READ", "ARCHIVED", "ALL"].map((f) => (
          <a
            key={f}
            href={`${base}/messages?filter=${f}`}
            className={`border px-3 py-1 font-mono text-xs ${
              filter === f
                ? "border-accent/60 bg-accent/10 text-accent"
                : "border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {f.toLowerCase()}
          </a>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {messages.length === 0 && (
          <p className="font-mono text-xs text-zinc-600">Nothing here.</p>
        )}
        {messages.map((m) => (
          <MessageCard
            key={m.id}
            message={{
              id: m.id,
              name: m.name,
              email: m.email,
              subject: m.subject,
              body: m.body,
              status: m.status,
              createdAt: formatDate(m.createdAt),
            }}
          />
        ))}
      </div>
    </div>
  );
}
