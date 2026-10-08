import type { Metadata } from "next";
import { connection } from "next/server";
// Self-hosted variable fonts (bundled, no external requests at build time —
// keeps builds deterministic and offline-proof).
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { getProfile as getLocalizedProfile } from "@/lib/localized-queries";
import { readPreferences } from "@/lib/server-preferences";
import { normalizeLocale, THEME_BOOTSTRAP } from "@/lib/preferences";
import { getSiteContent } from "@/lib/queries";
import { SiteContentProvider, SiteText } from "@/components/site-content";
import { SITE_NAME } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";

export async function generateMetadata(): Promise<Metadata> {
  await connection();
  const [profile, copy] = await Promise.all([getLocalizedProfile(), getSiteContent()]);
  const { locale } = await readPreferences(normalizeLocale(copy["site.language"]));
  const sharingImage = `/api/og?kind=site&lang=${locale}`;
  return {
    metadataBase: profile?.siteUrl ? new URL(profile.siteUrl) : getSiteUrl(),
    title: {
      default: profile?.seoTitle || `${profile?.fullName ?? SITE_NAME} — ${profile?.title ?? "Portfolio"}`,
      template: `%s — ${profile?.fullName ?? SITE_NAME}`,
    },
    description: profile?.seoDescription || profile?.shortBio || "",
    twitter: { card: "summary_large_image", images: [sharingImage] },
    openGraph: {
      images: [{ url: sharingImage, width: 1200, height: 630 }],
      type: "website",
      siteName: profile?.siteName || profile?.fullName || SITE_NAME,
      title: profile?.seoTitle || `${profile?.fullName ?? SITE_NAME} — ${profile?.title ?? "Portfolio"}`,
      description: profile?.seoDescription || profile?.shortBio || "",
    },
  };
}

export const viewport = {
  colorScheme: "light dark",
  themeColor: "#050505",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Render at request time; public data stays cached without needing a DB at build time.
  await connection();
  const [profile, content] = await Promise.all([getLocalizedProfile(), getSiteContent()]);

  const { locale, theme } = await readPreferences(normalizeLocale(content["site.language"]), content["site.theme"]);

  return (
    <html lang={locale} data-theme-mode={theme} data-theme={theme === "system" ? "dark" : theme} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} /></head>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteContentProvider content={content} locale={locale} theme={theme}>
        <a
          href="#main-content"
          className="absolute left-4 top-2 z-[100] -translate-y-16 border border-accent bg-black px-4 py-2 font-mono text-sm text-accent focus:translate-y-0"
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
