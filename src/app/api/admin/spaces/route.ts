// GET /api/admin/spaces -> todos los espacios, activos e inactivos (admin).
import { NextResponse, type NextRequest } from "next/server";
import { withErrors } from "@/shared/lib/server/http";
import { requireAdmin } from "@/features/auth/services/session";
import { listAllSpaces } from "@/features/spaces/services/space.service";

export const GET = withErrors(async (request: NextRequest): Promise<Response> => {
  await requireAdmin(request);
  return NextResponse.json({ spaces: await listAllSpaces() });
});
