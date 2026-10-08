import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import PreviewProject, { metadata as projectMetadata } from "@/app/admin/(dashboard)/projects/[id]/preview/page";
import PreviewArticle, { metadata as articleMetadata } from "@/app/admin/(dashboard)/blog/[id]/preview/page";

const mocks = vi.hoisted(() => ({ auth: vi.fn(), project: vi.fn(), article: vi.fn() }));
vi.mock("@/lib/admin-auth", () => ({ requireAdmin: mocks.auth }));
vi.mock("@/lib/db", () => ({ prisma: { project: { findUnique: mocks.project }, article: { findUnique: mocks.article } } }));
vi.mock("@/components/project-detail", () => ({ ProjectDetail: () => "Project preview content" }));
vi.mock("@/components/article-detail", () => ({ ArticleDetail: () => "Article preview content" }));

beforeEach(() => vi.resetAllMocks());

describe("private previews", () => {
  it.each([PreviewProject, PreviewArticle])("checks authentication before loading a draft", async (page) => {
    mocks.auth.mockRejectedValue(new Error("Unauthorized"));
    await expect(page({ params: Promise.resolve({ id: "draft" }) })).rejects.toThrow("Unauthorized");
    expect(mocks.project).not.toHaveBeenCalled();
    expect(mocks.article).not.toHaveBeenCalled();
  });

  it("renders a saved project draft without publishing it", async () => {
    mocks.auth.mockResolvedValue(undefined);
    mocks.project.mockResolvedValue({ id: "draft", status: "DRAFT", tags: "[]" });
    const markup = renderToStaticMarkup(await PreviewProject({ params: Promise.resolve({ id: "draft" }) }));
    expect(markup).toContain("Private preview");
    expect(markup).toContain("Draft");
    expect(markup).toContain("Project preview content");
    expect(projectMetadata.robots).toEqual({ index: false, follow: false });
    expect(articleMetadata.robots).toEqual({ index: false, follow: false });
  });
});
