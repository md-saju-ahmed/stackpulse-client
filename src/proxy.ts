import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminRole } from "@/lib/auth-utils";

const TOKEN_COOKIE = "stackpulse_token";

const PROTECTED_PREFIXES = ["/dashboard", "/products/submit"];

const ADMIN_ONLY_PREFIXES = [
  "/dashboard/pending",
  "/dashboard/categories",
  "/dashboard/users",
];

const AUTH_ONLY_ROUTES = ["/login", "/register"];

type JwtPayload = {
  id?: string;
  role?: string;
  accountStatus?: string;
  exp?: number;
};

function decodeJwtCookie(cookieHeader: string | null): JwtPayload | null {
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${TOKEN_COOKIE}=`));

  if (!match) return null;

  const token = match.slice(TOKEN_COOKIE.length + 1);
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1]
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(parts[1].length + ((4 - (parts[1].length % 4)) % 4), "=");

    const payload = JSON.parse(atob(base64)) as JwtPayload;

    if (typeof payload.exp === "number" && payload.exp * 1000 < Date.now()) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAdminOnly = ADMIN_ONLY_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAuthOnly = AUTH_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtected && !isAuthOnly) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie");
  const payload = decodeJwtCookie(cookieHeader);
  const hasSession = payload !== null && Boolean(payload.id);
  const role = hasSession ? payload?.role : undefined;

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminOnly && hasSession && !isAdminRole(role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isAuthOnly && hasSession) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
