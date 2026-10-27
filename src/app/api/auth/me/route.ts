import { NextResponse, type NextRequest } from 'next/server';
import { withErrors } from '@/shared/lib/server/http';
import { getUserById } from '@/features/auth/services/auth.service';
import { requireUser } from '@/features/auth/services/session';

export const GET = withErrors(
  async (request: NextRequest): Promise<Response> => {
    const session = await requireUser(request);
    return NextResponse.json({ user: await getUserById(session.userId) });
  },
);
