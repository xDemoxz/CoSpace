// POST: lo usa el frontend cuando recibe 401.
// GET ?next=: lo usa el proxy al navegar a una página privada con el access vencido.
import { NextResponse, type NextRequest } from 'next/server';
import { AppError } from '@/shared/lib/server/errors';
import { errorResponse, withErrors } from '@/shared/lib/server/http';
import { refresh } from '@/features/auth/services/auth.service';
import {
  clearAuthCookies,
  REFRESH_COOKIE,
  setAuthCookies,
} from '@/features/auth/services/cookies';
import {
  localeFromPath,
  safeNextPath,
} from '@/features/auth/services/redirects';

export const POST = withErrors(
  async (request: NextRequest): Promise<Response> => {
    try {
      const { user, tokens } = await refresh(
        request.cookies.get(REFRESH_COOKIE)?.value,
      );
      const response = NextResponse.json({ user });
      setAuthCookies(response, tokens);
      return response;
    } catch (error) {
      const response = errorResponse(error);
      if (error instanceof AppError && error.status === 401)
        clearAuthCookies(response);
      return response;
    }
  },
);

export async function GET(request: NextRequest): Promise<Response> {
  const next = safeNextPath(request.nextUrl.searchParams.get('next'), '/');
  try {
    const { tokens } = await refresh(
      request.cookies.get(REFRESH_COOKIE)?.value,
    );
    const response = NextResponse.redirect(new URL(next, request.url));
    setAuthCookies(response, tokens);
    return response;
  } catch (error) {
    if (!(error instanceof AppError)) return errorResponse(error);
    const loginUrl = new URL(`/${localeFromPath(next)}/login`, request.url);
    loginUrl.searchParams.set('next', next);
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response);
    return response;
  }
}
