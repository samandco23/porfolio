import { Suspense } from "react";
import { Terminal } from "lucide-react";
import { getAdminPath } from "@/lib/admin-path";
import { LoginForm } from "./login-form";

export const metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  const adminBase = getAdminPath();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-sm border border-zinc-800 bg-base-400">
        <div className="flex items-center gap-2 border-b border-zinc-800 px-5 py-3">
          <Terminal className="h-4 w-4 text-accent" />
          <span className="font-mono text-xs text-zinc-400">auth — restricted area</span>
        </div>
        <Suspense fallback={<div className="p-5 font-mono text-xs text-zinc-600">Loading…</div>}>
          <LoginForm adminBase={adminBase} />
        </Suspense>
      </div>
    </div>
  );
}
