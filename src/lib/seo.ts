import type { Metadata } from "next";
import { getProfile } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";
import { SITE_NAME } from "@/lib/constants";

export async function pageMetadata({ title, description, path, kind = "site", slug, publishedAt, updatedAt }: {
  title: string; description: string; path: string;
  kind?: "site" | "project" | "article" | "moment"; slug?: string;
  publishedAt?: Date | string | null; updatedAt?: Date | string;
}): Promise<Metadata> {
  const profile = await getProfile();
  const origin = profile?.siteUrl ? new URL(profile.siteUrl) : getSiteUrl();
  const url = new URL(path, origin).toString();
  const image = new URL("/api/og", origin);
  image.searchParams.set("kind", kind);
  if (slug) image.searchParams.set("slug", slug);
  const images = [{ url: image.toString(), width: 1200, height: 630, alt: title }];
  const common = { title, description, url, siteName: profile?.siteName || profile?.fullName || SITE_NAME, images };
  return {
    title, description, alternates: { canonical: url },
    openGraph: kind === "article" ? {
      ...common, type: "article",
      publishedTime: publishedAt ? new Date(publishedAt).toISOString() : undefined,
      modifiedTime: updatedAt ? new Date(updatedAt).toISOString() : undefined,
      authors: profile?.fullName ? [profile.fullName] : undefined,
    } : { ...common, type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [image.toString()] },
  };
}

export function serializeJsonLd(value: Record<string, unknown>): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
