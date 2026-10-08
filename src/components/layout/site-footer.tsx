import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowUpRight, Github, Linkedin, Twitter, Mail, Globe, Link2 } from "lucide-react";
import { SiteText } from "@/components/site-content";
import { getProfile } from "@/lib/queries";
import { NAV_LINKS } from "@/lib/constants";
const ICONS: Record<string, LucideIcon> = { github: Github, linkedin: Linkedin, twitter: Twitter, mail: Mail, globe: Globe, link: Link2 };
export async function SiteFooter({ profile }: { profile: Awaited<ReturnType<typeof getProfile>> }) {
  return <footer className="border-t border-zinc-800 bg-base-400/50">
    <div className="page-shell py-12 md:py-16">
      <div className="grid gap-10 md:grid-cols-[1fr_auto]">
        <div><Link href="/" className="font-mono text-xl font-medium text-white">{profile?.fullName}</Link><p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-400">{profile?.title}</p>{profile?.email && <a href={`mailto:${profile.email}`} className="mt-5 inline-flex min-h-11 items-center gap-3 font-mono text-sm text-accent">{profile.email}<ArrowUpRight aria-hidden="true" className="h-4 w-4" /></a>}</div>
        <div className="flex flex-wrap items-start gap-x-8 gap-y-2 md:justify-end">{NAV_LINKS.filter((link) => link.href !== "/").map((link) => <Link href={link.href} key={link.href} className="inline-flex min-h-11 items-center font-mono text-xs text-zinc-400 transition-colors hover:text-accent"><SiteText name={`nav.${link.href}`} /></Link>)}</div>
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-zinc-800 pt-6">
        <div className="font-mono text-xs text-zinc-400"><p>© {new Date().getFullYear()} {profile?.fullName}</p><p className="mt-2"><SiteText name="site.footerNote" /></p></div>
        <div className="flex flex-wrap items-center gap-3">{(profile?.socialLinks ?? []).map((link) => { const Icon = ICONS[link.iconKey] ?? Link2; return <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 px-2 font-mono text-xs text-zinc-300 transition-colors hover:text-accent"><Icon aria-hidden={true} className="h-4 w-4" /><span>{link.label}</span><ArrowUpRight aria-hidden="true" className="h-3 w-3" /></a>; })}<a href="#main-content" className="arrow-circle ml-2"><ArrowUp aria-hidden="true" className="h-4 w-4" /><span className="sr-only"><SiteText name="redesign.backTop" /></span></a></div>
      </div>
    </div>
  </footer>;
}
