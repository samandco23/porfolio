import { z } from "zod";
import { webUrl } from "./project-content";
import { isReservedSlug } from "./constants";

export const MOMENT_KINDS = ["EVENT", "MEMORY", "GALLERY"] as const;
const photoSchema = z.object({ url: webUrl, caption: z.string().trim().max(200).default("") });
export type MomentPhoto = z.infer<typeof photoSchema>;

/** One photo per line: https://… | optional caption. */
export function readPhotoLines(value: string): MomentPhoto[] {
  return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
    const separator = line.indexOf("|");
    return separator < 0 ? { url: line, caption: "" } : { url: line.slice(0, separator).trim(), caption: line.slice(separator + 1).trim() };
  });
}
export function parseMomentPhotos(value: string): MomentPhoto[] {
  try { const parsed = z.array(photoSchema).max(20).safeParse(JSON.parse(value)); return parsed.success ? parsed.data : []; }
  catch { return []; }
}
export function photoLines(value: string): string {
  return parseMomentPhotos(value).map((photo) => `${photo.url}${photo.caption ? ` | ${photo.caption}` : ""}`).join("\n");
}
export const momentSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(96).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).refine((slug) => !isReservedSlug(slug), "Reserved slug"),
  kind: z.enum(MOMENT_KINDS),
  description: z.string().trim().min(10).max(500),
  content: z.string().trim().max(20000).default(""),
  date: z.string().refine((value) => {
    if (!value) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
  }, "Use a valid calendar date").default(""),
  location: z.string().trim().max(120).default(""),
  album: z.string().trim().max(80).default(""),
  coverUrl: webUrl.or(z.literal("")).default(""),
  images: z.string().max(16000).refine((value) => z.array(photoSchema).max(20).safeParse(readPhotoLines(value)).success, "Use up to 20 HTTP(S) image URLs, one per line, with optional captions (200 characters max)").default(""),
  featured: z.boolean().default(false),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT"),
  order: z.coerce.number().int().min(0).max(999).default(0),
});
export type MomentInput = z.infer<typeof momentSchema>;
