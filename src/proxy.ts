import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/products/submit"];

const ADMIN_ONLY_PREFIXES = [
  "/dashboard/pending",
  "/dashboard/categories",
  "/dashboard/users",
];

const AUTH_ONLY_ROUTES = ["/login", "/register"];

export async function proxy(request: NextRequest) {
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

  let hasSession = false;
  let role: string | undefined;
  try {
    const sessionUrl = new URL("/api/auth/get-session", request.url);
    const res = await fetch(sessionUrl, {
      headers: { cookie: request.headers.get("cookie") ?? "" },
    });
    if (res.ok) {
      const body = (await res.json()) as { user?: { role?: string } } | null;
      hasSession =
        body !== null &&
        typeof body === "object" &&
        "user" in body &&
        body.user != null;
      role = hasSession ? body?.user?.role : undefined;
    }
  } catch {
    hasSession = false;
    role = undefined;
  }

  if (isProtected && !hasSession) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminOnly && hasSession && role !== "admin") {
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
