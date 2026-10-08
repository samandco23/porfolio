import { SiteText } from "@/components/site-content";

export default function Loading() {
  return <section className="page-shell section-space" role="status" aria-live="polite">
    <p className="section-label"><SiteText name="motion.loading" /></p>
    <div className="route-loading-rule mt-8 max-w-sm" aria-hidden="true" />
    <div className="mt-14 space-y-5" aria-hidden="true">
      <div className="loading-placeholder h-12 w-full max-w-md" />
      <div className="loading-placeholder h-5 w-full max-w-xl" />
      <div className="loading-placeholder h-5 w-2/3 max-w-md" />
    </div>
  </section>;
}
