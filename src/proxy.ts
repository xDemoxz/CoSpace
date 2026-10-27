// Se ejecuta ANTES de renderizar una página:
//   1) Rutas privadas piden sesión; las de admin, rol ADMIN.
//   2) Si el access venció pero hay refresh, renueva la sesión sin pedir login.
//   3) Aplica el idioma de la URL con next-intl.
// La API NO pasa por aquí: cada route handler valida sesión y rol por su cuenta.
import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/features/auth/services/cookies";
import { verifyAccessToken } from "@/features/auth/services/tokens";

const handleI18nRouting = createMiddleware(routing);

const PRIVATE_PATHS = ["/dashboard"];
const ADMIN_PATHS = ["/admin"];
const GUEST_ONLY_PATHS = ["/login", "/register"];

function matches(path: string, bases: string[]): boolean {
  return bases.some((base) => path === base || path.startsWith(`${base}/`));
}

// "/es/dashboard" -> { locale: "es", path: "/dashboard" }
function splitLocale(pathname: string): { locale: string; path: string } | null {
  const [, first, ...rest] = pathname.split("/");
  if (!routing.locales.includes(first as (typeof routing.locales)[number])) return null;
  return { locale: first, path: `/${rest.join("/")}`.replace(/\/$/, "") || "/" };
}

export default async function proxy(request: NextRequest): Promise<Response> {
  const { pathname, search } = request.nextUrl;
  const parts = splitLocale(pathname);
  if (!parts) return handleI18nRouting(request);

  const { locale, path } = parts;
  const needsAdmin = matches(path, ADMIN_PATHS);
  const needsAuth = needsAdmin || matches(path, PRIVATE_PATHS);
  const guestOnly = matches(path, GUEST_ONLY_PATHS);

  if (needsAuth || guestOnly) {
    const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
    const session = accessToken ? await verifyAccessToken(accessToken) : null;

    if (guestOnly && session) {
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    if (needsAuth && !session) {
      const next = `${pathname}${search}`;
      if (request.cookies.get(REFRESH_COOKIE)?.value) {
        const refresh = new URL("/api/auth/refresh", request.url);
        refresh.searchParams.set("next", next);
        return NextResponse.redirect(refresh);
      }
      const login = new URL(`/${locale}/login`, request.url);
      login.searchParams.set("next", next);
      return NextResponse.redirect(login);
    }

    if (needsAdmin && session?.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
