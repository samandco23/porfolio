"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { projectSchema, type ProjectInput } from "@/lib/validators";
import { saveProject } from "@/lib/actions/admin";
import { slugify } from "@/lib/utils";
import { Field } from "@/app/admin/(dashboard)/settings/profile-form";

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
};

export function ProjectEditor({ project }: { project?: ProjectRecord }) {
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
        },
  });

  const slug = watch("slug");

  const onSubmit = (values: ProjectInput) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(values)) {
      fd.append(k, String(v ?? ""));
    }
    if (project?.id) fd.append("id", project.id);
    startTransition(async () => setState(await saveProject({ ok: false, message: "", errors: {} }, fd)));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="card-dark space-y-5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title *">
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

        <Field label="Content (markdown)" hint="Full project write-up displayed on the detail page.">
          <textarea rows={12} className="input-dark resize-y" {...register("content")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Image URL" error={state.errors?.imageUrl ?? errors.imageUrl?.message}>
            <input className="input-dark" placeholder="https://..." {...register("imageUrl")} />
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
              <input type="checkbox" className="h-4 w-4 accent-[#00FF66]" {...register("featured")} />
              Show on home page
            </label>
          </Field>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn-primary">
          <Save className="h-4 w-4" /> {pending ? "Saving..." : "Save project"}
        </button>
        {state.message && (
          <p className={`font-mono text-xs ${state.ok ? "text-[#00FF66]" : "text-red-400"}`}>
            {state.ok ? "✓ " : "✗ "}
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
