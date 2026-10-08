import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/views/route";

const mocks = vi.hoisted(() => ({ project: vi.fn(), article: vi.fn(), limit: vi.fn() }));
vi.mock("@/lib/db", () => ({ prisma: { project: { updateMany: mocks.project }, article: { updateMany: mocks.article } } }));
vi.mock("@/lib/rate-limit", () => ({ rateLimit: mocks.limit }));
beforeEach(() => vi.resetAllMocks());

function viewRequest(kind: string, slug = "my-project") {
  return new Request("https://example.com/api/views", {
    method: "POST", headers: { "x-real-ip": "203.0.113.1", "Content-Type": "application/json" },
    body: JSON.stringify({ kind, slug }),
  });
}

describe("view counters", () => {
  it("increments only a published project after passing the shared rate limit", async () => {
    mocks.limit.mockResolvedValue({ ok: true });
    expect((await POST(viewRequest("project"))).status).toBe(204);
    expect(mocks.project).toHaveBeenCalledWith({
      where: { slug: "my-project", status: "PUBLISHED" }, data: { views: { increment: 1 } },
    });
    expect(mocks.article).not.toHaveBeenCalled();
  });

  it("does not increment again within the same visitor window", async () => {
    mocks.limit.mockResolvedValue({ ok: false });
    expect((await POST(viewRequest("article"))).status).toBe(204);
    expect(mocks.article).not.toHaveBeenCalled();
  });

  it("rejects invalid content identifiers before touching the database", async () => {
    expect((await POST(viewRequest("project", "../admin"))).status).toBe(400);
    expect(mocks.limit).not.toHaveBeenCalled();
    expect(mocks.project).not.toHaveBeenCalled();
  });
});
