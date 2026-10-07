import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAdminPath, isValidAdminPath } from "@/lib/admin-path";

/**
 * Admin routes live internally under /admin. The public entry path is
 * configurable via ADMIN_PATH (e.g. "/panel-7xk2q9v3"); this middleware
 * rewrites the secret path onto the internal routes — and disguises the
 * legacy /admin directory as a plain 404 when a custom path is set.
 */
const LEGACY_PREFIX = "/admin";
const NOT_FOUND_ROUTE = "/admin404";

function rewrite(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  return NextResponse.rewrite(url);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const base = getAdminPath();

  // Internal 404 trigger route — pass through untouched.
  if (pathname === NOT_FOUND_ROUTE || pathname.startsWith(`${NOT_FOUND_ROUTE}/`)) {
    return NextResponse.next();
  }

  if (process.env.NODE_ENV === "production" && !isValidAdminPath(base)) {
    if (
      pathname === base ||
      pathname.startsWith(`${base}/`) ||
      pathname === LEGACY_PREFIX ||
      pathname.startsWith(`${LEGACY_PREFIX}/`)
    ) {
      return rewrite(req, NOT_FOUND_ROUTE);
    }

    return NextResponse.next();
  }

  // ── Admin area at the configured (secret) path ────────────────────────
  if (pathname === base || pathname.startsWith(`${base}/`)) {
    const rest = pathname === base ? "" : pathname.slice(base.length);
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Login page: signed-in users go straight to the dashboard.
    if (rest === "/login") {
      if (token) return NextResponse.redirect(new URL(base, req.url));
      return rewrite(req, "/admin/login");
    }

    // Everything else requires a session.
    if (!token) {
      const login = req.nextUrl.clone();
      login.pathname = `${base}/login`;
      login.search = "";
      return NextResponse.redirect(login);
    }

    return rewrite(req, `/admin${rest}`);
  }

  // ── Disguise the legacy /admin directory as a 404 ─────────────────────
  if (
    base !== LEGACY_PREFIX &&
    (pathname === LEGACY_PREFIX || pathname.startsWith(`${LEGACY_PREFIX}/`))
  ) {
    return rewrite(req, NOT_FOUND_ROUTE);
  }

  return NextResponse.next();
}

export const config = {
  // Runs on every page route (Next internals, NextAuth API and any dotted
  // file path are excluded). The admin branch inside middleware() decides
  // what to do based on the configured ADMIN_PATH, so the matcher must stay
  // path-agnostic.
  matcher: ["/((?!_next|api/auth|.*\\..*).*)"],
};
