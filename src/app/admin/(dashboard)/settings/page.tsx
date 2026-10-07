import { prisma } from "@/lib/db";
import { ProfileForm } from "./profile-form";
import { SocialLinksManager } from "./social-links-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Profile & Settings" };

export default async function AdminSettingsPage() {
  const [profile, socialLinks] = await Promise.all([
    getProfileSafe(),
    prisma.socialLink.findMany({ orderBy: { order: "asc" } }),
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

      <ProfileForm profile={profile} />
      <SocialLinksManager socialLinks={serializableLinks(socialLinks)} />
    </div>
  );
}

async function getProfileSafe() {
  const profile = await prisma.profile.findUnique({ where: { id: "default" } });
  return (
    profile ?? {
      id: "default",
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
