import { z } from "zod";
import { isTranslationKey } from "./translations";
import defaults from "./site-content-defaults.json";

export const DEFAULT_SITE_CONTENT: Record<string, string> = defaults;
export const siteContentSchema = z.record(z.string().max(160), z.string().max(60000)).superRefine((data, ctx) => {
  for (const key of Object.keys(data)) {
    if (!Object.hasOwn(DEFAULT_SITE_CONTENT, key) && !isTranslationKey(key)) ctx.addIssue({ code: "custom", path: [key], message: "Unknown content field" });
  }
  if (data["site.language"] && !["fr", "en"].includes(data["site.language"])) {
    ctx.addIssue({ code: "custom", path: ["site.language"], message: "Use a language code such as fr or en" });
  }
  if (data["site.theme"] && !["light", "dark", "system"].includes(data["site.theme"])) ctx.addIssue({ code: "custom", path: ["site.theme"], message: "Choose light, dark or system" });
});
export function resolveSiteContent(data: unknown): Record<string, string> {
  const parsed = siteContentSchema.safeParse(data);
  return { ...DEFAULT_SITE_CONTENT, ...(parsed.success ? parsed.data : {}) };
}
