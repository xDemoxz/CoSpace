import { NextResponse } from 'next/server';
import { withErrors } from '@/shared/lib/server/http';
import { parseBody } from '@/shared/lib/server/validation';
import { loginSchema } from '@/features/auth/services/auth.schemas';
import { login } from '@/features/auth/services/auth.service';
import { setAuthCookies } from '@/features/auth/services/cookies';

export const POST = withErrors(async (request: Request): Promise<Response> => {
  const input = await parseBody(request, loginSchema);
  const { user, tokens } = await login(input);

  const response = NextResponse.json({ user });
  setAuthCookies(response, tokens);
  return response;
});
