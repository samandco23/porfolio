"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import {
  profileSchema,
  socialLinkSchema,
  projectSchema,
  skillSchema,
  articleSchema,
  zodFieldErrors,
} from "@/lib/validators";

// ─── Helpers ─────────────────────────────────────────────────

type ActionState = {
  ok: boolean;
  message: string;
  errors: Record<string, string>;
};

const ok = (message: string): ActionState => ({ ok: true, message, errors: {} });
const fail = (message: string, errors: Record<string, string> = {}): ActionState => ({
  ok: false,
  message,
  errors,
});

function refreshPublicPages() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/projects");
  revalidatePath("/blog");
}

// ─── Profile ─────────────────────────────────────────────────

export async function saveProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = profileSchema.safeParse({
    ...Object.fromEntries(formData),
    available: formData.get("available") === "on",
  });

  if (!parsed.success) return fail("Validation failed", zodFieldErrors(parsed.error));

  const d = parsed.data;
  await prisma.profile.upsert({
    where: { id: "default" },
    create: { id: "default", ...d },
    update: { ...d },
  });

  refreshPublicPages();
  revalidatePath("/admin/settings");
  return ok("Profile saved — the site is updated.");
}

// ─── Social links ────────────────────────────────────────────

export async function saveSocialLink(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = socialLinkSchema.safeParse({
    ...Object.fromEntries(formData),
    isVisible: formData.get("isVisible") === "on",
  });

  if (!parsed.success) return fail("Validation failed", zodFieldErrors(parsed.error));

  const id = formData.get("id");
  const data = parsed.data;

  if (id) {
    await prisma.socialLink.update({ where: { id: String(id) }, data });
  } else {
    await prisma.socialLink.create({
      data: { ...data, profileId: "default" },
    });
  }

  refreshPublicPages();
  revalidatePath("/admin/settings");
  return ok("Social link saved.");
}

export async function deleteSocialLink(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (id) await prisma.socialLink.delete({ where: { id: String(id) } });
  refreshPublicPages();
  revalidatePath("/admin/settings");
}

// ─── Projects ────────────────────────────────────────────────

function projectDataFrom(formData: FormData) {
  return {
    ...Object.fromEntries(formData),
    tags: String(formData.get("tags") ?? ""),
    featured: formData.get("featured") === "on",
    order: formData.get("order") ?? 0,
  };
}

export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = projectSchema.safeParse(projectDataFrom(formData));

  if (!parsed.success) return fail("Validation failed", zodFieldErrors(parsed.error));

  const { tags, ...rest } = parsed.data;
  const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 12);
  const data = { ...rest, tags: JSON.stringify(tagList) };
  const id = formData.get("id");

  try {
    if (id) {
      await prisma.project.update({ where: { id: String(id) }, data });
    } else {
      await prisma.project.create({ data });
    }
  } catch (e: unknown) {
    if (
      typeof e === "object" && e !== null && "code" in e && (e as { code?: string }).code === "P2002"
    ) {
      return fail("A project with this slug already exists.", { slug: "Slug already used" });
    }
    throw e;
  }

  refreshPublicPages();
  revalidatePath("/admin/projects");
  return ok("Project saved.");
}

export async function deleteProject(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (id) await prisma.project.delete({ where: { id: String(id) } });
  refreshPublicPages();
  revalidatePath("/admin/projects");
}

export async function toggleProjectFeatured(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (!id) return;
  const project = await prisma.project.findUnique({ where: { id: String(id) } });
  if (!project) return;
  await prisma.project.update({
    where: { id: project.id },
    data: { featured: !project.featured },
  });
  refreshPublicPages();
  revalidatePath("/admin/projects");
}

// ─── Skills ──────────────────────────────────────────────────

export async function saveSkill(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = skillSchema.safeParse({
    ...Object.fromEntries(formData),
    isVisible: formData.get("isVisible") === "on",
  });

  if (!parsed.success) return fail("Validation failed", zodFieldErrors(parsed.error));

  const id = formData.get("id");
  if (id) {
    await prisma.skill.update({ where: { id: String(id) }, data: parsed.data });
  } else {
    await prisma.skill.create({ data: parsed.data });
  }

  refreshPublicPages();
  revalidatePath("/admin/skills");
  return ok("Skill saved.");
}

export async function deleteSkill(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (id) await prisma.skill.delete({ where: { id: String(id) } });
  refreshPublicPages();
  revalidatePath("/admin/skills");
}

// ─── Articles ────────────────────────────────────────────────

function articleDataFrom(formData: FormData) {
  const raw: Record<string, unknown> = {
    ...Object.fromEntries(formData),
    tags: String(formData.get("tags") ?? ""),
    publishedAt: String(formData.get("publishedAt") ?? ""),
  };
  if (!raw.publishedAt) delete raw.publishedAt;
  return raw;
}

export async function saveArticle(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = articleSchema.safeParse(articleDataFrom(formData));

  if (!parsed.success) return fail("Validation failed", zodFieldErrors(parsed.error));

  const { tags, publishedAt, ...rest } = parsed.data;
  const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 12);
  const data = {
    ...rest,
    tags: JSON.stringify(tagList),
    publishedAt: publishedAt ? new Date(publishedAt) : null,
  };
  const id = formData.get("id");

  // Auto-set publishedAt when an article is first published
  if (data.publishedAt === null && data.status === "PUBLISHED") {
    data.publishedAt = new Date();
  }

  try {
    if (id) {
      await prisma.article.update({ where: { id: String(id) }, data });
    } else {
      await prisma.article.create({ data });
    }
  } catch (e: unknown) {
    if (
      typeof e === "object" && e !== null && "code" in e && (e as { code?: string }).code === "P2002"
    ) {
      return fail("An article with this slug already exists.", { slug: "Slug already used" });
    }
    throw e;
  }

  refreshPublicPages();
  revalidatePath("/admin/blog");
  return ok("Article saved.");
}

export async function deleteArticle(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (id) await prisma.article.delete({ where: { id: String(id) } });
  refreshPublicPages();
  revalidatePath("/admin/blog");
}

// ─── Messages (inbox) ────────────────────────────────────────

export async function setMessageState(formData: FormData): Promise<void> {
  const id = formData.get("id");
  const state = String(formData.get("state") ?? "");
  if (!id || !["UNREAD", "READ", "ARCHIVED"].includes(state)) return;

  await prisma.message.update({
    where: { id: String(id) },
    data: { status: state as "UNREAD" | "READ" | "ARCHIVED" },
  });

  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}

export async function deleteMessage(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (id) await prisma.message.delete({ where: { id: String(id) } });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
