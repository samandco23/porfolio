import { z } from "zod";
import defaults from "./site-content-defaults.json";

export const DEFAULT_SITE_CONTENT: Record<string, string> = defaults;
export const siteContentSchema = z.record(z.string().max(120), z.string().max(4000)).superRefine((data, ctx) => {
  for (const key of Object.keys(data)) {
    if (!Object.hasOwn(DEFAULT_SITE_CONTENT, key)) ctx.addIssue({ code: "custom", path: [key], message: "Unknown content field" });
  }
  if (data["site.language"] && !/^[a-z]{2,3}(?:-[A-Za-z]{2,8})?$/.test(data["site.language"])) {
    ctx.addIssue({ code: "custom", path: ["site.language"], message: "Use a language code such as fr or en" });
  }
});
export function resolveSiteContent(data: unknown): Record<string, string> {
  const parsed = siteContentSchema.safeParse(data);
  return { ...DEFAULT_SITE_CONTENT, ...(parsed.success ? parsed.data : {}) };
}
