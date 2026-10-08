
import { SiteText } from "@/components/site-content";
import Link from "next/link";

export const metadata = { title: "404 — Not found" };

export default function NotFound() {
  return (
    <div className="grid-backdrop flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-zinc-600"> <SiteText name="app.not-found.1" /> </p>
      <h1 className="mt-4 font-mono text-7xl text-white md:text-8xl">
        4<span className="text-accent text-glow">0</span>4
      </h1>
      <p className="mt-5 max-w-md font-mono text-sm leading-relaxed text-zinc-500">
        <SiteText name="app.not-found.2" />
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link href="/" className="btn-primary"> <SiteText name="app.not-found.3" /> </Link>
        <Link
          href="/projects"
          className="border border-zinc-800 px-5 py-2.5 font-mono text-xs uppercase tracking-wider text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
        > <SiteText name="app.not-found.4" /> </Link>
      </div>
    </div>
  );
}
