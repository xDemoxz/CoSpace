// Lee el JSON del request y lo valida con un esquema de Zod. Cualquier fallo -> 400.
import { z } from 'zod';
import { badRequest } from '@/shared/lib/server/errors';

z.config(z.locales.es());

export function parse<T extends z.ZodType>(
  schema: T,
  raw: unknown,
): z.output<T> {
  const result = schema.safeParse(raw);
  if (!result.success) {
    throw badRequest('VALIDATION_ERROR', 'Hay datos inválidos en la petición', {
      issues: result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }
  return result.data;
}

export async function parseBody<T extends z.ZodType>(
  request: Request,
  schema: T,
): Promise<z.output<T>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw badRequest(
      'INVALID_JSON',
      'El cuerpo de la petición no es un JSON válido',
    );
  }
  return parse(schema, raw);
}
