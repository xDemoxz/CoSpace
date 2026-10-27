// Casos de uso de autenticación.
// login/registro -> access + refresh; el refresh se guarda HASHEADO.
// refresh        -> valida, REVOCA el viejo y emite un par nuevo (rotación).
// reuso          -> si llega un refresh ya revocado, se cierran todas las sesiones del usuario.
// logout         -> revoca el refresh en la BD.
import type { SessionUser } from '@/shared/types';
import { prisma } from '@/shared/lib/prisma';
import { getConfig } from '@/shared/lib/server/config';
import { conflict, unauthorized } from '@/shared/lib/server/errors';
import {
  hashPassword,
  verifyPassword,
} from '@/features/auth/services/password';
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@/features/auth/services/tokens';
import type {
  LoginInput,
  RegisterInput,
} from '@/features/auth/services/auth.schemas';

type Tokens = { accessToken: string; refreshToken: string };
export type AuthResult = { user: SessionUser; tokens: Tokens };

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

const toSessionUser = (user: UserRecord): SessionUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

async function issueTokens(user: UserRecord): Promise<Tokens> {
  const accessToken = await signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = await signRefreshToken(user.id);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(refreshToken),
      expiresAt: new Date(Date.now() + getConfig().refreshTtlSeconds * 1000),
    },
  });

  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });
  if (existing)
    throw conflict('EMAIL_TAKEN', 'Ya existe una cuenta con ese correo');

  // El rol nunca viene del cliente: el registro público siempre crea un USER.
  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash: await hashPassword(input.password),
      role: 'USER',
    },
  });

  return { user: toSessionUser(user), tokens: await issueTokens(user) };
}

export async function login(input: LoginInput): Promise<AuthResult> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  // Mismo mensaje si falla el correo o la contraseña: no se revela cuál.
  const valid = user
    ? await verifyPassword(input.password, user.passwordHash)
    : false;
  if (!user || !valid)
    throw unauthorized(
      'Correo o contraseña incorrectos',
      'INVALID_CREDENTIALS',
    );

  return { user: toSessionUser(user), tokens: await issueTokens(user) };
}

export async function refresh(
  refreshToken: string | undefined,
): Promise<AuthResult> {
  if (!refreshToken) throw unauthorized('Sesión expirada', 'REFRESH_REQUIRED');

  const claims = await verifyRefreshToken(refreshToken);
  if (!claims) throw unauthorized('Sesión expirada', 'REFRESH_INVALID');

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(refreshToken) },
    include: { user: true },
  });
  if (!stored || stored.userId !== claims.sub) {
    throw unauthorized('Sesión expirada', 'REFRESH_INVALID');
  }

  if (stored.revokedAt) {
    await prisma.refreshToken.updateMany({
      where: { userId: stored.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    throw unauthorized(
      'Sesión inválida, inicia sesión de nuevo',
      'REFRESH_REUSED',
    );
  }

  if (stored.expiresAt <= new Date())
    throw unauthorized('Sesión expirada', 'REFRESH_EXPIRED');

  // Revocar con condición: si llegan dos peticiones a la vez, solo una gana.
  const revoked = await prisma.refreshToken.updateMany({
    where: { id: stored.id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  if (revoked.count === 0)
    throw unauthorized('Sesión expirada', 'REFRESH_INVALID');

  return {
    user: toSessionUser(stored.user),
    tokens: await issueTokens(stored.user),
  };
}

export async function logout(refreshToken: string | undefined): Promise<void> {
  if (!refreshToken) return;
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(refreshToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

export async function getUserById(userId: string): Promise<SessionUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw unauthorized('La cuenta ya no existe', 'USER_NOT_FOUND');
  return toSessionUser(user);
}
