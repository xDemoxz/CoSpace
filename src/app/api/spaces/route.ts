// GET  /api/spaces          -> catálogo público (solo activos). Filtro opcional ?type=DESK
// POST /api/spaces          -> crear espacio (admin)
import { NextResponse, type NextRequest } from "next/server";
import { withErrors } from "@/shared/lib/server/http";
import { parseBody } from "@/shared/lib/server/validation";
import { isSpaceType } from "@/shared/types";
import { requireAdmin } from "@/features/auth/services/session";
import { listPublicSpaces } from "@/features/spaces/services/space.queries";
import { createSpaceSchema } from "@/features/spaces/services/space.schemas";
import { createSpace } from "@/features/spaces/services/space.service";

export const GET = withErrors(async (request: NextRequest): Promise<Response> => {
  const type = request.nextUrl.searchParams.get("type");
  const spaces = await listPublicSpaces(isSpaceType(type) ? type : undefined);
  return NextResponse.json({ spaces });
});

export const POST = withErrors(async (request: NextRequest): Promise<Response> => {
  await requireAdmin(request);
  const input = await parseBody(request, createSpaceSchema);
  const space = await createSpace(input);
  return NextResponse.json({ space }, { status: 201 });
});
