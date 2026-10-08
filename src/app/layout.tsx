import type { Metadata } from "next";
import { connection } from "next/server";
// Self-hosted variable fonts (bundled, no external requests at build time —
// keeps builds deterministic and offline-proof).
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getProfile, getSiteContent } from "@/lib/queries";
import { SiteContentProvider, SiteText } from "@/components/site-content";
import { SITE_NAME } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const profile = await getProfile();
  return {
    metadataBase: profile?.siteUrl ? new URL(profile.siteUrl) : getSiteUrl(),
    title: {
      default: profile?.seoTitle || `${profile?.fullName ?? SITE_NAME} — ${profile?.title ?? "Portfolio"}`,
      template: `%s — ${profile?.fullName ?? SITE_NAME}`,
    },
    description: profile?.seoDescription || profile?.shortBio || "",
    twitter: { card: "summary_large_image", images: ["/api/og?kind=site"] },
    openGraph: {
      images: [{ url: "/api/og?kind=site", width: 1200, height: 630 }],
      type: "website",
      siteName: profile?.siteName || profile?.fullName || SITE_NAME,
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
  // Render at request time; public data stays cached without needing a DB at build time.
  await connection();
  const [profile, content] = await Promise.all([getProfile(), getSiteContent()]);

  return (
    <html lang={content["site.language"]}>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteContentProvider content={content}>
        <a
          href="#main-content"
          className="absolute left-4 top-2 z-[100] -translate-y-16 border border-[#00FF66] bg-black px-4 py-2 font-mono text-sm text-[#00FF66] focus:translate-y-0"
        >
          <SiteText name="site.skip" />
        </a>
        <SiteHeader
          alias={profile?.siteName || profile?.alias || profile?.fullName || SITE_NAME}
          available={profile?.available ?? false}
        />
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <SiteFooter profile={profile} />
        </SiteContentProvider>
      </body>
    </html>
  );
}
