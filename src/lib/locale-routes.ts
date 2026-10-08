import { normalizeLocale, type Locale } from "./preferences";

const PUBLIC_ROOTS = new Set(["about", "projects", "blog", "moments", "contact"]);

export function stripLocale(pathname: string): string {
  const match = /^\/(fr|en)(?=\/|$)/.exec(pathname);
  return match ? pathname.slice(match[0].length) || "/" : pathname;
}

export function routeLocale(pathname: string): Locale | null {
  const match = /^\/(fr|en)(?=\/|$)/.exec(pathname);
  return match ? normalizeLocale(match[1]) : null;
}

export function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  const parts = pathname.split("/").filter(Boolean);
  if (!PUBLIC_ROOTS.has(parts[0])) return false;
  if (["about", "contact"].includes(parts[0])) return parts.length === 1;
  return parts.length <= 2;
}

export function localizedPath(href: string, locale: Locale): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const match = /^([^?#]*)(.*)$/.exec(href);
  const pathname = stripLocale(match?.[1] || "/");
  const suffix = match?.[2] || "";
  return `/${locale}${pathname === "/" ? "" : pathname}${suffix}`;
}
