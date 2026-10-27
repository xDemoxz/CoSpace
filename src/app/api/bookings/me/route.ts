// GET /api/bookings/me -> solo las reservas del usuario de la sesión (regla 14).
import { NextResponse, type NextRequest } from "next/server";
import { withErrors } from "@/shared/lib/server/http";
import { requireUser } from "@/features/auth/services/session";
import { listMyBookings } from "@/features/bookings/services/booking.service";

export const GET = withErrors(async (request: NextRequest): Promise<Response> => {
  const session = await requireUser(request);
  return NextResponse.json({ bookings: await listMyBookings(session.userId) });
});
