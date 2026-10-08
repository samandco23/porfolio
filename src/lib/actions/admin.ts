"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";
import { getAdminPath } from "@/lib/admin-path";
import { readFormBoolean } from "@/lib/form-data";
import { PUBLIC_CACHE_TAG } from "@/lib/public-cache";
import { serializeProjectContent } from "@/lib/project-content";
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
  id?: string;
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
  revalidateTag(PUBLIC_CACHE_TAG);
  revalidatePath("/", "layout");
}

// ─── Profile ─────────────────────────────────────────────────

export async function saveProfile(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = profileSchema.safeParse({
    ...Object.fromEntries(formData),
    available: readFormBoolean(formData, "available"),
  });

  if (!parsed.success) return fail("Validation failed", zodFieldErrors(parsed.error));

  const d = parsed.data;
  await prisma.profile.upsert({
    where: { id: "default" },
    create: { id: "default", ...d },
    update: { ...d },
  });

  refreshPublicPages();
  revalidatePath(`${getAdminPath()}/settings`);
  return ok("Profile saved — the site is updated.");
}

// ─── Social links ────────────────────────────────────────────

export async function saveSocialLink(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin();
  const parsed = socialLinkSchema.safeParse({
    ...Object.fromEntries(formData),
    isVisible: readFormBoolean(formData, "isVisible"),
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
  revalidatePath(`${getAdminPath()}/settings`);
  return ok("Social link saved.");
}

export async function deleteSocialLink(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  if (id) await prisma.socialLink.delete({ where: { id: String(id) } });
  refreshPublicPages();
  revalidatePath(`${getAdminPath()}/settings`);
}

// ─── Projects ────────────────────────────────────────────────

function projectDataFrom(formData: FormData) {
  return {
    ...Object.fromEntries(formData),
    tags: String(formData.get("tags") ?? ""),
    featured: readFormBoolean(formData, "featured"),
    order: formData.get("order") ?? 0,
  };
}

export async function saveProject(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = projectSchema.safeParse(projectDataFrom(formData));

  if (!parsed.success) return fail("Validation failed", zodFieldErrors(parsed.error));

  const { tags, content, challenge, approach, outcome, screenshots, ...rest } = parsed.data;
  const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean).slice(0, 12);
  const data = {
    ...rest,
    content: serializeProjectContent(content, { challenge, approach, outcome, screenshots }),
    tags: JSON.stringify(tagList),
  };
  const id = formData.get("id");
  let savedId: string | undefined;

  try {
    if (id) {
      const saved = await prisma.project.update({ where: { id: String(id) }, data });
      savedId = saved.id;
    } else {
      const saved = await prisma.project.create({ data });
      savedId = saved.id;
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
  revalidatePath(`${getAdminPath()}/projects`);
  return { ...ok("Project saved."), id: savedId };
}

export async function deleteProject(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  if (id) await prisma.project.delete({ where: { id: String(id) } });
  refreshPublicPages();
  revalidatePath(`${getAdminPath()}/projects`);
}

export async function toggleProjectFeatured(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  if (!id) return;
  const project = await prisma.project.findUnique({ where: { id: String(id) } });
  if (!project) return;
  await prisma.project.update({
    where: { id: project.id },
    data: { featured: !project.featured },
  });
  refreshPublicPages();
  revalidatePath(`${getAdminPath()}/projects`);
}

// ─── Skills ──────────────────────────────────────────────────

export async function saveSkill(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = skillSchema.safeParse({
    ...Object.fromEntries(formData),
    isVisible: readFormBoolean(formData, "isVisible"),
    featured: readFormBoolean(formData, "featured"),
  });

  if (!parsed.success) return fail("Validation failed", zodFieldErrors(parsed.error));

  const id = formData.get("id");
  if (id) {
    await prisma.skill.update({ where: { id: String(id) }, data: parsed.data });
  } else {
    await prisma.skill.create({ data: parsed.data });
  }

  refreshPublicPages();
  revalidatePath(`${getAdminPath()}/skills`);
  return ok("Skill saved.");
}

export async function deleteSkill(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  if (id) await prisma.skill.delete({ where: { id: String(id) } });
  refreshPublicPages();
  revalidatePath(`${getAdminPath()}/skills`);
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
  await requireAdmin();
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

  let savedId: string | undefined;
  try {
    if (id) {
      const saved = await prisma.article.update({ where: { id: String(id) }, data });
      savedId = saved.id;
    } else {
      const saved = await prisma.article.create({ data });
      savedId = saved.id;
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
  revalidatePath(`${getAdminPath()}/blog`);
  return { ...ok("Article saved."), id: savedId };
}

export async function deleteArticle(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  if (id) await prisma.article.delete({ where: { id: String(id) } });
  refreshPublicPages();
  revalidatePath(`${getAdminPath()}/blog`);
}

// ─── Messages (inbox) ────────────────────────────────────────

export async function setMessageState(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  const state = String(formData.get("state") ?? "");
  if (!id || !["UNREAD", "READ", "ARCHIVED"].includes(state)) return;

  await prisma.message.update({
    where: { id: String(id) },
    data: { status: state as "UNREAD" | "READ" | "ARCHIVED" },
  });

  revalidatePath(`${getAdminPath()}/messages`);
  revalidatePath(getAdminPath());
}

export async function deleteMessage(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = formData.get("id");
  if (id) await prisma.message.delete({ where: { id: String(id) } });
  revalidatePath(`${getAdminPath()}/messages`);
  revalidatePath(getAdminPath());
}

export async function saveSiteContent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const { siteContentSchema } = await import("@/lib/site-content");
  const parsed = siteContentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return fail("Validation failed", zodFieldErrors(parsed.error));
  const current = await prisma.siteContent.findUnique({ where: { id: "default" } });
  const data = { ...(current?.data && typeof current.data === "object" && !Array.isArray(current.data) ? current.data : {}), ...parsed.data };
  await prisma.siteContent.upsert({ where: { id: "default" }, create: { id: "default", data }, update: { data } });
  refreshPublicPages();
  revalidatePath(`${getAdminPath()}/settings`);
  return ok("Public site content saved.");
}

export async function saveMoment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireAdmin();
  const { momentSchema, readPhotoLines } = await import("@/lib/moments");
  const parsed = momentSchema.safeParse({ ...Object.fromEntries(formData), featured: readFormBoolean(formData, "featured") });
  if (!parsed.success) return fail("Validation failed", zodFieldErrors(parsed.error));
  const { images, date, ...rest } = parsed.data;
  const data = { ...rest, date: date || null, images: JSON.stringify(readPhotoLines(images)) };
  const id = String(formData.get("id") ?? "");
  let saved;
  try { saved = id ? await prisma.moment.update({ where: { id }, data }) : await prisma.moment.create({ data }); }
  catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") return fail("This slug is already used.", { slug: "Slug already used" });
    throw error;
  }
  refreshPublicPages();
  revalidatePath(`${getAdminPath()}/moments`);
  return { ...ok("Moment saved."), id: saved.id };
}
export async function deleteMoment(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await prisma.moment.delete({ where: { id } });
  refreshPublicPages();
  revalidatePath(`${getAdminPath()}/moments`);
}
