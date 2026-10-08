"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";
import { socialLinkSchema, type SocialLinkInput } from "@/lib/validators";
import { saveSocialLink, deleteSocialLink } from "@/lib/actions/admin";
import { SOCIAL_ICON_KEYS, SOCIAL_ICON_MAP } from "@/components/social-icon";
import { Field } from "./profile-form";

type SocialLinkRecord = {
  id: string;
  label: string;
  url: string;
  iconKey: string;
  order: number;
  isVisible: boolean;
};

type ActionState = { ok: boolean; message: string; errors: Record<string, string> };
const IDLE: ActionState = { ok: false, message: "", errors: {} };

export function SocialLinksManager({ socialLinks }: { socialLinks: SocialLinkRecord[] }) {
  const [state, setState] = useState<ActionState>(IDLE);
  const [pending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SocialLinkInput>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: { label: "", url: "https://", iconKey: "link", order: 0, isVisible: true },
  });

  const onCreate = (values: SocialLinkInput) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(values)) fd.append(k, String(v ?? ""));
    startTransition(async () => {
      const result = await saveSocialLink(IDLE, fd);
      setState(result);
      if (result.ok) reset();
    });
  };

  const toggleVisibility = (link: SocialLinkRecord) => {
    const fd = new FormData();
    fd.append("id", link.id);
    fd.append("label", link.label);
    fd.append("url", link.url);
    fd.append("iconKey", link.iconKey);
    fd.append("order", String(link.order));
    fd.append("isVisible", link.isVisible ? "off" : "on");
    startTransition(async () => setState(await saveSocialLink(IDLE, fd)));
  };

  return (
    <div className="space-y-4">
      <h2 className="font-mono text-sm text-zinc-300">Social links</h2>

      <div className="space-y-2">
        {socialLinks.length === 0 && (
          <p className="font-mono text-xs text-zinc-600">No social links yet.</p>
        )}
        {socialLinks.map((link) => {
          const Icon = SOCIAL_ICON_MAP[link.iconKey] ?? SOCIAL_ICON_MAP.link;
          return (
            <div
              key={link.id}
              className="flex items-center gap-3 border border-zinc-800 bg-base-400 px-4 py-3"
            >
              <Icon className="h-4 w-4 shrink-0 text-zinc-500" />
              <span className="font-mono text-sm text-zinc-200">{link.label}</span>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="min-w-0 flex-1 truncate font-mono text-xs text-zinc-500 hover:text-accent"
              >
                {link.url}
              </a>
              <span className="font-mono text-[10px] text-zinc-700">#{link.order}</span>
              <form action={deleteSocialLink} onSubmit={(event) => {
                if (!window.confirm(`Delete the ${link.label} link? This cannot be undone.`)) event.preventDefault();
              }}>
                <input type="hidden" name="id" value={link.id} />
                <button
                  type="submit"
                  className="p-1.5 text-zinc-600 hover:text-red-400"
                  aria-label={`Delete ${link.label}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
              <button
                type="button"
                onClick={() => toggleVisibility(link)}
                disabled={pending}
                className="p-1.5 text-zinc-600 hover:text-accent"
                aria-label={`Toggle ${link.label} visibility`}
              >
                {link.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Add new link */}
      <form
        onSubmit={handleSubmit(onCreate)}
        className="grid gap-4 border border-zinc-800 bg-base-400 p-5 sm:grid-cols-[1fr_2fr_auto_auto_auto]"
      >
        <Field label="Label" error={errors.label?.message}>
          <input className="input-dark" placeholder="GitHub" {...register("label")} />
        </Field>
        <Field label="URL" error={errors.url?.message}>
          <input className="input-dark" placeholder="https://github.com/..." {...register("url")} />
        </Field>
        <Field label="Icon" error={errors.iconKey?.message}>
          <select className="input-dark" {...register("iconKey")}>
            {SOCIAL_ICON_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Order" error={errors.order?.message}>
          <input type="number" className="input-dark w-20" {...register("order")} />
        </Field>
        <div className="flex items-end">
          <button type="submit" disabled={pending} className="btn-primary">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
        {state.message && (
          <p className={`font-mono text-xs sm:col-span-5 ${state.ok ? "text-accent" : "text-red-400"}`}>
            {state.ok ? "✓ " : "✗ "}
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
