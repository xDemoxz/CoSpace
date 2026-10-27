import { NextResponse } from 'next/server';
import { withErrors } from '@/shared/lib/server/http';
import { parseBody } from '@/shared/lib/server/validation';
import { registerSchema } from '@/features/auth/services/auth.schemas';
import { register } from '@/features/auth/services/auth.service';
import { setAuthCookies } from '@/features/auth/services/cookies';

export const POST = withErrors(async (request: Request): Promise<Response> => {
  const input = await parseBody(request, registerSchema);
  const { user, tokens } = await register(input);

  // Tokens SOLO en cookies; el body lleva únicamente los datos del usuario.
  const response = NextResponse.json({ user }, { status: 201 });
  setAuthCookies(response, tokens);
  return response;
});
