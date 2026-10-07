import { getPublishedProjects, getProfile } from "@/lib/queries";
import { ProjectsExplorer } from "./projects-explorer";

export const dynamic = "force-dynamic";

export const metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const [projects, profile] = await Promise.all([getPublishedProjects(), getProfile()]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
      <p className="section-label">02 {"//"} code & hardware</p>
      <h1 className="mt-2 font-mono text-3xl text-white md:text-4xl">Projects</h1>
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
