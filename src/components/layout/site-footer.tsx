import { Github, Linkedin, Twitter, Mail, Globe, Link2 } from "lucide-react";
import { SiteText } from "@/components/site-content";
import { getProfile } from "@/lib/queries";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
  globe: Globe,
  link: Link2,
};

export async function SiteFooter({
  profile,
}: {
  profile: Awaited<ReturnType<typeof getProfile>>;
}) {
  const year = new Date().getFullYear();
  const name = profile?.fullName ?? "Anonymous";

  return (
    <footer className="border-t border-zinc-800 bg-black/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-mono text-xs text-zinc-600">
          <span className="text-zinc-500">© {year} {name}</span>
          <p className="mt-2"><SiteText name="site.footerNote" /></p>
        </div>

        <div className="flex items-center gap-3">
          {(profile?.socialLinks ?? []).map((link) => {
            const Icon = ICONS[link.iconKey] ?? Link2;
            return (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-zinc-600 transition-colors hover:text-[#00FF66]"
              >
                <Icon className="h-4 w-4" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
