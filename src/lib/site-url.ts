export function getSiteUrl(): URL {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    (process.env.NODE_ENV === "production"
      ? process.env.VERCEL_ENV === "production"
        ? process.env.VERCEL_PROJECT_PRODUCTION_URL
        : process.env.VERCEL_URL
      : undefined);
  if (!configuredUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Set NEXT_PUBLIC_SITE_URL or enable Vercel system environment variables for the deployment.",
      );
    }
    return new URL("http://localhost:3000");
  }

  const normalizedUrl =
    configuredUrl.startsWith("http://") || configuredUrl.startsWith("https://")
      ? configuredUrl
      : `https://${configuredUrl}`;

  let siteUrl: URL;
  try {
    siteUrl = new URL(normalizedUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute URL.");
  }

  if (
    !siteUrl.hostname ||
    siteUrl.username ||
    siteUrl.password ||
    siteUrl.pathname !== "/" ||
    siteUrl.search ||
    siteUrl.hash
  ) {
    throw new Error("NEXT_PUBLIC_SITE_URL must contain only the public site origin.");
  }

  if (process.env.NODE_ENV === "production" && siteUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_SITE_URL must use HTTPS in production.");
  }

  return siteUrl;
}
