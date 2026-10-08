import { SiteContentForm } from "./site-content-form";
import { resolveSiteContent } from "@/lib/site-content";
import { prisma } from "@/lib/db";
import { ProfileForm } from "./profile-form";
import { SocialLinksManager } from "./social-links-manager";
import { imageUploadConfigured, contactNotificationsConfigured } from "@/lib/integrations";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Profile & Settings" };

export default async function AdminSettingsPage() {
  const [profile, socialLinks, siteContent] = await Promise.all([
    getProfileSafe(),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
    prisma.siteContent.findUnique({ where: { id: "default" } }),
  ]);

  return (
    <div className="max-w-4xl space-y-10">
      <div>
        <p className="section-label">{"// configuration"}</p>
        <h1 className="mt-2 font-mono text-2xl text-white">Profile & Settings</h1>
        <p className="mt-2 font-mono text-xs text-zinc-600">
          Changes are applied to the public site immediately after saving.
        </p>
      </div>

      <section className="border-y border-zinc-800 py-6">
        <h2 className="font-mono text-lg text-white">Connected services</h2>
        <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="text-zinc-400">Image uploads</dt><dd className="mt-1 text-[#00FF66]">{imageUploadConfigured() ? "Cloudinary connected" : "Not connected · image URLs still work"}</dd></div>
          <div><dt className="text-zinc-400">Contact notifications</dt><dd className="mt-1 text-[#00FF66]">{contactNotificationsConfigured() ? "Email notifications enabled" : "Not connected · messages stay in your inbox"}</dd></div>
        </dl>
      </section>
      <ProfileForm profile={profile} uploadEnabled={imageUploadConfigured()} />
      <SocialLinksManager socialLinks={serializableLinks(socialLinks)} />
      <SiteContentForm content={resolveSiteContent(siteContent?.data)} />
    </div>
  );
}

async function getProfileSafe() {
  const profile = await prisma.profile.findUnique({ where: { id: "default" } });
  return (
    profile ?? {
      id: "default",
      siteName: "Portfolio",
      siteUrl: null,
      tagline: "",
      specialties: "",
      fullName: "",
      alias: null,
      title: "",
      shortBio: "",
      longBio: "",
      email: "",
      phone: null,
      location: null,
      avatarUrl: null,
      resumeUrl: null,
      seoTitle: null,
      seoDescription: null,
      available: true,
    }
  );
}

function serializableLinks(links: { id: string; label: string; url: string; iconKey: string; order: number; isVisible: boolean }[]) {
  return links.map((l) => ({
    id: l.id,
    label: l.label,
    url: l.url,
    iconKey: l.iconKey,
    order: l.order,
    isVisible: l.isVisible,
  }));
}
