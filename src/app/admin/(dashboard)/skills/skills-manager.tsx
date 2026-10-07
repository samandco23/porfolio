"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Eye, EyeOff, Pencil, X, Save } from "lucide-react";
import { skillSchema, type SkillInput } from "@/lib/validators";
import { saveSkill, deleteSkill } from "@/lib/actions/admin";
import { SKILL_CATEGORIES, SKILL_CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type SkillRecord = {
  id: string;
  name: string;
  category: string;
  level: number;
  iconKey: string | null;
  order: number;
  isVisible: boolean;
};

type ActionState = { ok: boolean; message: string; errors: Record<string, string> };
const IDLE: ActionState = { ok: false, message: "", errors: {} };

export function SkillsManager({ skills }: { skills: SkillRecord[] }) {
  const [state, setState] = useState<ActionState>(IDLE);
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);

  const form = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", category: "FRONTEND", level: 80, iconKey: "", order: 0, isVisible: true },
  });

  const onCreate = (values: SkillInput) => {
    const fd = new FormData();
    for (const [k, v] of Object.entries(values)) fd.append(k, String(v ?? ""));
    startTransition(async () => {
      const result = await saveSkill(IDLE, fd);
      setState(result);
      if (result.ok) form.reset();
    });
  };

  const updateField = (skill: SkillRecord, patch: Partial<SkillInput>) => {
    const merged = { ...skill, ...patch };
    const fd = new FormData();
    fd.append("id", skill.id);
    fd.append("name", merged.name);
    fd.append("category", merged.category);
    fd.append("level", String(merged.level));
    fd.append("iconKey", merged.iconKey ?? "");
    fd.append("order", String(merged.order));
    fd.append("isVisible", merged.isVisible ? "on" : "off");
    startTransition(async () => setState(await saveSkill(IDLE, fd)));
  };

  return (
    <div className="space-y-8">
      {/* Add form */}
      <form
        onSubmit={form.handleSubmit(onCreate)}
        className="grid gap-4 border border-zinc-800 bg-[#0a0a0a] p-5 sm:grid-cols-[2fr_1fr_auto_auto_auto]"
      >
        <div>
          <label className="label-dark">Name</label>
          <input className="input-dark" placeholder="Rust" {...form.register("name")} />
          {form.formState.errors.name && (
            <p className="mt-1 font-mono text-xs text-red-400">{form.formState.errors.name.message}</p>
          )}
        </div>
        <div>
          <label className="label-dark">Category</label>
          <select className="input-dark" {...form.register("category")}>
            {SKILL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {SKILL_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-dark">Level</label>
          <input type="number" min={0} max={100} className="input-dark w-24" {...form.register("level")} />
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={pending} className="btn-primary">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </form>

      {state.message && (
        <p className={`font-mono text-xs ${state.ok ? "text-[#00FF66]" : "text-red-400"}`}>
          {state.ok ? "✓ " : "✗ "}
          {state.message}
        </p>
      )}

      {/* Grouped list */}
      {SKILL_CATEGORIES.map((category) => {
        const group = skills.filter((s) => s.category === category);
        if (!group.length) return null;

        return (
          <div key={category}>
            <h3 className="font-mono text-micro uppercase tracking-[0.18em] text-[#00FF66]">
              {SKILL_CATEGORY_LABELS[category]}
            </h3>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {group.map((skill) =>
                editingId === skill.id ? (
                  <SkillEditRow
                    key={skill.id}
                    skill={skill}
                    pending={pending}
                    onSave={(patch) => {
                      updateField(skill, patch);
                      setEditingId(null);
                    }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div
                    key={skill.id}
                    className={cn(
                      "flex items-center gap-3 border bg-[#0a0a0a] px-4 py-2.5",
                      skill.isVisible ? "border-zinc-800" : "border-dashed border-zinc-800",
                    )}
                  >
                    <span className="flex-1 truncate font-mono text-sm text-zinc-200">
                      {skill.name}
                    </span>
                    <span className="font-mono text-[11px] text-zinc-600">{skill.level}%</span>
                    <button
                      type="button"
                      onClick={() => setEditingId(skill.id)}
                      className="p-1 text-zinc-600 hover:text-white"
                      aria-label={`Edit ${skill.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => updateField(skill, { isVisible: !skill.isVisible })}
                      disabled={pending}
                      className="p-1 text-zinc-600 hover:text-[#00FF66]"
                      aria-label={`Toggle ${skill.name} visibility`}
                    >
                      {skill.isVisible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                    </button>
                    <form action={deleteSkill}>
                      <input type="hidden" name="id" value={skill.id} />
                      <button
                        type="submit"
                        className="p-1 text-zinc-600 hover:text-red-400"
                        aria-label={`Delete ${skill.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                ),
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SkillEditRow({
  skill,
  pending,
  onSave,
  onCancel,
}: {
  skill: SkillRecord;
  pending: boolean;
  onSave: (patch: Partial<SkillInput>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(skill.name);
  const [level, setLevel] = useState(skill.level);
  const [category, setCategory] = useState(skill.category);

  return (
    <div className="flex items-center gap-2 border border-[#00FF66]/40 bg-[#0a0a0a] px-3 py-2">
      <input
        className="input-dark flex-1"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <select className="input-dark w-32" value={category} onChange={(e) => setCategory(e.target.value)}>
        {SKILL_CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="number"
        min={0}
        max={100}
        className="input-dark w-16"
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
      />
      <button
        type="button"
        disabled={pending}
        onClick={() => onSave({ name, level, category } as Partial<SkillInput>)}
        className="p-1.5 text-[#00FF66]"
        aria-label="Save"
      >
        <Save className="h-4 w-4" />
      </button>
      <button type="button" onClick={onCancel} className="p-1.5 text-zinc-500 hover:text-white" aria-label="Cancel">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
