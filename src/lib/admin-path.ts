/**
 * Public entry path of the admin dashboard.
 *
 * Set ADMIN_PATH in .env to a long random path to move the dashboard.
 * Development default: "/admin"; production requires a custom path.
 *
 * Server-side only — client components receive the value as a `adminBase`
 * prop, because non-NEXT_PUBLIC env vars are not available in the browser.
 */
export function getAdminPath(): string {
  const raw = process.env.ADMIN_PATH?.trim();
  if (!raw) return "/admin";

  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
  const clean = withSlash.replace(/\/+$/, "").toLowerCase();
  return clean.length > 1 ? clean : "/admin";
}
