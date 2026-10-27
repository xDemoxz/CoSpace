// Casos de uso de reservas. Todo lo que depende del estado de la base se valida
// DENTRO de una transacción con bloqueo de filas (concurrencia).
import { prisma } from "@/shared/lib/prisma";
import { conflict, notFound } from "@/shared/lib/server/errors";
import { lockSpace, lockUser } from "@/shared/lib/server/locks";
import type { BookingDto } from "@/shared/types";
import type { SessionClaims } from "@/features/auth/services/session";
import { toBookingDto } from "@/features/bookings/services/booking.mapper";
import {
  RULES,
  assertBookingWindow,
  assertCanCancel,
  assertDuration,
  assertWholeHour,
  assertWithinOpeningHours,
  computeEndsAt,
} from "@/features/bookings/services/booking.rules";
import type { CreateBookingData } from "@/features/bookings/services/booking.schemas";

export async function createBooking(
  userId: string,
  input: CreateBookingData,
  now: Date = new Date(),
): Promise<BookingDto> {
  // Reglas 1, 2 y 3: no dependen de la base de datos.
  assertDuration(input.hours);
  assertWholeHour(input.startsAt);
  const startsAt = input.startsAt;
  const endsAt = computeEndsAt(startsAt, input.hours);
  assertWithinOpeningHours({ startsAt, endsAt });
  assertBookingWindow(startsAt, now);

  return prisma.$transaction(async (tx) => {
    // El espacio protege la regla 4; el usuario, las reglas 5 y 6.
    await lockSpace(tx, input.spaceId);
    await lockUser(tx, userId);

    const space = await tx.space.findUnique({ where: { id: input.spaceId } });
    if (!space) throw notFound("SPACE_NOT_FOUND", "El espacio no existe");
    // Regla 7
    if (!space.active) throw conflict("SPACE_INACTIVE", "Este espacio no está disponible");

    // Un intervalo choca si empieza antes de que termine el otro y termina después de que empiece.
    const overlapping = { status: "CONFIRMED" as const, startsAt: { lt: endsAt }, endsAt: { gt: startsAt } };

    // Regla 4
    const spaceClash = await tx.booking.findFirst({ where: { ...overlapping, spaceId: space.id } });
    if (spaceClash) throw conflict("SPACE_OVERLAP", "Ese espacio ya está reservado en ese horario");

    // Regla 5 (aunque sea en otro espacio)
    const userClash = await tx.booking.findFirst({ where: { ...overlapping, userId } });
    if (userClash) throw conflict("USER_OVERLAP", "Ya tienes otra reserva en ese horario");

    // Regla 6
    const futureCount = await tx.booking.count({
      where: { userId, status: "CONFIRMED", startsAt: { gt: now } },
    });
    if (futureCount >= RULES.maxFutureBookings) {
      throw conflict("MAX_FUTURE_BOOKINGS", `Ya tienes ${RULES.maxFutureBookings} reservas futuras confirmadas`);
    }

    // Regla 8: el precio lo calcula el servidor, con Decimal.
    const booking = await tx.booking.create({
      data: {
        userId,
        spaceId: space.id,
        startsAt,
        endsAt,
        totalPrice: space.pricePerHour.mul(input.hours),
      },
      include: { space: true },
    });
    return toBookingDto(booking);
  });
}

// Regla 14: siempre filtrado por el usuario de la sesión.
export async function listMyBookings(userId: string): Promise<BookingDto[]> {
  const bookings = await prisma.booking.findMany({
    where: { userId },
    include: { space: true },
    orderBy: { startsAt: "desc" },
  });
  return bookings.map(toBookingDto);
}

export async function cancelBooking(
  session: SessionClaims,
  bookingId: string,
  now: Date = new Date(),
): Promise<BookingDto> {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });

  // Reglas 9 y 14: si no es el dueño ni admin, respondemos 404 para no revelar que existe.
  const canManage = booking && (booking.userId === session.userId || session.role === "ADMIN");
  if (!booking || !canManage) throw notFound("BOOKING_NOT_FOUND", "La reserva no existe");

  // Reglas 10 y 11
  assertCanCancel(booking.status, booking.startsAt, now);

  // Con la condición de estado, dos cancelaciones simultáneas no pueden pasar ambas.
  const updated = await prisma.booking.updateMany({
    where: { id: booking.id, status: "CONFIRMED" },
    data: { status: "CANCELLED", cancelledAt: now },
  });
  if (updated.count === 0) throw conflict("ALREADY_CANCELLED", "La reserva ya está cancelada");

  const result = await prisma.booking.findUniqueOrThrow({ where: { id: booking.id }, include: { space: true } });
  return toBookingDto(result);
}
