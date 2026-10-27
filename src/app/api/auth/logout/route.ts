import { NextResponse, type NextRequest } from "next/server";
import { withErrors } from "@/shared/lib/server/http";
import { logout } from "@/features/auth/services/auth.service";
import { clearAuthCookies, REFRESH_COOKIE } from "@/features/auth/services/cookies";

export const POST = withErrors(async (request: NextRequest): Promise<Response> => {
  await logout(request.cookies.get(REFRESH_COOKIE)?.value);
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
});