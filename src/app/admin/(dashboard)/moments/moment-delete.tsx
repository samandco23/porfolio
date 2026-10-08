"use client";
import { deleteMoment } from "@/lib/actions/admin";
export function MomentDelete({ id, title }: { id: string; title: string }) {
  return <form action={deleteMoment} onSubmit={(event) => { if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) event.preventDefault(); }}><input type="hidden" name="id" value={id} /><button className="text-xs text-red-400">Delete</button></form>;
}
