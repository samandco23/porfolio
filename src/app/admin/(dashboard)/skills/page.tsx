import { prisma } from "@/lib/db";
import { SkillsManager } from "./skills-manager";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin — Skills" };

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return (
    <div className="max-w-4xl">
      <p className="section-label">{"// configuration"}</p>
      <h1 className="mt-2 font-mono text-2xl text-white">Skills</h1>
      <p className="mt-2 font-mono text-xs text-zinc-600">
        Grouped by category on the /about page. Drag-free ordering via the order field.
      </p>

      <div className="mt-8">
        <SkillsManager
          skills={skills.map((s) => ({
            id: s.id,
            name: s.name,
            category: s.category,
            level: s.level,
            iconKey: s.iconKey,
            order: s.order,
            isVisible: s.isVisible,
          }))}
        />
      </div>
    </div>
  );
}
