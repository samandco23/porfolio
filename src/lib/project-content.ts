import { z } from "zod";

export const webUrl = z.string().trim().max(500).url("Must be a valid URL").refine(
  (value) => /^https?:\/\//i.test(value),
  "Use an HTTP or HTTPS URL",
);

export const caseStudySchema = z.object({
  challenge: z.string().trim().max(2000).default(""),
  approach: z.string().trim().max(2000).default(""),
  outcome: z.string().trim().max(2000).default(""),
  screenshots: z.string().trim().max(4000).default("").refine((value) => {
    const urls = value.split(/\r?\n/).map((url) => url.trim()).filter(Boolean);
    return urls.length <= 6 && urls.every((url) => url.length <= 500 && webUrl.safeParse(url).success);
  }, "Add up to 6 image URLs, one per line (HTTP or HTTPS)"),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;
const PREFIX = "<!-- portfolio-case-study:v1:";

export function serializeProjectContent(content: string, details: CaseStudy): string {
  if (Object.values(details).every((value) => !value)) return content;
  return `${PREFIX}${encodeURIComponent(JSON.stringify(details))} -->\n${content}`;
}

/** Legacy markdown remains usable without any database migration. */
export function parseProjectContent(stored: string): { content: string; details: CaseStudy } {
  const empty = caseStudySchema.parse({});
  if (!stored.startsWith(PREFIX)) return { content: stored, details: empty };
  const end = stored.indexOf(" -->\n");
  if (end < 0) return { content: stored, details: empty };
  try {
    const details = caseStudySchema.parse(JSON.parse(decodeURIComponent(stored.slice(PREFIX.length, end))));
    return { details, content: stored.slice(end + 5) };
  } catch {
    return { content: stored, details: empty };
  }
}
