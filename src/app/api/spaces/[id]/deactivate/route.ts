// POST /api/spaces/:id/deactivate -> desactivar (admin). 409 si tiene reservas futuras (regla 13).
import { NextResponse, type NextRequest } from "next/server";
import { withErrors, type IdContext } from "@/shared/lib/server/http";
import { requireAdmin } from "@/features/auth/services/session";
import { deactivateSpace } from "@/features/spaces/services/space.service";

export const POST = withErrors(async (request: NextRequest, { params }: IdContext): Promise<Response> => {
  await requireAdmin(request);
  const { id } = await params;
  return NextResponse.json({ space: await deactivateSpace(id) });
});
