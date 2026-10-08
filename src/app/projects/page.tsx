
import { SiteText } from "@/components/site-content";
import { pageMetadata } from "@/lib/seo";
import { getPublishedProjects, getSiteContent } from "@/lib/localized-queries";
import { PageHeading } from "@/components/page-heading";
import { ProjectsExplorer } from "./projects-explorer";

export async function generateMetadata() {
  const copy = await getSiteContent();
  return pageMetadata({ title: copy["seo.projects.title"], description: copy["seo.projects.description"], path: "/projects" });
}

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <div className="page-shell section-space">
      <PageHeading label={<SiteText name="app.projects.page.1" />} title={<SiteText name="app.projects.page.2" />} description={<SiteText name="redesign.projectsIntro" />} />

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
