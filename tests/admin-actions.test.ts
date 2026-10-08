import { beforeEach, describe, expect, it, vi } from "vitest";
import * as actions from "@/lib/actions/admin";

const mocks = vi.hoisted(() => {
  const model = () => ({
    findUnique: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), upsert: vi.fn(),
  });
  return {
    session: vi.fn(),
    revalidate: vi.fn(),
    invalidate: vi.fn(),
    db: {
      user: model(), profile: model(), project: model(),
      moment: model(), siteContent: model(), skill: model(), socialLink: model(), article: model(), message: model(),
    },
  };
});

vi.mock("next-auth", () => ({ getServerSession: mocks.session }));
vi.mock("@/auth", () => ({ authOptions: {} }));
vi.mock("@/lib/db", () => ({ prisma: mocks.db }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate, revalidateTag: mocks.invalidate, unstable_cache: (fn: unknown) => fn }));

const idle = { ok: false, message: "", errors: {} };
function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

beforeEach(() => {
  vi.resetAllMocks();
  mocks.session.mockResolvedValue({ user: { id: "admin" } });
  mocks.db.user.findUnique.mockResolvedValue({ id: "admin" });
  mocks.db.moment.create.mockResolvedValue({ id: "moment" });
  mocks.db.moment.update.mockResolvedValue({ id: "moment" });
  mocks.db.project.create.mockResolvedValue({ id: "created" });
  mocks.db.project.update.mockResolvedValue({ id: "updated" });
});

describe("admin action authorization", () => {
  const calls = [
    ["saveMoment", () => actions.saveMoment(idle, new FormData())],
    ["deleteMoment", () => actions.deleteMoment(form({ id: "moment" }))],
    ["saveSiteContent", () => actions.saveSiteContent(idle, new FormData())],
    ["saveProfile", () => actions.saveProfile(idle, new FormData())],
    ["saveSocialLink", () => actions.saveSocialLink(idle, new FormData())],
    ["saveProject", () => actions.saveProject(idle, new FormData())],
    ["saveSkill", () => actions.saveSkill(idle, new FormData())],
    ["saveArticle", () => actions.saveArticle(idle, new FormData())],
    ["deleteSocialLink", () => actions.deleteSocialLink(form({ id: "item" }))],
    ["deleteProject", () => actions.deleteProject(form({ id: "item" }))],
    ["toggleProjectFeatured", () => actions.toggleProjectFeatured(form({ id: "item" }))],
    ["deleteSkill", () => actions.deleteSkill(form({ id: "item" }))],
    ["deleteArticle", () => actions.deleteArticle(form({ id: "item" }))],
    ["setMessageState", () => actions.setMessageState(form({ id: "item", state: "READ" }))],
    ["deleteMessage", () => actions.deleteMessage(form({ id: "item" }))],
  ] as const;

  it.each(calls)("rejects an anonymous caller of %s before accessing data", async (_name, call) => {
    mocks.session.mockResolvedValue(null);
    await expect(call()).rejects.toThrow("Unauthorized");
    for (const model of Object.values(mocks.db)) {
      for (const method of Object.values(model)) expect(method).not.toHaveBeenCalled();
    }
    expect(mocks.revalidate).not.toHaveBeenCalled();
    expect(mocks.invalidate).not.toHaveBeenCalled();
  });

  it("rejects an existing session after the admin account is deleted", async () => {
    mocks.db.user.findUnique.mockResolvedValue(null);
    await expect(actions.deleteProject(form({ id: "item" }))).rejects.toThrow("Unauthorized");
    expect(mocks.db.project.delete).not.toHaveBeenCalled();
  });
});

describe("admin form booleans", () => {
  it.each(["true", "on", "false", "off"])("saves the project featured value %s correctly", async (value) => {
    const result = await actions.saveProject(idle, form({
      title: "My project", slug: "my-project", description: "A real project description.",
      featured: value, status: "PUBLISHED",
    }));
    expect(result.ok).toBe(true);
    expect(mocks.invalidate).toHaveBeenCalledWith("portfolio-public");
    expect(mocks.db.project.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ featured: value === "true" || value === "on" }),
    });
  });

  it("preserves availability submitted by the profile editor", async () => {
    await actions.saveProfile(idle, form({
      fullName: "Test Admin", title: "Developer", shortBio: "A short biography.",
      longBio: "A longer biography for this profile.", email: "admin@example.com", available: "true",
    }));
    expect(mocks.db.profile.upsert).toHaveBeenCalledWith(expect.objectContaining({
      update: expect.objectContaining({ available: true }),
    }));
  });

  it("creates visible social links and skills from serialized booleans", async () => {
    await actions.saveSocialLink(idle, form({ label: "GitHub", url: "https://github.com/example", isVisible: "true" }));
    await actions.saveSkill(idle, form({ name: "React", category: "FRONTEND", level: "80", isVisible: "true" }));
    for (const model of [mocks.db.socialLink, mocks.db.skill]) {
      expect(model.create).toHaveBeenCalledWith({ data: expect.objectContaining({ isVisible: true }) });
    }
  });
});


describe("editable site content", () => {
  it("stores public copy and invalidates cached public reads", async () => {
    const result = await actions.saveSiteContent(idle, form({ "home.stackTitle": "My stack", "site.footerNote": "" }));
    expect(result.ok).toBe(true);
    expect(mocks.db.siteContent.upsert).toHaveBeenCalledWith(expect.objectContaining({ update: { data: { "home.stackTitle": "My stack", "site.footerNote": "" } } }));
    expect(mocks.invalidate).toHaveBeenCalledWith("portfolio-public");
  });
  it("rejects unrecognized content fields", async () => {
    const result = await actions.saveSiteContent(idle, form({ "database.password": "secret" }));
    expect(result.ok).toBe(false);
    expect(mocks.db.siteContent.upsert).not.toHaveBeenCalled();
  });
  it("saves an optional skill level and homepage selection", async () => {
    const result = await actions.saveSkill(idle, form({ name: "Docker", category: "DEVOPS", level: "", featured: "true", isVisible: "true", order: "7" }));
    expect(result.ok).toBe(true);
    expect(mocks.db.skill.create).toHaveBeenCalledWith({ data: expect.objectContaining({ level: null, featured: true, category: "DEVOPS", order: 7 }) });
  });
});


describe("moment administration", () => {
  it("persists a draft gallery with captions and without an invented date", async () => {
    const result = await actions.saveMoment(idle, form({ title: "My album", slug: "my-album", kind: "GALLERY", description: "A personal album description.", images: "https://example.com/photo.jpg | First photo", status: "DRAFT", featured: "true" }));
    expect(result).toEqual(expect.objectContaining({ ok: true, id: "moment" }));
    expect(mocks.db.moment.create).toHaveBeenCalledWith({ data: expect.objectContaining({ status: "DRAFT", date: null, featured: true, images: JSON.stringify([{ url: "https://example.com/photo.jpg", caption: "First photo" }]) }) });
    expect(mocks.invalidate).toHaveBeenCalledWith("portfolio-public");
  });
  it("rejects invalid gallery URLs before writing", async () => {
    const result = await actions.saveMoment(idle, form({ title: "My album", slug: "my-album", kind: "GALLERY", description: "A personal album description.", images: "javascript:alert(1)" }));
    expect(result.ok).toBe(false);
    expect(mocks.db.moment.create).not.toHaveBeenCalled();
  });
});
