"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { projectSchema, type ProjectInput } from "@/lib/validators";
import { saveProject } from "@/lib/actions/admin";
import { slugify } from "@/lib/utils";
import { Field } from "@/app/admin/(dashboard)/settings/profile-form";
import { ImageUpload } from "@/app/admin/_components/image-upload";

type ActionState = { ok: boolean; message: string; errors: Record<string, string> };

export type ProjectRecord = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  tags: string; // comma-separated in the form
  featured: boolean;
  status: "DRAFT" | "PUBLISHED";
  year: string | null;
  order: number;
  challenge?: string;
  approach?: string;
  outcome?: string;
  screenshots?: string;
};

export function ProjectEditor({ project, uploadEnabled = false, adminBase }: {
  project?: ProjectRecord; uploadEnabled?: boolean; adminBase: string;
}) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>({ ok: false, message: "", errors: {} });
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: project
      ? {
          ...project,
          imageUrl: project.imageUrl ?? "",
          repoUrl: project.repoUrl ?? "",
          demoUrl: project.demoUrl ?? "",
          year: project.year ?? "",
          challenge: project.challenge ?? "",
          approach: project.approach ?? "",
          outcome: project.outcome ?? "",
          screenshots: project.screenshots ?? "",
        }
      : {
          title: "",
          slug: "",
          description: "",
          content: "",
          imageUrl: "",
          repoUrl: "",
          demoUrl: "",
          tags: "",
          featured: false,
          status: "DRAFT",
          year: "",
          order: 0,
          challenge: "", approach: "", outcome: "", screenshots: "",
        },
  });

  const slug = watch("slug");

  const onSubmit = (values: ProjectInput) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(values)) {
      fd.append(k, String(v ?? ""));
    }
    if (project?.id) fd.append("id", project.id);
    startTransition(async () => {
      try {
        const result = await saveProject({ ok: false, message: "", errors: {} }, fd);
        setState(result);
        if (result.ok && result.id && !project?.id) router.replace(`${adminBase}/projects/${result.id}`);
        else if (result.ok) router.refresh();
      } catch {
        setState({ ok: false, message: "Could not save. Check your connection and sign in again if needed.", errors: {} });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="card-dark space-y-5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title *" error={state.errors?.title ?? errors.title?.message}>
            <input
              className="input-dark"
              {...register("title", {
                onBlur: (e) => {
                  if (!slug && e.target.value) {
                    setValue("slug", slugify(e.target.value), { shouldValidate: true });
                  }
                },
              })}
            />
          </Field>
          <Field label="Slug *" error={state.errors?.slug ?? errors.slug?.message}>
            <input className="input-dark" {...register("slug")} />
          </Field>
        </div>

        <Field label="Short description *" error={state.errors?.description ?? errors.description?.message}>
          <textarea rows={2} className="input-dark resize-y" {...register("description")} />
        </Field>

        <Field label="Content (markdown)" hint="Additional details, technical notes or lessons learned." error={state.errors?.content ?? errors.content?.message}>
          <textarea rows={12} className="input-dark resize-y" {...register("content")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Image URL" error={state.errors?.imageUrl ?? errors.imageUrl?.message}>
            <input className="input-dark" placeholder="https://..." {...register("imageUrl")} />
            <ImageUpload enabled={uploadEnabled} onUploaded={(url) => setValue("imageUrl", url, { shouldDirty: true, shouldValidate: true })} />
          </Field>
          <Field label="Year" error={state.errors?.year ?? errors.year?.message}>
            <input className="input-dark" placeholder="2026" {...register("year")} />
          </Field>
          <Field label="Repository URL" error={state.errors?.repoUrl ?? errors.repoUrl?.message}>
            <input className="input-dark" placeholder="https://github.com/..." {...register("repoUrl")} />
          </Field>
          <Field label="Demo URL" error={state.errors?.demoUrl ?? errors.demoUrl?.message}>
            <input className="input-dark" placeholder="https://..." {...register("demoUrl")} />
          </Field>
        </div>

        <Field label="Tags" hint="Comma-separated, max 12. e.g. nextjs, rust, iot">
          <input className="input-dark" placeholder="nextjs, security, iot" {...register("tags")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Status">
            <select className="input-dark" {...register("status")}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </Field>
          <Field label="Display order">
            <input type="number" className="input-dark" {...register("order")} />
          </Field>
          <Field label="Featured">
            <label className="flex cursor-pointer items-center gap-3 font-mono text-sm text-zinc-300">
              <input type="checkbox" className="h-4 w-4 accent-accent" {...register("featured")} />
              Show on home page
            </label>
          </Field>
        </div>
      </div>

      <section className="card-dark space-y-5 p-6" aria-labelledby="case-study-heading">
        <h2 id="case-study-heading" className="font-mono text-lg text-white">Tell the story</h2>
        <p className="text-sm text-zinc-400">Show what you solved, the decisions you made and the results. These sections are optional.</p>
        <Field label="The challenge" hint="What problem needed solving? Who was it for?" error={state.errors?.challenge ?? errors.challenge?.message}>
          <textarea rows={4} className="input-dark resize-y" {...register("challenge")} />
        </Field>
        <Field label="The approach" hint="Your role, the technical choices and the constraints." error={state.errors?.approach ?? errors.approach?.message}>
          <textarea rows={4} className="input-dark resize-y" {...register("approach")} />
        </Field>
        <Field label="The outcome" hint="Concrete improvements, measured results or lessons learned." error={state.errors?.outcome ?? errors.outcome?.message}>
          <textarea rows={4} className="input-dark resize-y" {...register("outcome")} />
        </Field>
        <Field label="Screenshots" hint="Up to 6 image URLs, one per line." error={state.errors?.screenshots ?? errors.screenshots?.message}>
          <textarea rows={4} className="input-dark resize-y" {...register("screenshots")} />
        </Field>
        <ImageUpload enabled={uploadEnabled} label="Add a screenshot" onUploaded={(url) => {
          const current = watch("screenshots") || "";
          setValue("screenshots", [current.trim(), url].filter(Boolean).join("\n"), { shouldDirty: true, shouldValidate: true });
        }} />
      </section>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn-primary">
          <Save className="h-4 w-4" /> {pending ? "Saving..." : "Save project"}
        </button>
        {project?.id && <a href={`${adminBase}/projects/${project.id}/preview`} target="_blank" rel="noopener noreferrer" className="btn-ghost">Preview saved version</a>}
        {state.message && (
          <p role="status" aria-live="polite" className={`font-mono text-xs ${state.ok ? "text-accent" : "text-red-400"}`}>
            {state.ok ? "✓ " : "✗ "}
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
