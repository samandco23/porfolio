import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { profileContent, projectsContent, skillsContent } from "./content";
import { DEFAULT_SITE_CONTENT } from "../src/lib/site-content";

const prisma = new PrismaClient();
async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Set a valid ADMIN_EMAIL.");
  if (!password || password.length < 16) throw new Error("ADMIN_PASSWORD requires at least 16 characters.");
  if (process.argv.includes("--verify-only")) {
    const [profile, projects, skills, links, content, moments] = await Promise.all([
      prisma.profile.findUnique({ where: { id: "default" }, select: { fullName: true, title: true, siteName: true } }),
      prisma.project.findMany({ where: { slug: { in: projectsContent.map((project) => project.slug) } }, select: { slug: true, status: true, featured: true } }),
      prisma.skill.findMany({ select: { name: true, category: true, featured: true } }),
      prisma.socialLink.findMany({ where: { profileId: "default", isVisible: true }, select: { label: true, url: true } }),
      prisma.siteContent.count({ where: { id: "default" } }),
      prisma.moment.count(),
    ]);
    const seededSkills = skillsContent.filter((expected) => skills.some((actual) => actual.name === expected.name && actual.category === expected.category));
    if (!profile || profile.fullName !== profileContent.fullName || projects.length !== projectsContent.length || projects.some((project) => project.status !== "PUBLISHED") || seededSkills.length !== skillsContent.length || content !== 1) throw new Error("Seed verification failed");
    console.log(JSON.stringify({ profile, publishedSeedProjects: projects.length, featuredSeedProjects: projects.filter((project) => project.featured).length, seededSkills: seededSkills.length, mainStack: skills.filter((skill) => skill.featured).length, socialLinks: links, editableSiteContent: content === 1, moments }, null, 2));
    return;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  // Match existing skills and social links to retain their IDs. Never clear user data.
  const [existingSkills, existingLinks] = await Promise.all([
    prisma.skill.findMany({ select: { id: true, category: true, name: true } }),
    prisma.socialLink.findMany({ where: { profileId: "default" }, select: { id: true, url: true } }),
  ]);
  const socialLinks = [
    { label: "GitHub", url: "https://github.com/alphaomegacorporate", iconKey: "github", order: 0 },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/berlinkoueni/", iconKey: "linkedin", order: 1 },
  ];
  const normalize = (value: string) => value.trim().toLowerCase();
  await prisma.$transaction([
    prisma.user.upsert({ where: { email }, update: { passwordHash }, create: { email, passwordHash, name: profileContent.fullName } }),
    prisma.profile.upsert({ where: { id: "default" }, create: { id: "default", ...profileContent }, update: profileContent }),
    prisma.siteContent.upsert({ where: { id: "default" }, create: { id: "default", data: DEFAULT_SITE_CONTENT }, update: {} }),
    ...projectsContent.map((data) => prisma.project.upsert({ where: { slug: data.slug }, create: data, update: data })),
    ...skillsContent.map((data) => {
      const existing = existingSkills.find((skill) => skill.category === data.category && normalize(skill.name) === normalize(data.name));
      const id = existing?.id || `seed-${data.category.toLowerCase()}-${data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
      return prisma.skill.upsert({ where: { id }, create: { id, ...data }, update: data });
    }),
    ...socialLinks.map((data) => {
      const existing = existingLinks.find((link) => link.url.replace(/\/$/, "") === data.url.replace(/\/$/, ""));
      const id = existing?.id || `seed-social-${data.iconKey}`;
      return prisma.socialLink.upsert({ where: { id }, create: { id, profileId: "default", isVisible: true, ...data }, update: { ...data, isVisible: true } });
    }),
  ]);
  console.log(`Seed complete: Berlin Koueni, ${projectsContent.length} published projects (${projectsContent.filter((p) => p.featured).length} featured), ${skillsContent.length} skills (${skillsContent.filter((s) => s.featured).length} in main stack), GitHub and LinkedIn.`);
}
main().catch((error: unknown) => {
  // Avoid leaking database credentials in provider error messages.
  const code = error && typeof error === "object" && "code" in error ? String(error.code) : "connection or configuration error";
  console.error(`Database seed failed (${code}). Check database connectivity and admin configuration.`);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
