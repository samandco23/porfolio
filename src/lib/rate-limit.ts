import { createHmac } from "node:crypto";
import { prisma } from "@/lib/db";

export function hashRateLimitKey(value: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET is required for rate-limit key hashing in production.");
  }

  return createHmac("sha256", secret || "local-only-rate-limit-secret")
    .update(value)
    .digest("hex");
}

export async function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);
  const hashedKey = hashRateLimitKey(key);

  const changedRows = await prisma.$executeRaw`
    INSERT INTO "RateLimitBucket" ("key", "count", "resetAt")
    VALUES (${hashedKey}, 1, ${resetAt})
    ON CONFLICT ("key") DO UPDATE
    SET
      "count" = CASE
        WHEN "RateLimitBucket"."resetAt" <= ${now} THEN 1
        ELSE "RateLimitBucket"."count" + 1
      END,
      "resetAt" = CASE
        WHEN "RateLimitBucket"."resetAt" <= ${now} THEN ${resetAt}
        ELSE "RateLimitBucket"."resetAt"
      END
    WHERE
      "RateLimitBucket"."resetAt" <= ${now}
      OR "RateLimitBucket"."count" < ${limit}
  `;

  if (changedRows === 0) {
    const bucket = await prisma.rateLimitBucket.findUnique({
      where: { key: hashedKey },
      select: { resetAt: true },
    });
    if (!bucket) throw new Error("Rate-limit bucket disappeared before its retry window ended.");

    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt.getTime() - now.getTime()) / 1000)),
    };
  }

  if (Math.random() < 0.01) {
    await prisma.$executeRaw`
      DELETE FROM "RateLimitBucket"
      WHERE "key" IN (
        SELECT "key"
        FROM "RateLimitBucket"
        WHERE "resetAt" <= ${now}
        LIMIT 500
      )
    `;
  }

  return { ok: true, remaining: limit - 1, retryAfterSec: 0 };
}
