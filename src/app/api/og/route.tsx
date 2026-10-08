import { ImageResponse } from "next/og";
import { getProfile, getProjectBySlug, getArticleBySlug, getSiteContent, getMomentBySlug } from "@/lib/queries";
import { SITE_NAME } from "@/lib/constants";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const kind = params.get("kind") || "site";
  const slug = params.get("slug") || "";
  if (!["site", "project", "article", "moment"].includes(kind) || slug.length > 96) {
    return new Response(null, { status: 400 });
  }
  const [profile, content] = await Promise.all([getProfile(), getSiteContent()]);
  const item = kind === "project" ? await getProjectBySlug(slug)
    : kind === "article" ? await getArticleBySlug(slug) : kind === "moment" ? await getMomentBySlug(slug) : null;
  if (kind !== "site" && !item) return new Response(null, { status: 404 });
  const title = item?.title || profile?.seoTitle || profile?.fullName || SITE_NAME;
  const description = item
    ? ("description" in item ? item.description : item.excerpt)
    : profile?.shortBio || profile?.title || "Portfolio";
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#050505", color: "#fff", padding: "60px", borderLeft: "12px solid #00ff66" }}>
      <div style={{ display: "flex", fontSize: 26, color: "#00ff66" }}>{profile?.siteName || profile?.fullName || SITE_NAME}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", fontSize: title.length > 65 ? 48 : 64, lineHeight: 1.15, fontWeight: 700 }}>{title.slice(0, 160)}</div>
        <div style={{ display: "flex", fontSize: 26, color: "#a1a1aa", lineHeight: 1.4 }}>{description.slice(0, 180)}</div>
      </div>
      <div style={{ display: "flex", fontSize: 22, color: "#71717a" }}>{content[`og.${kind}`]}</div>
    </div>,
    { width: 1200, height: 630, headers: { "Cache-Control": "no-store" } },
  );
}
