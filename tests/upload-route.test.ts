import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/admin/upload/route";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), upload: vi.fn(), configured: vi.fn() }));
vi.mock("@/lib/admin-auth", () => ({ requireAdmin: mocks.auth }));
vi.mock("@/lib/integrations", () => ({ imageUploadConfigured: mocks.configured }));
vi.mock("@/lib/image-upload", async (original) => ({ ...await original<typeof import("@/lib/image-upload")>(), uploadImage: mocks.upload }));

beforeEach(() => {
  vi.resetAllMocks();
  mocks.auth.mockResolvedValue(undefined);
  mocks.configured.mockReturnValue(true);
});
afterEach(() => vi.restoreAllMocks());

describe("admin upload endpoint", () => {
  it("rejects anonymous uploads before inspecting the file", async () => {
    mocks.auth.mockRejectedValue(new Error("Unauthorized"));
    const response = await POST(new Request("https://example.com/api/admin/upload", { method: "POST" }));
    expect(response.status).toBe(401);
    expect(mocks.upload).not.toHaveBeenCalled();
  });

  it("rejects cross-origin requests", async () => {
    const response = await POST(new Request("https://example.com/api/admin/upload", {
      method: "POST", headers: { origin: "https://attacker.example" },
    }));
    expect(response.status).toBe(403);
    expect(mocks.auth).not.toHaveBeenCalled();
  });

  it("explains missing configuration without attempting an upload", async () => {
    mocks.configured.mockReturnValue(false);
    const response = await POST(new Request("https://example.com/api/admin/upload", { method: "POST" }));
    expect(response.status).toBe(503);
    expect(mocks.upload).not.toHaveBeenCalled();
  });

  it("rejects disguised files even for an authenticated caller", async () => {
    const body = new FormData();
    body.set("file", new File(["malicious content"], "image.png", { type: "image/png" }));
    const response = await POST(new Request("https://example.com/api/admin/upload", { method: "POST", body }));
    expect(response.status).toBe(400);
    expect(mocks.upload).not.toHaveBeenCalled();
  });
});
