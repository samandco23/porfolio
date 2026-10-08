import { afterEach, describe, expect, it, vi } from "vitest";
import { MAX_IMAGE_BYTES, uploadImage, validateImage } from "@/lib/image-upload";

const png = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aC1cAAAAASUVORK5CYII=", "base64");
afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });

describe("image uploads", () => {
  it("accepts a PNG and rejects fake images, SVGs and oversized files", async () => {
    await expect(validateImage(new File([png], "test.png", { type: "image/png" }))).resolves.toBeUndefined();
    await expect(validateImage(new File(["not an image"], "fake.png", { type: "image/png" }))).rejects.toThrow("valid");
    await expect(validateImage(new File(["<svg></svg>"], "test.svg", { type: "image/svg+xml" }))).rejects.toThrow("valid");
    await expect(validateImage(new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], "big.png", { type: "image/png" }))).rejects.toThrow("4 MB");
  });

  it("uploads with server credentials and returns only the HTTPS asset URL", async () => {
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "test-cloud");
    vi.stubEnv("CLOUDINARY_API_KEY", "test-key");
    vi.stubEnv("CLOUDINARY_API_SECRET", "test-secret");
    const fetchMock = vi.fn().mockResolvedValue(Response.json({ secure_url: "https://res.cloudinary.com/test-cloud/image/upload/test.png" }));
    vi.stubGlobal("fetch", fetchMock);
    const url = await uploadImage(new File([png], "test.png", { type: "image/png" }));
    expect(url).toBe("https://res.cloudinary.com/test-cloud/image/upload/test.png");
    expect(fetchMock.mock.calls[0][0]).toBe("https://api.cloudinary.com/v1_1/test-cloud/image/upload");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(`Basic ${Buffer.from("test-key:test-secret").toString("base64")}`);
    expect(url).not.toContain("secret");
  });
});
