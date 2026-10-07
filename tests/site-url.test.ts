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

  it("requires a configured HTTPS origin in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://portfolio.example");

    expect(getSiteUrl().origin).toBe("https://portfolio.example");
  });

  it("rejects non-HTTPS production URLs", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "http://portfolio.example");

    expect(() => getSiteUrl()).toThrow("must use HTTPS in production");
  });

  it("rejects URLs containing a path or credentials", () => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://user:password@portfolio.example/path");

    expect(() => getSiteUrl()).toThrow("public site origin");
  });
});
