import { PrismaClient } from "@prisma/client";
import { DEFAULT_SITE_CONTENT } from "../src/lib/site-content";
import previousDefaults from "./previous-copy.json";
import { seedTranslations } from "./translations";
export async function updateTranslations(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    const [row, profile, projects] = await Promise.all([
      tx.siteContent.findUnique({ where: { id: "default" } }),
      tx.profile.findUnique({ where: { id: "default" } }),
      tx.project.findMany({ select: { id: true, slug: true, description: true, content: true } }),
    ]);
    const current = row?.data && typeof row.data === "object" && !Array.isArray(row.data) ? row.data as Record<string, string> : {};
    const data = { ...DEFAULT_SITE_CONTENT, ...seedTranslations(profile, projects), ...current };
    for (const [key, value] of Object.entries(previousDefaults)) {
      if (current[key] === value) data[key] = DEFAULT_SITE_CONTENT[key] ?? value;
    }
    await tx.siteContent.upsert({ where: { id: "default" }, create: { id: "default", data }, update: { data } });
    console.log(`French/English content ready (${Object.keys(data).filter((key) => key.includes(":entity.")).length} translated editorial fields). Existing custom copy preserved.`);
  }, { maxWait: 15000, timeout: 60000 });
}
