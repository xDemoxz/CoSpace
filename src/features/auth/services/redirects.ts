// Redirecciones seguras después del login o la renovación de sesión.
import { routing } from '@/i18n/routing';

// Evita "open redirect": solo rutas internas ("/algo"), nunca "//otro-sitio.com".
export function safeNextPath(
  next: string | null | undefined,
  fallback = '/',
): string {
  if (
    !next ||
    !next.startsWith('/') ||
    next.startsWith('//') ||
    next.includes('\\')
  ) {
    return fallback;
  }
  return next;
}

// "/en/dashboard" -> "en"
export function localeFromPath(path: string): string {
  const first = path.split('/')[1];
  return routing.locales.includes(first as (typeof routing.locales)[number])
    ? first
    : routing.defaultLocale;
}
