"use client";

import { useState } from "react";
import { MailOpen, Mail, Archive, Trash2, RotateCcw } from "lucide-react";
import { setMessageState, deleteMessage } from "@/lib/actions/admin";

type MessageRecord = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  body: string;
  status: string;
  createdAt: string;
};

export function MessageCard({ message }: { message: MessageRecord }) {
  const [expanded, setExpanded] = useState(false);
  const unread = message.status === "UNREAD";

  return (
    <div
      className={`border bg-[#0a0a0a] ${
        unread ? "border-[#00FF66]/40" : "border-zinc-800"
      }`}
    >
      <button
        type="button"
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left"
      >
        <span className={`h-2 w-2 shrink-0 rounded-full ${unread ? "bg-[#00FF66]" : "bg-zinc-700"}`} />
        <div className="min-w-0 flex-1">
          <p className={`truncate font-mono text-sm ${unread ? "text-white" : "text-zinc-400"}`}>
            {message.name} <span className="text-zinc-600">· {message.subject || "(no subject)"}</span>
          </p>
          <p className="truncate font-mono text-[11px] text-zinc-600">
            {message.email} · {message.createdAt}
          </p>
        </div>
        <span className="font-mono text-[10px] uppercase text-zinc-600">{message.status}</span>
      </button>

      {expanded && (
        <div className="border-t border-zinc-800 px-4 py-4">
          <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-zinc-300">
            {message.body}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {unread ? (
              <ActionForm
                action={setMessageState}
                fields={{ id: message.id, state: "READ" }}
                label="Mark read"
                icon={<MailOpen className="h-3.5 w-3.5" />}
              />
            ) : (
              message.status !== "ARCHIVED" && (
                <ActionForm
                  action={setMessageState}
                  fields={{ id: message.id, state: "UNREAD" }}
                  label="Mark unread"
                  icon={<Mail className="h-3.5 w-3.5" />}
                />
              )
            )}
            {message.status !== "ARCHIVED" ? (
              <ActionForm
                action={setMessageState}
                fields={{ id: message.id, state: "ARCHIVED" }}
                label="Archive"
                icon={<Archive className="h-3.5 w-3.5" />}
              />
            ) : (
              <ActionForm
                action={setMessageState}
                fields={{ id: message.id, state: "UNREAD" }}
                label="Restore"
                icon={<RotateCcw className="h-3.5 w-3.5" />}
              />
            )}
            <ActionForm
              action={deleteMessage}
              fields={{ id: message.id }}
              label="Delete"
              icon={<Trash2 className="h-3.5 w-3.5" />}
              danger
            />
            <a href={`mailto:${message.email}?subject=Re: ${encodeURIComponent(message.subject ?? "")}`} className="btn-ghost px-3 py-1.5 text-xs">
              Reply
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function ActionForm({
  action,
  fields,
  label,
  icon,
  danger,
}: {
  action: (formData: FormData) => Promise<void>;
  fields: Record<string, string>;
  label: string;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <form action={action} onSubmit={(event) => {
      if (danger && !window.confirm("Delete this message? This cannot be undone.")) event.preventDefault();
    }}>
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button
        type="submit"
        className={`inline-flex items-center gap-1.5 border px-3 py-1.5 font-mono text-xs transition-colors ${
          danger
            ? "border-red-900/60 text-red-400 hover:bg-red-950/40"
            : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white"
        }`}
      >
        {icon} {label}
      </button>
    </form>
  );
}
