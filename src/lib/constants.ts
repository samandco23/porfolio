export const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "DEV.PORTFOLIO";

export const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/projects", label: "PROJECTS" },
  { href: "/blog", label: "BLOG" },
  { href: "/contact", label: "CONTACT" },
] as const;

export const SKILL_CATEGORY_LABELS: Record<string, string> = {
  FRONTEND: "FRONTEND",
  BACKEND: "BACKEND",
  SECURITY: "SECURITY",
  IOT: "HARDWARE / IOT",
  TOOLS: "TOOLS & DEVOPS",
};

export const SKILL_CATEGORIES = Object.keys(SKILL_CATEGORY_LABELS) as Array<
  keyof typeof SKILL_CATEGORY_LABELS
>;

export const MESSAGE_STATES = ["UNREAD", "READ", "ARCHIVED"] as const;

export const PUBLISH_STATUSES = ["DRAFT", "PUBLISHED"] as const;

/** Reserved words that must not be used as entity slugs. */
export const RESERVED_SLUGS = ["admin", "api", "login", "_next", "public", "static"] as const;

export function isReservedSlug(slug: string): boolean {
  return (RESERVED_SLUGS as readonly string[]).includes(slug.toLowerCase());
}
