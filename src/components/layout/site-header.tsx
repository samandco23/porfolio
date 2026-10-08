"use client";

import { SiteText, useSiteContent } from "@/components/site-content";

import { PreferenceControls } from "./preference-controls";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Terminal, Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader({ alias, available }: { alias: string; available: boolean }) {
  const content = useSiteContent();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-base-950/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2 font-mono text-sm">
          <Terminal className="hidden h-4 w-4 text-accent sm:block" />
          <span className="max-w-24 truncate text-zinc-300 transition-colors group-hover:text-white sm:max-w-none">
            <span className="text-accent">~/$</span> {alias.toLowerCase().replace(/\s+/g, "_")}
          </span>
          <span className="hidden animate-blink text-accent sm:inline">▊</span>
        </Link>

        <nav className="hidden items-center gap-1 xl:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "px-3 py-1.5 font-mono text-xs tracking-widest transition-colors",
                isActive(link.href)
                  ? "text-accent"
                  : "text-zinc-500 hover:text-zinc-200",
              )}
            >
              {isActive(link.href) && <span className="mr-1.5 text-accent">/</span>}
              {content[`nav.${link.href}`] ?? link.label}
            </Link>
          ))}
          {available && (
            <span className="ml-3 inline-flex items-center gap-1.5 border border-accent/40 bg-accent/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-accent">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span> <SiteText name="components.layout.site-header.2" /> </span>
          )}
        </nav>

        <div className="flex items-center gap-3">
        <PreferenceControls />
        <button
          className="text-zinc-400 hover:text-white xl:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={content["preferences.menu"]}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-navigation" className="border-t border-zinc-800 px-6 py-4 xl:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                "block py-2 font-mono text-sm tracking-widest",
                isActive(link.href) ? "text-accent" : "text-zinc-400",
              )}
            >
              <span className="mr-2 text-zinc-700">›</span>
              {content[`nav.${link.href}`] ?? link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
