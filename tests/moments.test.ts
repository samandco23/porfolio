import { describe, expect, it, vi } from "vitest";
import { momentSchema, parseMomentPhotos, photoLines, readPhotoLines } from "@/lib/moments";
import { getMomentBySlug, getFeaturedMoments, getPublishedMoments } from "@/lib/queries";
const mocks = vi.hoisted(() => ({ moment: { findUnique: vi.fn(), findMany: vi.fn() } }));
vi.mock("@/lib/db", () => ({ prisma: mocks }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
vi.mock("react", async (original) => ({ ...await original<typeof import("react")>(), cache: (fn: unknown) => fn }));
const entry = { title: "My event", slug: "my-event", kind: "EVENT", description: "A real event description." };
describe("moments and galleries", () => {
  it("supports calendar dates and rejects impossible dates", () => {
    expect(momentSchema.safeParse({ ...entry, date: "2024-02-29" }).success).toBe(true);
    expect(momentSchema.safeParse({ ...entry, date: "2026-02-29" }).success).toBe(false);
    expect(momentSchema.safeParse({ ...entry, date: "" }).success).toBe(true);
    expect(momentSchema.safeParse({ ...entry, date: "2025" }).success).toBe(true);
    expect(momentSchema.safeParse({ ...entry, date: "2025-04" }).success).toBe(true);
    expect(momentSchema.safeParse({ ...entry, date: "2025-13" }).success).toBe(false);
  });
  it("retains captions through gallery serialization", () => {
    const text = "https://example.com/a.jpg | First photo\nhttps://example.com/b.jpg";
    expect(photoLines(JSON.stringify(readPhotoLines(text)))).toBe(text);
  });
  it("rejects unsafe URLs, oversized galleries and malformed stored JSON", () => {
    expect(momentSchema.safeParse({ ...entry, images: "data:text/html,test" }).success).toBe(false);
    expect(momentSchema.safeParse({ ...entry, images: Array(21).fill("https://example.com/photo.jpg").join("\n") }).success).toBe(false);
    expect(parseMomentPhotos("bad JSON")).toEqual([]);
    expect(parseMomentPhotos(JSON.stringify([{ url: "javascript:alert(1)", caption: "test" }]))).toEqual([]);
  });
  it("keeps draft memories private", async () => {
    mocks.moment.findUnique.mockResolvedValue({ ...entry, status: "DRAFT" });
    expect(await getMomentBySlug("my-event")).toBeNull();
    mocks.moment.findUnique.mockResolvedValue({ ...entry, status: "PUBLISHED" });
    expect(await getMomentBySlug("my-event")).toEqual(expect.objectContaining({ status: "PUBLISHED" }));
  });
  it("only lists published moments and published homepage selections", async () => {
    mocks.moment.findMany.mockResolvedValue([]);
    await getPublishedMoments();
    expect(mocks.moment.findMany).toHaveBeenLastCalledWith(expect.objectContaining({ where: { status: "PUBLISHED" } }));
    await getFeaturedMoments();
    expect(mocks.moment.findMany).toHaveBeenLastCalledWith(expect.objectContaining({ where: { status: "PUBLISHED", featured: true }, take: 3 }));
  });
});
