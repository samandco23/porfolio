"use client";

import Link from "next/link";
import { Trash2, Pencil, Eye } from "lucide-react";
import { deleteArticle } from "@/lib/actions/admin";

type Row = {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  publishedAt: string | null;
  tagList: string[];
};

export function ArticleRow({ adminBase, article }: { adminBase: string; article: Row }) {
  return (
    <div
      className={`flex items-center gap-4 border bg-[#0a0a0a] px-4 py-3 ${
        article.status === "PUBLISHED" ? "border-zinc-800" : "border-dashed border-zinc-800"
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link            href={`${adminBase}/blog/${article.id}`}
            className="truncate font-mono text-sm text-zinc-200 hover:text-[#00FF66]">
            {article.title}
          </Link>
          {article.status === "DRAFT" && (
            <span className="border border-zinc-700 px-1.5 py-0.5 font-mono text-[10px] uppercase text-zinc-500">
              draft
            </span>
          )}
        </div>
        <p className="mt-0.5 truncate font-mono text-[11px] text-zinc-600">
          /{article.slug}
          {article.publishedAt ? ` · ${article.publishedAt}` : " · unpublished"}
        </p>
      </div>

      <span className="hidden items-center gap-1 font-mono text-[11px] text-zinc-600 sm:flex">
        <Eye className="h-3.5 w-3.5" /> {article.views}
      </span>

      <Link
        href={`${adminBase}/blog/${article.id}`}
        className="p-1.5 text-zinc-600 hover:text-white"
        title="Edit"
        aria-label={`Edit ${article.title}`}
      >
        <Pencil className="h-4 w-4" />
      </Link>

      <form action={deleteArticle} onSubmit={(event) => {
        if (!window.confirm(`Delete “${article.title}”? This cannot be undone.`)) event.preventDefault();
      }}>
        <input type="hidden" name="id" value={article.id} />
        <button type="submit" className="p-1.5 text-zinc-600 hover:text-red-400" title="Delete" aria-label={`Delete ${article.title}`}>
          <Trash2 className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
