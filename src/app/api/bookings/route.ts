// POST /api/bookings -> crear reserva (usuario autenticado).
import { NextResponse, type NextRequest } from "next/server";
import { withErrors } from "@/shared/lib/server/http";
import { parseBody } from "@/shared/lib/server/validation";
import { requireUser } from "@/features/auth/services/session";
import { createBookingSchema } from "@/features/bookings/services/booking.schemas";
import { createBooking } from "@/features/bookings/services/booking.service";

export const POST = withErrors(async (request: NextRequest): Promise<Response> => {
  const session = await requireUser(request);
  const input = await parseBody(request, createBookingSchema);
  const booking = await createBooking(session.userId, input);
  return NextResponse.json({ booking }, { status: 201 });
});
