"use client";
import { useSiteContent } from "@/components/site-content";
import { PreferenceControls } from "./preference-controls";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SiteHeader({ alias }: { alias: string; available: boolean }) {
  const content = useSiteContent();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: KeyboardEvent) => { if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); } };
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  }, [open]);
  const active = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const dot = alias.lastIndexOf(".");
  return <header className="sticky top-0 z-50 border-b border-zinc-800 bg-base-950/95 backdrop-blur-md">
    <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-5 sm:px-10 lg:px-12">
      <Link href="/" className="min-w-0 py-3 font-mono text-xs font-medium tracking-tight text-white sm:text-base" aria-label={alias}>
        {dot > 0 ? <>{alias.slice(0, dot)}<span className="text-accent">{alias.slice(dot)}</span></> : alias}
      </Link>
      <nav className="hidden items-center gap-0 lg:flex" aria-label={content["redesign.navigationLabel"]}>
        {NAV_LINKS.filter((link) => link.href !== "/").map((link) => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined} className={cn("relative inline-flex min-h-11 items-center px-3 font-mono text-xs transition-colors xl:px-4", active(link.href) ? "text-accent after:absolute after:bottom-1 after:left-3 after:right-3 after:h-px after:bg-accent" : "text-zinc-400 hover:text-white")}>{content[`nav.${link.href}`] ?? link.label}</Link>)}
      </nav>
      <div className="flex shrink-0 items-center gap-2"><PreferenceControls /><button ref={toggle} type="button" className="flex h-11 w-11 items-center justify-center rounded-sm text-zinc-300 transition-colors hover:bg-zinc-800/30 lg:hidden" onClick={() => setOpen((value) => !value)} aria-label={content["preferences.menu"]} aria-expanded={open} aria-controls="mobile-navigation">{open ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}</button></div>
    </div>
    {open && <nav id="mobile-navigation" aria-label={content["redesign.navigationLabel"]} className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-zinc-800 bg-base-950 px-6 pb-6 pt-3 lg:hidden">{NAV_LINKS.map((link, index) => <Link key={link.href} href={link.href} aria-current={active(link.href) ? "page" : undefined} onClick={() => setOpen(false)} className={cn("flex min-h-14 items-center justify-between border-b border-zinc-800 py-3 font-mono text-lg", active(link.href) ? "text-accent" : "text-zinc-200")}><span><span className="mr-5 text-xs text-zinc-400">0{index + 1}</span>{content[`nav.${link.href}`] ?? link.label}</span><ArrowUpRight aria-hidden="true" className="h-5 w-5" /></Link>)}</nav>}
  </header>;
}
