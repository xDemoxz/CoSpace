// Quién hace la petición. Cada handler lo valida por su cuenta (no se confía solo en el proxy).
import { cookies } from 'next/headers';
import type { NextRequest } from 'next/server';
import type { Role } from '@/shared/types';
import { forbidden, unauthorized } from '@/shared/lib/server/errors';
import { ACCESS_COOKIE } from '@/features/auth/services/cookies';
import { verifyAccessToken } from '@/features/auth/services/tokens';

export type SessionClaims = { userId: string; role: Role };

async function claimsFromToken(
  token: string | undefined,
): Promise<SessionClaims | null> {
  if (!token) return null;
  const payload = await verifyAccessToken(token);
  return payload ? { userId: payload.sub, role: payload.role } : null;
}

// Para route handlers.
export async function getSession(
  request: NextRequest,
): Promise<SessionClaims | null> {
  return claimsFromToken(request.cookies.get(ACCESS_COOKIE)?.value);
}

// Para Server Components (páginas y layouts).
export async function getSessionFromCookies(): Promise<SessionClaims | null> {
  const store = await cookies();
  return claimsFromToken(store.get(ACCESS_COOKIE)?.value);
}

export async function requireUser(
  request: NextRequest,
): Promise<SessionClaims> {
  const session = await getSession(request);
  if (!session) throw unauthorized();
  return session;
}

export async function requireAdmin(
  request: NextRequest,
): Promise<SessionClaims> {
  const session = await requireUser(request);
  if (session.role !== 'ADMIN') {
    throw forbidden('ADMIN_ONLY', 'Esta acción es solo para administradores');
  }
  return session;
}
