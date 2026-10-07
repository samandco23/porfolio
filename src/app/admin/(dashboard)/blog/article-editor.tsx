"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { articleSchema, type ArticleInput } from "@/lib/validators";
import { saveArticle } from "@/lib/actions/admin";
import { slugify } from "@/lib/utils";
import { Field } from "@/app/admin/(dashboard)/settings/profile-form";

type ActionState = { ok: boolean; message: string; errors: Record<string, string> };

export type ArticleRecord = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl: string | null;
  tags: string; // comma-separated
  status: "DRAFT" | "PUBLISHED";
  publishedAt: string | null; // datetime-local string
};

export function ArticleEditor({ article }: { article?: ArticleRecord }) {
  const [state, setState] = useState<ActionState>({ ok: false, message: "", errors: {} });
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(articleSchema),
    defaultValues: article
      ? {
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          content: article.content,
          coverUrl: article.coverUrl ?? "",
          tags: article.tags,
          status: article.status,
          publishedAt: article.publishedAt ?? "",
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          content: "",
          coverUrl: "",
          tags: "",
          status: "DRAFT" as const,
          publishedAt: "",
        },
  });

  const slug = watch("slug");

  const onSubmit = (values: ArticleInput) => {
    const fd = new FormData();
    fd.append("title", values.title);
    fd.append("slug", values.slug);
    fd.append("excerpt", values.excerpt);
    fd.append("content", values.content);
    fd.append("coverUrl", values.coverUrl ?? "");
    fd.append("tags", values.tags ?? "");
    fd.append("status", values.status);
    fd.append("publishedAt", values.publishedAt ?? "");
    if (article?.id) fd.append("id", article.id);

    startTransition(async () => setState(await saveArticle({ ok: false, message: "", errors: {} }, fd)));
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

        <Field label="Excerpt *" error={state.errors?.excerpt ?? errors.excerpt?.message}>
          <textarea rows={2} className="input-dark resize-y" {...register("excerpt")} />
        </Field>

        <Field label="Content (markdown) *" error={state.errors?.content ?? errors.content?.message}>
          <textarea rows={14} className="input-dark resize-y" {...register("content")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Cover image URL" error={state.errors?.coverUrl ?? errors.coverUrl?.message}>
            <input className="input-dark" placeholder="https://..." {...register("coverUrl")} />
          </Field>
          <Field label="Tags" hint="Comma-separated, max 12.">
            <input className="input-dark" placeholder="security, osint" {...register("tags")} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Status">
            <select className="input-dark" {...register("status")}>
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </Field>
          <Field label="Publish date" hint="Defaults to now on first publish.">
            <input type="datetime-local" className="input-dark" {...register("publishedAt")} />
          </Field>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="submit" disabled={pending} className="btn-primary">
          <Save className="h-4 w-4" /> {pending ? "Saving..." : "Save article"}
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
