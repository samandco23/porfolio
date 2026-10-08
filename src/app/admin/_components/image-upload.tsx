"use client";

import { useId, useState } from "react";
import { Upload } from "lucide-react";

export function ImageUpload({ enabled, onUploaded, label = "Upload image" }: {
  enabled: boolean;
  onUploaded: (url: string) => void;
  label?: string;
}) {
  const id = useId();
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) { setMessage("Choose an image smaller than 4 MB."); return; }
    setPending(true);
    setMessage("");
    try {
      const data = new FormData();
      data.set("file", file);
      const response = await fetch("/api/admin/upload", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok || typeof result.url !== "string") throw new Error(result.error || "Upload failed.");
      onUploaded(result.url);
      setMessage("Image uploaded. Save your changes to publish it.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed. Please try again.");
    } finally { setPending(false); }
  }

  return (
    <div className="mt-3 space-y-2 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent">
      {enabled ? (
        <>
          <label htmlFor={id} className="btn-ghost cursor-pointer text-xs">
            <Upload aria-hidden="true" className="h-3.5 w-3.5" /> {pending ? "Uploading…" : label}
          </label>
          <input id={id} type="file" accept="image/jpeg,image/png,image/webp,image/avif" disabled={pending}
            className="sr-only" onChange={(event) => {
              void upload(event.target.files?.[0]);
              event.target.value = "";
            }} />
          <p className="font-mono text-[11px] text-zinc-500">JPEG, PNG, WebP or AVIF · up to 4 MB</p>
        </>
      ) : <p className="font-mono text-xs text-zinc-500">Image upload is not connected yet. You can paste an image URL.</p>}
      <p role="status" aria-live="polite" className="font-mono text-xs text-zinc-300">{message}</p>
    </div>
  );
}
