import { afterEach, describe, expect, it, vi } from "vitest";
import { slugify, parseTags, initials, formatDate } from "@/lib/utils";
import { isReservedSlug } from "@/lib/constants";
import { hashRateLimitKey } from "@/lib/rate-limit";
import {
  profileSchema,
  contactSchema,
  projectSchema,
  skillSchema,
  articleSchema,
} from "@/lib/validators";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("slugify", () => {
  it("slugs normal titles", () => {
    expect(slugify("Sentinel — SIEM Dashboard")).toBe("sentinel-siem-dashboard");
  });

  it("strips accents and special chars", () => {
    expect(slugify("Crème brûlée & Café!")).toBe("creme-brulee-cafe");
  });

  it("collapses repeated hyphens", () => {
    expect(slugify("a  --  b")).toBe("a-b");
  });
});

describe("parseTags", () => {
  it("parses JSON tag arrays", () => {
    expect(parseTags('["a","b"]')).toEqual(["a", "b"]);
  });

  it("returns empty for garbage", () => {
    expect(parseTags("not json")).toEqual([]);
    expect(parseTags(null)).toEqual([]);
    expect(parseTags('{"a":1}')).toEqual([]);
  });
});

describe("isReservedSlug", () => {
  it("blocks reserved words", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("API")).toBe(true);
    expect(isReservedSlug("my-project")).toBe(false);
  });
});

describe("rate-limit key hashing", () => {
  it("uses a stable digest without storing the original key", () => {
    vi.stubEnv("NEXTAUTH_SECRET", "test-secret");
    const digest = hashRateLimitKey("contact:203.0.113.10");
    expect(digest).toBe(hashRateLimitKey("contact:203.0.113.10"));
    expect(digest).not.toContain("203.0.113.10");
  });

  it("separates keys when the configured secret changes", () => {
    vi.stubEnv("NEXTAUTH_SECRET", "first-secret");
    const firstDigest = hashRateLimitKey("contact:203.0.113.10");
    vi.stubEnv("NEXTAUTH_SECRET", "second-secret");
    expect(hashRateLimitKey("contact:203.0.113.10")).not.toBe(firstDigest);
  });
});

describe("contactSchema", () => {
  it("accepts a valid message", () => {
    const parsed = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@doe.com",
      subject: "",
      body: "Hello, I have a project inquiry for you.",
      website: "",
    });
    expect(parsed.success).toBe(true);
  });

  it("rejects short body and filled honeypot", () => {
    const parsed = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@doe.com",
      body: "short",
      website: "http://spam.io",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("profileSchema", () => {
  it("requires a valid email", () => {
    const parsed = profileSchema.safeParse({
      fullName: "Alex Carter",
      title: "Dev",
      shortBio: "A reasonably long short bio here.",
      longBio: "A long bio that is definitely longer than twenty characters.",
      email: "not-an-email",
      available: true,
    });
    expect(parsed.success).toBe(false);
  });

  it("accepts an optional international phone number and rejects invalid values", () => {
    const profile = {
      fullName: "Berlinkoueni",
      title: "Developer",
      shortBio: "A short bio that is long enough.",
      longBio: "A long bio that is definitely longer than twenty characters.",
      email: "berlinkoueni25@gmail.com",
      available: false,
    };

    expect(profileSchema.safeParse({ ...profile, phone: "+237653021373" }).success).toBe(true);
    expect(profileSchema.safeParse({ ...profile, phone: "not a phone" }).success).toBe(false);
  });
});

describe("projectSchema", () => {
  it("keeps tags as comma string and validates slug format", () => {
    const parsed = projectSchema.safeParse({
      title: "Test Project",
      slug: "test-project",
      description: "A description that is long enough.",
      tags: "a, b, c",
      status: "PUBLISHED",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.tags).toBe("a, b, c");
    }
  });

  it("rejects uppercase slugs", () => {
    const parsed = projectSchema.safeParse({
      title: "Test Project",
      slug: "Test-Project",
      description: "A description that is long enough.",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("skillSchema", () => {
  it("coerces numeric level from strings", () => {
    const parsed = skillSchema.safeParse({
      name: "React",
      category: "FRONTEND",
      level: "85",
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.level).toBe(85);
  });
});

describe("articleSchema", () => {
  it("requires minimum content length", () => {
    const parsed = articleSchema.safeParse({
      title: "Some Article",
      slug: "some-article",
      excerpt: "An excerpt long enough.",
      content: "too short",
    });
    expect(parsed.success).toBe(false);
  });
});

describe("misc utils", () => {
  it("initials takes first two words", () => {
    expect(initials("Alex Carter")).toBe("AC");
  });

  it("formatDate returns a stable string", () => {
    expect(formatDate(new Date("2026-06-14T00:00:00Z"))).toMatch(/2026/);
  });
});
