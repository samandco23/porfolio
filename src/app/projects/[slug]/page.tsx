import { notFound } from "next/navigation";
import { getProjectBySlug, getPublishedProjects, getProfile } from "@/lib/localized-queries";
import { ProjectDetail } from "@/components/project-detail";
import { ViewTracker } from "@/components/view-tracker";
import { pageMetadata, serializeJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";
import { localizedPath } from "@/lib/locale-routes";
import { readPreferences } from "@/lib/server-preferences";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found", robots: { index: false } };
  return pageMetadata({ title: project.title, description: project.description,
    path: `/projects/${project.slug}`, kind: "project", slug: project.slug });
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const [projects, profile, { locale }] = await Promise.all([getPublishedProjects(), getProfile(), readPreferences()]);
  const related = projects.filter((p) => p.slug !== project.slug && p.tagList.some((tag) => project.tagList.includes(tag))).slice(0, 3);
  const structuredData = {
    "@context": "https://schema.org", "@type": "CreativeWork",
    name: project.title, description: project.description,
    url: new URL(localizedPath(`/projects/${project.slug}`, locale), profile?.siteUrl || getSiteUrl()).toString(),
    image: project.imageUrl || undefined,
    dateModified: new Date(project.updatedAt).toISOString(),
    creator: profile?.fullName ? { "@type": "Person", name: profile.fullName } : undefined,
    keywords: project.tagList.join(", "),
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }} />
    <ProjectDetail project={project} related={related} />
    <ViewTracker kind="project" slug={slug} />
  </>;
}
