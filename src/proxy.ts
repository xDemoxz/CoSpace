// Proxy: idioma (next-intl) + protección de /dashboard y /admin.
// Si el access token venció pero hay refresh, se renueva en /api/auth/refresh y se vuelve.
import { type NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/features/auth/services/cookies";
import { verifyAccessToken } from "@/features/auth/services/tokens";
import { localeFromPath } from "@/features/auth/services/redirects";

const intl = createMiddleware(routing);
const PROTECTED = /^\/(es|en)\/(dashboard|admin)(\/|$)/;

export default async function proxy(request: NextRequest): Promise<Response> {
  const { pathname, search } = request.nextUrl;
  if (PROTECTED.test(pathname)) {
    const access = request.cookies.get(ACCESS_COOKIE)?.value;
    if (!access || !(await verifyAccessToken(access))) {
      const next = pathname + search;
      const url = request.cookies.has(REFRESH_COOKIE)
        ? new URL("/api/auth/refresh", request.url)
        : new URL(`/${localeFromPath(pathname)}/login`, request.url);
      url.searchParams.set("next", next);
      return NextResponse.redirect(url);
    }
  }
  return intl(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
