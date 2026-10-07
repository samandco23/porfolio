import { afterEach, describe, expect, it, vi } from "vitest";
import { getSiteUrl } from "@/lib/site-url";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("getSiteUrl", () => {
  it("uses localhost in development when no site URL is configured", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");

    expect(getSiteUrl().origin).toBe("http://localhost:3000");
  });

  it("uses the configured HTTPS origin in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example");

    expect(getSiteUrl().origin).toBe("https://portfolio.example");
  });

  it("uses Vercel system URLs when the public URL is not configured", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "portfolio.example");

    expect(getSiteUrl().origin).toBe("https://portfolio.example");
  });

  it("uses the current deployment URL for Vercel previews", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "portfolio-git-test.vercel.app");

    expect(getSiteUrl().origin).toBe("https://portfolio-git-test.vercel.app");
  });

  it("rejects non-HTTPS production URLs", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://portfolio.example");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");

    expect(() => getSiteUrl()).toThrow("must use HTTPS in production");
  });

  it("rejects URLs containing a path or credentials", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://user:password@portfolio.example/path");

    expect(() => getSiteUrl()).toThrow("public site origin");
  });
});
