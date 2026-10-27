// Respuesta de error uniforme para todos los route handlers:
// { "error": { "code": "...", "message": "...", "details": {...} } }
import { NextResponse } from 'next/server';
import { Prisma } from '@/generated/prisma/client';
import { AppError, type ErrorDetails } from '@/shared/lib/server/errors';

type ErrorBody = {
  error: { code: string; message: string; details?: ErrorDetails };
};

export function errorBody(
  code: string,
  message: string,
  details?: ErrorDetails,
): ErrorBody {
  return { error: { code, message, ...(details ? { details } : {}) } };
}

export function errorResponse(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return NextResponse.json(
      errorBody(error.code, error.message, error.details),
      {
        status: error.status,
      },
    );
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        errorBody('ALREADY_EXISTS', 'El recurso ya existe'),
        { status: 409 },
      );
    }
    if (error.code === 'P2025') {
      return NextResponse.json(errorBody('NOT_FOUND', 'El recurso no existe'), {
        status: 404,
      });
    }
  }
  console.error('Error no controlado:', error);
  return NextResponse.json(
    errorBody('INTERNAL_ERROR', 'Error interno del servidor'),
    {
      status: 500,
    },
  );
}

// Envuelve un handler: cualquier excepción sale con el formato estándar.
export function withErrors<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
): (...args: Args) => Promise<Response> {
  return async (...args: Args) => {
    try {
      return await handler(...args);
    } catch (error) {
      return errorResponse(error);
    }
  };
}

// En Next 16 los params de las rutas dinámicas son una Promise.
export type IdContext = { params: Promise<{ id: string }> };
