import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

type SessionPayload = {
  user?: { id?: string; role?: string };
  session?: { id?: string };
} | null;

/** Canonical dashboard home path for each app role */
const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin-dashboard",
  CUSTOMER: "/user-dashboard",
  USER: "/user-dashboard",
  PROVIDER: "/provider-dashboard",
  RIDER: "/rider-dashboard",
  MANAGER: "/manager-dashboard",
};

function normalizeRole(role: string | undefined): string {
  const r = (role || "CUSTOMER").trim().toUpperCase();
  if (r === "USER") return "CUSTOMER";
  return r;
}

function homeForRole(role: string): string {
  return ROLE_HOME[role] ?? "/user-dashboard";
}

/** Whether this pathname belongs to the given role's dashboard tree */
function pathAllowedForRole(pathname: string, role: string): boolean {
  if (
    pathname === "/cart" ||
    pathname.startsWith("/cart/") ||
    pathname === "/checkout" ||
    pathname.startsWith("/checkout/")
  ) {
    return role === "CUSTOMER";
  }
  const prefix = homeForRole(role);
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

async function fetchSession(request: NextRequest): Promise<SessionPayload> {
  // Same origin as the page so session cookies (set via /api/auth on this host) are valid.
  // next.config rewrites /api/auth/* to the backend.
  const sessionUrl = new URL("/api/auth/get-session", request.url);
  const cookie = request.headers.get("cookie") ?? "";

  try {
    const res = await fetch(sessionUrl, {
      method: "GET",
      headers: { cookie },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const data = (await res.json()) as SessionPayload;
    if (!data?.user?.id || !data?.session) return null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Protects dashboard routes: unauthenticated users are redirected to /login.
 * Session is validated against the better-auth backend (same cookies as the app).
 */
export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const session = await fetchSession(request);
  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = normalizeRole(session.user?.role);
  if (!pathAllowedForRole(pathname, role)) {
    return NextResponse.redirect(new URL(homeForRole(role), request.url));
  }

  return NextResponse.next();
}

const PROTECTED_PREFIXES = [
  "/admin-dashboard",
  "/user-dashboard",
  "/provider-dashboard",
  "/rider-dashboard",
  "/manager-dashboard",
  "/cart",
  "/checkout",
];

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/user-dashboard/:path*",
    "/provider-dashboard/:path*",
    "/rider-dashboard/:path*",
    "/manager-dashboard/:path*",
    "/cart/:path*",
    "/checkout/:path*",
  ],
};
