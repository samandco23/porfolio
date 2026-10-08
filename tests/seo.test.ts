import { afterEach, describe, expect, it, vi } from "vitest";
import { pageMetadata, serializeJsonLd } from "@/lib/seo";
import { GET } from "@/app/api/og/route";

vi.mock("@/lib/queries", () => ({
  getSiteContent: vi.fn().mockResolvedValue({ "og.site": "Build · Secure · Scale" }),
  getProfile: vi.fn().mockResolvedValue({ fullName: "Portfolio Owner", shortBio: "Projects and ideas." }),
  getMomentBySlug: vi.fn().mockResolvedValue(null),
  getProjectBySlug: vi.fn().mockResolvedValue(null),
  getArticleBySlug: vi.fn().mockResolvedValue(null),
}));
afterEach(() => vi.unstubAllEnvs());

describe("public metadata", () => {
  it("sets a canonical URL and sharing metadata for the correct project", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    const metadata = await pageMetadata({ title: "My project", description: "A project description.", path: "/projects/my-project", kind: "project", slug: "my-project" });
    expect(metadata.alternates?.canonical).toBe("https://example.com/projects/my-project");
    expect(metadata.twitter).toEqual(expect.objectContaining({
      card: "summary_large_image", images: ["https://example.com/api/og?kind=project&slug=my-project"],
    }));
  });

  it("prevents script-tag injection in JSON-LD", () => {
    const value = { name: "</script><script>alert(1)</script>" };
    const serialized = serializeJsonLd(value);
    expect(serialized).not.toContain("</script>");
    expect(JSON.parse(serialized)).toEqual(value);
  });

  it("does not disclose a draft through the sharing-image endpoint", async () => {
    const response = await GET(new Request("https://example.com/api/og?kind=project&slug=draft-project"));
    expect(response.status).toBe(404);
  });

  it("does not disclose a draft moment through its sharing image", async () => {
    const response = await GET(new Request("https://example.com/api/og?kind=moment&slug=private-memory"));
    expect(response.status).toBe(404);
  });

  it("generates a PNG sharing image without fetching a private image", async () => {
    const response = await GET(new Request("https://example.com/api/og?kind=site"));
    expect(response.headers.get("content-type")).toBe("image/png");
    const png = Buffer.from(await response.arrayBuffer());
    expect(png.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  });
});
