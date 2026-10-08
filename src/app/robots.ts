import type { MetadataRoute } from "next";
import { getProfile } from "@/lib/queries";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const profile = await getProfile();
  const siteUrl = profile?.siteUrl ? new URL(profile.siteUrl) : getSiteUrl();
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
  };
}
