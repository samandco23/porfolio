"use client";

import { useEffect } from "react";

export function ViewTracker({ kind, slug }: { kind: "project" | "article"; slug: string }) {
  useEffect(() => {
    void fetch("/api/views", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, slug }), keepalive: true,
    }).catch(() => undefined);
  }, [kind, slug]);
  return null;
}
