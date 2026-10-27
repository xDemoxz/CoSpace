// GET   /api/spaces/:id -> detalle público (404 si no existe o está desactivado)
// PATCH /api/spaces/:id -> editar (admin)
import { NextResponse, type NextRequest } from "next/server";
import { notFound } from "@/shared/lib/server/errors";
import { withErrors, type IdContext } from "@/shared/lib/server/http";
import { parseBody } from "@/shared/lib/server/validation";
import { requireAdmin } from "@/features/auth/services/session";
import { findPublicSpace } from "@/features/spaces/services/space.queries";
import { updateSpaceSchema } from "@/features/spaces/services/space.schemas";
import { updateSpace } from "@/features/spaces/services/space.service";

export const GET = withErrors(async (_request: NextRequest, { params }: IdContext): Promise<Response> => {
  const { id } = await params;
  const space = await findPublicSpace(id);
  if (!space) throw notFound("SPACE_NOT_FOUND", "El espacio no existe");
  return NextResponse.json({ space });
});

export const PATCH = withErrors(async (request: NextRequest, { params }: IdContext): Promise<Response> => {
  await requireAdmin(request);
  const { id } = await params;
  const input = await parseBody(request, updateSpaceSchema);
  return NextResponse.json({ space: await updateSpace(id, input) });
});
