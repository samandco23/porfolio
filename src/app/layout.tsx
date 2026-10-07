import type { Metadata } from "next";
// Self-hosted variable fonts (bundled, no external requests at build time —
// keeps builds deterministic and offline-proof).
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getProfile } from "@/lib/queries";
import { SITE_NAME } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  return {
    metadataBase: getSiteUrl(),
    title: {
      default: profile?.seoTitle || `${profile?.fullName ?? SITE_NAME} — ${profile?.title ?? "Portfolio"}`,
      template: `%s — ${profile?.fullName ?? SITE_NAME}`,
    },
    description: profile?.seoDescription || profile?.shortBio || "",
    openGraph: {
      type: "website",
      siteName: profile?.fullName ?? SITE_NAME,
      title: profile?.seoTitle || `${profile?.fullName ?? SITE_NAME} — ${profile?.title ?? "Portfolio"}`,
      description: profile?.seoDescription || profile?.shortBio || "",
    },
  };
}

export const viewport = {
  colorScheme: "dark",
  themeColor: "#050505",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main-content"
          className="absolute left-4 top-2 z-[100] -translate-y-16 border border-[#00FF66] bg-black px-4 py-2 font-mono text-sm text-[#00FF66] focus:translate-y-0"
        >
          Skip to content
        </a>
        <SiteHeader
          alias={profile?.alias || profile?.fullName || SITE_NAME}
          available={profile?.available ?? false}
        />
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <SiteFooter profile={profile} />
      </body>
    </html>
  );
}
