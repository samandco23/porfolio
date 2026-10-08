import type { ReactNode } from "react";
export function PageHeading({ label, title, description }: { label: ReactNode; title: ReactNode; description?: ReactNode }) {
  return <header className="page-heading"><p className="section-label">{label}</p><h1 className="display-heading mt-6">{title}<span aria-hidden="true" className="text-accent">.</span></h1>{description && <div className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">{description}</div>}</header>;
}
