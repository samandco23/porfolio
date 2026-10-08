"use client";
import Image from "next/image";
import { useState } from "react";

export function ProjectCover({ title, slug, imageUrl, tags = [] }: { title: string; slug: string; imageUrl?: string | null; tags?: string[] }) {
  const [failed, setFailed] = useState<string | null>(null);
  const variant = [...slug].reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % 3;
  return <div className={`project-cover project-cover-${variant}`}>
    {imageUrl && imageUrl !== failed ? <Image src={imageUrl} alt={title} fill unoptimized onError={() => setFailed(imageUrl)} sizes="(max-width: 768px) 100vw, 60vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" /> : <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 800 500" fill="none" className="cover-geometry" preserveAspectRatio="xMidYMid slice">
        {variant === 0 ? <g stroke="currentColor">
          <path d="M-80 330L270 130l290 165 340-195M-80 405L270 205l290 165 340-195M270 130v300m290-135v205M0 85h800M0 415h800" opacity="0.35" />
          <path d="M295 30L620 220v230L295 260z" fill="currentColor" fillOpacity="0.035" />
          <path d="M445 10v490M0 250h800" opacity="0.18" />
          <circle cx="270" cy="130" r="5" fill="currentColor" /><circle cx="560" cy="295" r="5" fill="currentColor" />
        </g> : variant === 1 ? <g stroke="currentColor">
          {[90, 140, 190, 240].map((radius) => <circle key={radius} cx="550" cy="250" r={radius} opacity="0.25" />)}
          <path d="M0 250h800M550 0v500M180 480L790 30" opacity="0.35" />
          <circle cx="550" cy="250" r="65" fill="currentColor" fillOpacity="0.06" /><rect x="545" y="105" width="10" height="10" fill="currentColor" />
        </g> : <g stroke="currentColor" opacity="0.4">
          <path d="M170 120l200-115 220 130-200 115zM170 120v230l220 130V250m200-115v230L390 480M50 250h700M170 30v440M590 30v440" />
          <path d="M270 65v230l220 130V195M170 235l200-115 220 130" opacity="0.4" /><path d="M390 250l200-115v230L390 480z" fill="currentColor" fillOpacity="0.05" />
        </g>}
      </svg>
      <div className="relative flex h-full flex-col justify-between p-6 md:p-8"><span className="max-w-[75%] font-mono text-xs uppercase tracking-widest text-zinc-400">{tags.slice(0, 2).join(" / ")}</span><span className="cover-title">{title}</span><span className="h-px w-12 bg-accent" /></div>
    </div>}
  </div>;
}
