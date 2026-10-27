// Ambos tokens viajan SOLO en cookies httpOnly + secure + sameSite (nunca en el body ni en localStorage).
import type { NextResponse } from 'next/server';
import { getConfig } from '@/shared/lib/server/config';

export const ACCESS_COOKIE = 'cospace_access';
export const REFRESH_COOKIE = 'cospace_refresh';

type CookieOptions = {
  httpOnly: true;
  secure: true;
  sameSite: 'lax';
  path: string;
};

// secure siempre en true (lo exige el enunciado). Chrome y Edge lo aceptan en http://localhost.
const BASE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  path: '/',
};

export function setAuthCookies(
  response: NextResponse,
  tokens: { accessToken: string; refreshToken: string },
): void {
  const config = getConfig();
  response.cookies.set(ACCESS_COOKIE, tokens.accessToken, {
    ...BASE_OPTIONS,
    maxAge: config.accessTtlSeconds,
  });
  response.cookies.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...BASE_OPTIONS,
    maxAge: config.refreshTtlSeconds,
  });
}

export function clearAuthCookies(response: NextResponse): void {
  response.cookies.set(ACCESS_COOKIE, '', { ...BASE_OPTIONS, maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE, '', { ...BASE_OPTIONS, maxAge: 0 });
}
