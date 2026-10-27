// Access token (corto) y refresh token (largo), cada uno con su propio secreto.
import { createHash, randomUUID } from 'node:crypto';
import { jwtVerify, SignJWT } from 'jose';
import { getConfig } from '@/shared/lib/server/config';
import type { Role } from '@/shared/types';

export type AccessPayload = { sub: string; role: Role };

export async function signAccessToken(payload: AccessPayload): Promise<string> {
  const config = getConfig();
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${config.accessTtlSeconds}s`)
    .sign(config.accessSecret);
}

// El jti hace único cada refresh token, aunque se emitan en el mismo segundo.
export async function signRefreshToken(userId: string): Promise<string> {
  const config = getConfig();
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime(`${config.refreshTtlSeconds}s`)
    .sign(config.refreshSecret);
}

export async function verifyAccessToken(
  token: string,
): Promise<AccessPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getConfig().accessSecret, {
      algorithms: ['HS256'],
    });
    const role = payload.role;
    if (!payload.sub || (role !== 'USER' && role !== 'ADMIN')) return null;
    return { sub: payload.sub, role };
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string,
): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getConfig().refreshSecret, {
      algorithms: ['HS256'],
    });
    return payload.sub ? { sub: payload.sub } : null;
  } catch {
    return null;
  }
}

// El refresh token se guarda hasheado en la BD. SHA-256 basta: es un valor aleatorio largo.
export const hashToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex');
