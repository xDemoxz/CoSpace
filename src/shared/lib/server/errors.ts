// Errores de la aplicación con su código HTTP.
// 400 dato inválido · 401 sin sesión · 403 sin permiso · 404 no existe · 409 conflicto de estado
export type ErrorDetails = Record<string, unknown>;

export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: ErrorDetails,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const badRequest = (
  code: string,
  message: string,
  details?: ErrorDetails,
): AppError => new AppError(400, code, message, details);

export const unauthorized = (
  message = 'Debes iniciar sesión',
  code = 'UNAUTHORIZED',
): AppError => new AppError(401, code, message);

export const forbidden = (code: string, message: string): AppError =>
  new AppError(403, code, message);

export const notFound = (code: string, message: string): AppError =>
  new AppError(404, code, message);

export const conflict = (
  code: string,
  message: string,
  details?: ErrorDetails,
): AppError => new AppError(409, code, message, details);
