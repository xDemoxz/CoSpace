// POST /api/bookings/:id/cancel -> cancelar (dueño o admin). Reglas 9, 10, 11 y 14.
import { NextResponse, type NextRequest } from "next/server";
import { withErrors, type IdContext } from "@/shared/lib/server/http";
import { requireUser } from "@/features/auth/services/session";
import { cancelBooking } from "@/features/bookings/services/booking.service";

export const POST = withErrors(async (request: NextRequest, { params }: IdContext): Promise<Response> => {
  const session = await requireUser(request);
  const { id } = await params;
  return NextResponse.json({ booking: await cancelBooking(session, id) });
});
