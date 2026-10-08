import type { PrismaClient } from "@prisma/client";
import { verifiedMoments } from "./moments-content";
import { DEFAULT_SITE_CONTENT } from "../src/lib/site-content";
export async function updateMoments(prisma: PrismaClient) {
  await prisma.$transaction(async (tx) => {
    const entries = [];
    for (const { english, ...data } of verifiedMoments) {
      const moment = await tx.moment.upsert({ where: { slug: data.slug }, create: data, update: {} });
      entries.push({ moment, english });
    }
    const row = await tx.siteContent.findUnique({ where: { id: "default" } });
    const current = row?.data && typeof row.data === "object" && !Array.isArray(row.data) ? row.data : {};
    const translations = Object.fromEntries(entries.flatMap(({ moment, english }) => Object.entries(english).map(([field, value]) => [`en:entity.moment.${moment.id}.${field}`, value])));
    const data = { ...DEFAULT_SITE_CONTENT, ...translations, ...current };
    await tx.siteContent.upsert({ where: { id: "default" }, create: { id: "default", data }, update: { data } });
    console.log("Moments ready: verified GetSmarter team victory published; SMI-CYBER ecosystem note saved as a draft. Existing moment edits preserved.");
  }, { timeout: 120000, maxWait: 30000 });
}
