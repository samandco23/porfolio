import { describe, expect, it } from "vitest";
import { profileContent, projectsContent, skillsContent } from "../prisma/content";
import { profileSchema, projectSchema, skillSchema } from "@/lib/validators";
import { DEFAULT_SITE_CONTENT, resolveSiteContent, siteContentSchema } from "@/lib/site-content";

describe("supplied portfolio seed", () => {
  it("validates the profile and all project/skill content", () => {
    expect(profileSchema.safeParse(profileContent).success).toBe(true);
    for (const project of projectsContent) expect(projectSchema.safeParse({ ...project, tags: JSON.parse(project.tags).join(",") }).success).toBe(true);
    for (const skill of skillsContent) expect(skillSchema.safeParse(skill).success).toBe(true);
  });
  it("has ten unique published projects and three homepage selections", () => {
    expect(projectsContent).toHaveLength(10);
    expect(new Set(projectsContent.map((p) => p.slug)).size).toBe(10);
    expect(projectsContent.every((p) => p.status === "PUBLISHED")).toBe(true);
    expect(projectsContent.filter((p) => p.featured).map((p) => p.title)).toEqual(["Guidtwam", "FON KOUENI ERP", "E-Commerce Platform"]);
  });
  it("does not invent proficiency and has thirteen distinct main stack technologies", () => {
    expect(skillsContent.every((s) => s.level === null)).toBe(true);
    expect(new Set(skillsContent.map((s) => `${s.category}:${s.name}`)).size).toBe(skillsContent.length);
    expect(skillsContent.filter((s) => s.featured)).toHaveLength(13);
  });
});
describe("editable copy", () => {
  it("validates defaults and preserves intentional empty text", () => {
    expect(siteContentSchema.safeParse(DEFAULT_SITE_CONTENT).success).toBe(true);
    const result = resolveSiteContent({ "site.footerNote": "", "home.stackTitle": "Technologies" });
    expect(result["site.footerNote"]).toBe("");
    expect(result["home.stackTitle"]).toBe("Technologies");
    expect(result["nav./projects"]).toBe(DEFAULT_SITE_CONTENT["nav./projects"]);
  });
  it("rejects invalid languages and unsafe website origins", () => {
    expect(siteContentSchema.safeParse({ "site.language": "<script>" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...profileContent, siteUrl: "https://example.com/private" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...profileContent, siteUrl: "https://" }).success).toBe(false);
  });
});
