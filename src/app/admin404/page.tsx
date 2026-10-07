import { notFound } from "next/navigation";

/**
 * Internal helper route — never linked anywhere.
 * Middleware rewrites the disguised legacy /admin directory here so the
 * visitor gets a genuine 404 (with the styled not-found page).
 */
export default function Admin404Page() {
  notFound();
}
