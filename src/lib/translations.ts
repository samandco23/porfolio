import { parseProjectContent, serializeProjectContent } from "./project-content";
import { parseMomentPhotos } from "./moments";
import type { Locale } from "./preferences";
export const TRANSLATED_FIELDS = {
  profile: ["title", "specialties", "tagline", "shortBio", "longBio", "seoTitle", "seoDescription"],
  project: ["title", "description", "content", "challenge", "approach", "outcome"],
  article: ["title", "excerpt", "content"],
  moment: ["title", "description", "content", "location", "album"],
} as const;
export type TranslationKind = keyof typeof TRANSLATED_FIELDS;
export function translationKey(locale: Locale, kind: TranslationKind, id: string, field: string) {
  return `${locale}:entity.${kind}.${id}.${field}`;
}
export function isTranslationKey(key: string): boolean {
  const match = /^(fr|en):entity\.(profile|project|article|moment)\.([a-zA-Z0-9-]{1,100})\.([a-zA-Z]+|photo-\d{1,2})$/.exec(key);
  return !!match && ((TRANSLATED_FIELDS[match[2] as TranslationKind] as readonly string[]).includes(match[4]) || (match[2] === "moment" && /^photo-\d{1,2}$/.test(match[4])));
}
export function translateRecord<T extends { id: string }>(row: T, kind: TranslationKind, locale: Locale, copy: Record<string, string>): T {
  const output = { ...row };
  const fields = output as T & Record<string, unknown>;
  for (const field of TRANSLATED_FIELDS[kind]) {
    const value = copy[translationKey(locale, kind, row.id, field)];
    // Blank translations fall back to the original, so unfinished translations remain readable.
    if (value) (fields as Record<string, unknown>)[field] = value;
  }
  if (kind === "project" && "content" in row) {
    const parsed = parseProjectContent(String(row.content));
    const body = copy[translationKey(locale, kind, row.id, "content")] || parsed.content;
    output["content" as keyof T] = serializeProjectContent(body, {
      ...parsed.details,
      challenge: copy[translationKey(locale, kind, row.id, "challenge")] || parsed.details.challenge,
      approach: copy[translationKey(locale, kind, row.id, "approach")] || parsed.details.approach,
      outcome: copy[translationKey(locale, kind, row.id, "outcome")] || parsed.details.outcome,
    }) as T[keyof T];
  }
  if (kind === "moment" && "images" in row) {
    output["images" as keyof T] = JSON.stringify(parseMomentPhotos(String(row.images)).map((photo, index) => ({ ...photo, caption: copy[translationKey(locale, kind, row.id, `photo-${index}`)] || photo.caption }))) as T[keyof T];
  }
  return output;
}
/** Never send translations of drafts to the public client provider. */
export function publicTranslations(copy: Record<string, string>, published: Record<"project" | "article" | "moment", Set<string>>) {
  return Object.fromEntries(Object.entries(copy).filter(([key]) => {
    if (!key.includes(":entity.")) return true;
    const [, kind, id] = key.split(".");
    return kind === "profile" ? id === "default" : published[kind as keyof typeof published]?.has(id);
  }));
}
