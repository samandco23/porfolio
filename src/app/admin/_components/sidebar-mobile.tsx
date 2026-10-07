"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function AdminSidebarMobile({ items }: { items: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-5 right-5 z-50 border border-[#00FF66]/50 bg-[#0a0a0a] p-3 text-[#00FF66] shadow-lg"
        aria-label="Admin menu"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div className="fixed inset-x-0 bottom-20 z-40 mx-5 border border-zinc-800 bg-[#0a0a0a] p-3 shadow-2xl">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block border-b border-zinc-800/60 px-3 py-2.5 font-mono text-sm text-zinc-300 last:border-0 hover:text-[#00FF66]"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
