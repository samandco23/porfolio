"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Terminal, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader({ alias, available }: { alias: string; available: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-[#050505]/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2 font-mono text-sm">
          <Terminal className="h-4 w-4 text-[#00FF66]" />
          <span className="text-zinc-300 transition-colors group-hover:text-white">
            <span className="text-[#00FF66]">~/$</span> {alias.toLowerCase().replace(/\s+/g, "_")}
          </span>
          <span className="hidden animate-blink text-[#00FF66] sm:inline">▊</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 font-mono text-xs tracking-widest transition-colors",
                isActive(link.href)
                  ? "text-[#00FF66]"
                  : "text-zinc-500 hover:text-zinc-200",
              )}
            >
              {isActive(link.href) && <span className="mr-1.5 text-[#00FF66]">/</span>}
              {link.label}
            </Link>
          ))}
          {available && (
            <span className="ml-3 inline-flex items-center gap-1.5 border border-[#00FF66]/40 bg-[#00FF66]/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[#00FF66]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF66] opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00FF66]" />
              </span>
              Open to work
            </span>
          )}
        </nav>

        <button
          className="text-zinc-400 hover:text-white md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-zinc-800 px-6 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block py-2 font-mono text-sm tracking-widest",
                isActive(link.href) ? "text-[#00FF66]" : "text-zinc-400",
              )}
            >
              <span className="mr-2 text-zinc-700">›</span>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
