
import { SiteText } from "@/components/site-content";
import { pageMetadata } from "@/lib/seo";
import { getPublishedProjects, getProfile, getSiteContent } from "@/lib/localized-queries";
import { ProjectsExplorer } from "./projects-explorer";

export async function generateMetadata() {
  const copy = await getSiteContent();
  return pageMetadata({ title: copy["seo.projects.title"], description: copy["seo.projects.description"], path: "/projects" });
}

export default async function ProjectsPage() {
  const [projects, profile] = await Promise.all([getPublishedProjects(), getProfile()]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <p className="section-label">02 {"//"} <SiteText name="app.projects.page.1" /> </p>
      <h1 className="mt-2 font-mono text-3xl text-white md:text-4xl"> <SiteText name="app.projects.page.2" /> </h1>
      <p className="mt-3 max-w-2xl text-zinc-400">
        {profile?.shortBio ?? ""}
      </p>

      <ProjectsExplorer
        projects={projects.map((p) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          imageUrl: p.imageUrl,
          year: p.year,
          featured: p.featured,
          tagList: p.tagList,
        }))}
      />
    </div>
  );
}
