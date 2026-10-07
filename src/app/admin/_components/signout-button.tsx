"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="mt-1 flex items-center gap-2 px-3 py-1.5 font-mono text-xs text-zinc-500 hover:text-red-400"
    >
      <LogOut className="h-3.5 w-3.5" /> Sign out
    </button>
  );
}
