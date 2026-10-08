import { z } from "zod";
import { isReservedSlug } from "./constants";
import { caseStudySchema, webUrl } from "./project-content";

// ─── Profile ────────────────────────────────────────────────

export const profileSchema = z.object({
  fullName: z.string().trim().min(2, "Name is required").max(80),
  alias: z.string().trim().max(40).optional().or(z.literal("")),
  title: z.string().trim().min(2, "Title is required").max(120),
  siteName: z.string().trim().max(120).default("Portfolio"),
  siteUrl: webUrl.refine((value) => {
    try {
      const url = new URL(value);
      return url.pathname === "/" && !url.search && !url.hash && !url.username && !url.password && url.protocol === "https:";
    } catch { return false; }
  }, "Use an HTTPS origin without a path").optional().or(z.literal("")),
  tagline: z.string().trim().max(280).default(""),
  specialties: z.string().trim().max(280).default(""),
  shortBio: z.string().trim().min(10, "Short bio must be at least 10 characters").max(280),
  longBio: z.string().trim().min(20, "Long bio must be at least 20 characters").max(8000),
  email: z.string().trim().email("Invalid email address").max(160),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s().-]{7,30}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  location: z.string().trim().max(120).optional().or(z.literal("")),
  avatarUrl: webUrl.optional().or(z.literal("")),
  resumeUrl: webUrl.optional().or(z.literal("")),
  seoTitle: z.string().trim().max(120).optional().or(z.literal("")),
  seoDescription: z.string().trim().max(300).optional().or(z.literal("")),
  available: z.boolean().default(true),
});
export type ProfileInput = z.infer<typeof profileSchema>;

// ─── Social links ───────────────────────────────────────────

export const socialLinkSchema = z.object({
  label: z.string().trim().min(1, "Label is required").max(40),
  url: webUrl,
  iconKey: z.string().trim().max(30).default("link"),
  order: z.coerce.number().int().min(0).max(999).default(0),
  isVisible: z.boolean().default(true),
});
export type SocialLinkInput = z.infer<typeof socialLinkSchema>;

// ─── Projects ───────────────────────────────────────────────

const tagsField = z
  .string()
  .default("")
  .refine(
    (v) =>
      v
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .every((t) => t.length <= 30),
    "Each tag must be 30 characters max",
  );

export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(96)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only")
    .refine((s) => !isReservedSlug(s), "This slug is reserved"),
  description: z.string().trim().min(10, "Description must be at least 10 characters").max(500),
  content: z.string().trim().max(20000).default(""),
  imageUrl: webUrl.optional().or(z.literal("")),
  repoUrl: webUrl.optional().or(z.literal("")),
  demoUrl: webUrl.optional().or(z.literal("")),
  tags: tagsField,
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  year: z.string().trim().max(10).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).max(999).default(0),
}).merge(caseStudySchema);
export type ProjectInput = z.infer<typeof projectSchema>;

// ─── Skills ─────────────────────────────────────────────────

export const skillSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(60),
  category: z.enum(["LANGUAGES", "FRONTEND", "BACKEND", "MOBILE", "DATABASE", "API", "ARCHITECTURE", "DEVOPS", "CLOUD", "SYSTEMS", "NETWORKING", "SECURITY", "DESIGN", "AI", "IOT", "TOOLS"]),
  level: z.preprocess((value) => value === "" || value == null ? null : value, z.coerce.number().int().min(0).max(100).nullable()),
  featured: z.boolean().default(false),
  iconKey: z.string().trim().max(30).optional().or(z.literal("")),
  order: z.coerce.number().int().min(0).max(999).default(0),
  isVisible: z.boolean().default(true),
});
export type SkillInput = z.infer<typeof skillSchema>;

// ─── Articles ───────────────────────────────────────────────

export const articleSchema = z.object({
  title: z.string().trim().min(2, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .max(96)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only")
    .refine((s) => !isReservedSlug(s), "This slug is reserved"),
  excerpt: z.string().trim().min(10, "Excerpt must be at least 10 characters").max(400),
  content: z.string().trim().min(20, "Content must be at least 20 characters").max(60000),
  coverUrl: webUrl.optional().or(z.literal("")),
  tags: tagsField,
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  publishedAt: z.string().refine(
    (value) => value === "" || Number.isFinite(Date.parse(value)),
    "Enter a valid publication date",
  ).optional(),
});
export type ArticleInput = z.infer<typeof articleSchema>;

// ─── Contact form (public) ──────────────────────────────────

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Your name is required").max(80),
  email: z.string().trim().email("Invalid email address").max(160),
  subject: z.string().trim().max(120).optional().or(z.literal("")),
  body: z.string().trim().min(20, "Message must be at least 20 characters").max(4000),
  // Honeypot: must stay empty. Bots fill it, humans never see it.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof contactSchema>;

// ─── Login ──────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(8, "At least 8 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;

/** Flatten a ZodError into a { field: message } record for React Hook Form. */
export function zodFieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
