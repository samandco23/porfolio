import { describe, expect, it, vi } from "vitest";
import { runInNewContext } from "node:vm";
import { normalizeLocale, normalizeTheme, localizedContent, THEME_BOOTSTRAP } from "@/lib/preferences";
import { translateRecord, publicTranslations } from "@/lib/translations";
import { siteContentSchema } from "@/lib/site-content";
import { getProfile } from "@/lib/localized-queries";
const mocks = vi.hoisted(() => ({ cookies: vi.fn(), profile: vi.fn(), content: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: mocks.cookies }));
vi.mock("@/lib/queries", () => ({ getProfile: mocks.profile, getSiteContent: mocks.content }));

describe("language and theme preferences", () => {
  it("validates preferences with safe defaults", () => {
    expect(normalizeLocale("en")).toBe("en"); expect(normalizeLocale("<script>")).toBe("fr");
    expect(normalizeLocale(undefined, "en")).toBe("en"); expect(normalizeTheme("light")).toBe("light");
    expect(normalizeTheme("invalid")).toBe("system");
    expect(siteContentSchema.safeParse({ "site.theme": "invalid" }).success).toBe(false);
  });
  it("resolves automatic appearance before paint and honors an explicit choice", () => {
    for (const [mode, systemDark, expected] of [["system", true, "dark"], ["system", false, "light"], ["light", true, "light"], ["dark", false, "dark"]]) {
      const root = { dataset: { themeMode: mode, theme: "" }, style: { colorScheme: "" } };
      runInNewContext(THEME_BOOTSTRAP, { document: { documentElement: root }, window: { matchMedia: () => ({ matches: systemDark }) } });
      expect(root.dataset.theme).toBe(expected); expect(root.style.colorScheme).toBe(expected);
    }
  });
  it("translates interface copy while preserving empty text overrides", () => {
    const copy = { title: "Bonjour", "en:title": "Hello", footer: "Note", "en:footer": "" };
    expect(localizedContent(copy, "en")).toEqual(expect.objectContaining({ title: "Hello", footer: "" }));
    expect(localizedContent(copy, "fr").title).toBe("Bonjour"); expect(copy.title).toBe("Bonjour");
  });
  it("keeps requests with different languages isolated", async () => {
    const original = { id: "default", shortBio: "Texte français" };
    mocks.profile.mockResolvedValue(original);
    mocks.content.mockResolvedValue({ "site.language": "fr", "en:entity.profile.default.shortBio": "English copy" });
    mocks.cookies.mockResolvedValue({ get: () => ({ value: "en" }) });
    expect((await getProfile())?.shortBio).toBe("English copy");
    mocks.cookies.mockResolvedValue({ get: () => ({ value: "fr" }) });
    expect((await getProfile())?.shortBio).toBe("Texte français");
    expect(original.shortBio).toBe("Texte français");
  });
  it("preserves untranslated fields and empty translations fall back to original content", () => {
    expect(translateRecord({ id: "one", title: "Titre", description: "Résumé" }, "project", "en", { "en:entity.project.one.title": "Title", "en:entity.project.one.description": "" })).toEqual({ id: "one", title: "Title", description: "Résumé" });
  });
  it("never sends translations of drafts to the public provider", () => {
    const copy = { "en:entity.project.private.title": "Private draft", "en:entity.project.public.title": "Public project", "en:entity.profile.default.shortBio": "Public bio", "en:entity.profile.other.shortBio": "Other profile", "en:nav./": "HOME" };
    expect(publicTranslations(copy, { project: new Set(["public"]), article: new Set(), moment: new Set() })).toEqual({ "en:entity.project.public.title": "Public project", "en:entity.profile.default.shortBio": "Public bio", "en:nav./": "HOME" });
  });
  it("only permits supported translated fields", () => {
    expect(siteContentSchema.safeParse({ "en:entity.project.item.password": "hidden" }).success).toBe(false);
    expect(siteContentSchema.safeParse({ "en:entity.article.item.content": "English article" }).success).toBe(true);
  });
});
