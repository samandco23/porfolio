import { beforeEach, describe, expect, it, vi } from "vitest";
import { getHomeProjects } from "@/lib/queries";

const findMany = vi.hoisted(() => vi.fn());
vi.mock("@/lib/db", () => ({ prisma: { project: { findMany } } }));
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));
vi.mock("react", () => ({ cache: (fn: unknown) => fn }));

beforeEach(() => vi.resetAllMocks());

describe("home page projects", () => {
  it("prefers the published featured selection", async () => {
    findMany.mockResolvedValue([{ id: "featured", tags: '["nextjs"]' }]);
    const result = await getHomeProjects(3);
    expect(result.hasFeatured).toBe(true);
    expect(result.projects[0].tagList).toEqual(["nextjs"]);
    expect(findMany).toHaveBeenCalledTimes(1);
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { status: "PUBLISHED", featured: true }, take: 3,
    }));
  });

  it("shows the latest published projects when none are featured", async () => {
    findMany.mockResolvedValueOnce([]).mockResolvedValueOnce([{ id: "latest", tags: "[]" }]);
    const result = await getHomeProjects(3);
    expect(result.hasFeatured).toBe(false);
    expect(result.projects[0].id).toBe("latest");
    expect(findMany).toHaveBeenLastCalledWith({
      where: { status: "PUBLISHED" },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 3,
    });
  });

  it("returns an empty selection when no projects are published", async () => {
    findMany.mockResolvedValue([]);
    expect(await getHomeProjects(3)).toEqual({ projects: [], hasFeatured: false });
  });
});
