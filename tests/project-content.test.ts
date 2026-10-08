import { describe, expect, it } from "vitest";
import { caseStudySchema, parseProjectContent, serializeProjectContent } from "@/lib/project-content";

describe("project case studies", () => {
  it("preserves existing markdown without inventing any case-study fields", () => {
    const content = "## My project\n\nExisting write-up.";
    const parsed = parseProjectContent(content);
    expect(parsed.content).toBe(content);
    expect(serializeProjectContent(content, parsed.details)).toBe(content);
  });

  it("round-trips markdown, newlines, accented text and comment delimiters", () => {
    const details = caseStudySchema.parse({
      challenge: "Sécurité --> and newlines\nremain intact", approach: "**My approach**", outcome: "Measured result",
      screenshots: "https://example.com/a.png\nhttps://example.com/b.webp",
    });
    const content = "## Notes\n\nOriginal markdown.";
    expect(parseProjectContent(serializeProjectContent(content, details))).toEqual({ content, details });
  });

  it("keeps malformed or unknown metadata from erasing the original content", () => {
    const content = "<!-- portfolio-case-study:v1:invalid -->\nWrite-up";
    expect(parseProjectContent(content).content).toBe(content);
  });

  it("rejects unsafe screenshot schemes and oversized galleries", () => {
    expect(caseStudySchema.safeParse({ screenshots: "not a URL" }).success).toBe(false);
    expect(caseStudySchema.safeParse({ screenshots: "javascript:alert(1)" }).success).toBe(false);
    expect(caseStudySchema.safeParse({ screenshots: "data:image/svg+xml,test" }).success).toBe(false);
    expect(caseStudySchema.safeParse({ screenshots: Array(7).fill("https://example.com/a.png").join("\n") }).success).toBe(false);
  });
});
