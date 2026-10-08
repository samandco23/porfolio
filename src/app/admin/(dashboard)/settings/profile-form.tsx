"use client";

import { Children, cloneElement, isValidElement, useId, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { profileSchema, type ProfileInput } from "@/lib/validators";
import { saveProfile } from "@/lib/actions/admin";
import { ImageUpload } from "@/app/admin/_components/image-upload";

type ActionState = { ok: boolean; message: string; errors: Record<string, string> };

export type ProfileRecord = {
  id: string;
  fullName: string;
  alias: string | null;
  title: string;
  siteName: string;
  siteUrl: string | null;
  tagline: string;
  specialties: string;
  shortBio: string;
  longBio: string;
  email: string;
  phone: string | null;
  location: string | null;
  avatarUrl: string | null;
  resumeUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  available: boolean;
};

export function ProfileForm({ profile, uploadEnabled = false }: { profile: ProfileRecord; uploadEnabled?: boolean }) {
  const [state, setState] = useState<ActionState>({ ok: false, message: "", errors: {} });
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.fullName,
      alias: profile.alias ?? "",
      title: profile.title,
      siteName: profile.siteName,
      siteUrl: profile.siteUrl ?? "",
      tagline: profile.tagline,
      specialties: profile.specialties,
      shortBio: profile.shortBio,
      longBio: profile.longBio,
      email: profile.email,
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      avatarUrl: profile.avatarUrl ?? "",
      resumeUrl: profile.resumeUrl ?? "",
      seoTitle: profile.seoTitle ?? "",
      seoDescription: profile.seoDescription ?? "",
      available: profile.available,
    },
  });

  const onSubmit = (values: ProfileInput) => {
    const fd = new FormData();
    for (const [key, value] of Object.entries(values)) {
      fd.append(key, String(value ?? ""));
    }
    startTransition(async () => {
      const result = await saveProfile({ ok: false, message: "", errors: {} }, fd);
      setState(result);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card-dark space-y-5 p-6">
      <h2 className="font-mono text-sm text-zinc-300">Identity</h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name *" error={state.errors?.fullName ?? errors.fullName?.message}>
          <input className="input-dark" {...register("fullName")} />
        </Field>
        <Field label="Alias / handle" error={state.errors?.alias ?? errors.alias?.message}>
          <input className="input-dark" placeholder="zer0cool" {...register("alias")} />
        </Field>
        <Field label="Title / role *" error={state.errors?.title ?? errors.title?.message}>
          <input
            className="input-dark"
            placeholder="Full-Stack Developer & Cybersecurity Engineer"
            {...register("title")}
          />
        </Field>
        <Field label="Location" error={state.errors?.location ?? errors.location?.message}>
          <input className="input-dark" placeholder="City, Country" {...register("location")} />
        </Field>
        <Field label="Email *" error={state.errors?.email ?? errors.email?.message}>
          <input className="input-dark" type="email" {...register("email")} />
        </Field>
        <Field label="Phone" error={state.errors?.phone ?? errors.phone?.message}>
          <input className="input-dark" type="tel" placeholder="+237 653 021 373" {...register("phone")} />
        </Field>
        <Field label="Availability">
          <label className="flex cursor-pointer items-center gap-3 font-mono text-sm text-zinc-300">
            <input type="checkbox" className="h-4 w-4 accent-accent" {...register("available")} />
            Show &quot;Open to work&quot; badge on the site
          </label>
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Site name / brand" error={errors.siteName?.message ?? state.errors.siteName}><input className="input-dark" {...register("siteName")} /></Field>
        <Field label="Public website URL" error={errors.siteUrl?.message ?? state.errors.siteUrl}><input className="input-dark" {...register("siteUrl")} /></Field>
        <Field label="Tagline" error={errors.tagline?.message ?? state.errors.tagline}><input className="input-dark" {...register("tagline")} /></Field>
        <Field label="Specialties" error={errors.specialties?.message ?? state.errors.specialties}><input className="input-dark" {...register("specialties")} /></Field>
      </div>

      <Field label="Short bio *" hint="Shown on the home hero. 280 chars max." error={state.errors?.shortBio ?? errors.shortBio?.message}>
        <textarea rows={3} className="input-dark resize-y" {...register("shortBio")} />
      </Field>

      <Field label="Long bio *" hint="Markdown supported — displayed on /about." error={state.errors?.longBio ?? errors.longBio?.message}>
        <textarea rows={10} className="input-dark resize-y" {...register("longBio")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Avatar URL" error={state.errors?.avatarUrl ?? errors.avatarUrl?.message}>
          <input className="input-dark" placeholder="https://..." {...register("avatarUrl")} />
          <ImageUpload enabled={uploadEnabled} onUploaded={(url) => setValue("avatarUrl", url, { shouldDirty: true, shouldValidate: true })} />
        </Field>
        <Field label="Resume URL (PDF)" error={state.errors?.resumeUrl ?? errors.resumeUrl?.message}>
          <input className="input-dark" placeholder="https://..." {...register("resumeUrl")} />
        </Field>
        <Field label="SEO title" error={state.errors?.seoTitle ?? errors.seoTitle?.message}>
          <input className="input-dark" {...register("seoTitle")} />
        </Field>
        <Field
          label="SEO description"
          error={state.errors?.seoDescription ?? errors.seoDescription?.message}
        >
          <input className="input-dark" {...register("seoDescription")} />
        </Field>
      </div>

      <div className="flex items-center gap-4 border-t border-zinc-800 pt-5">
        <button type="submit" disabled={pending} className="btn-primary">
          <Save className="h-4 w-4" /> {pending ? "Saving..." : "Save profile"}
        </button>
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

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const generatedId = useId();
  const nodes = Children.toArray(children);
  const control = nodes.find((node): node is React.ReactElement<React.HTMLAttributes<HTMLElement>> =>
    isValidElement<React.HTMLAttributes<HTMLElement>>(node)
    && typeof node.type === "string"
    && ["input", "textarea", "select"].includes(node.type),
  );
  const id = control?.props.id ?? generatedId;
  const descriptionId = `${id}-description`;
  return (
    <div>
      {control ? <label htmlFor={id} className="label-dark">{label}</label> : <span className="label-dark">{label}</span>}
      {nodes.map((node) => node === control ? cloneElement(control, {
        id,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error || hint ? descriptionId : undefined,
      }) : node)}
      {hint && !error && <p id={descriptionId} className="mt-1 font-mono text-[11px] text-zinc-600">{hint}</p>}
      {error && <p id={descriptionId} role="alert" className="mt-1 font-mono text-xs text-red-400">{error}</p>}
    </div>
  );
}
