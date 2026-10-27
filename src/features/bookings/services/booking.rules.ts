// Reglas de reserva como funciones PURAS: reciben datos y lanzan AppError si se rompe una regla.
// No tocan la base de datos, así se prueban solas (booking.rules.test.ts).
import { addHours, getLocalHour } from "@/shared/utils/time";
import { badRequest, conflict } from "@/shared/lib/server/errors";

export const RULES = {
  minHours: 1,
  maxHours: 4,
  openHour: 7,
  closeHour: 21,
  maxDaysAhead: 30,
  maxFutureBookings: 3,
  cancelMinHoursBefore: 2,
} as const;

export type TimeRange = { startsAt: Date; endsAt: Date };

// Regla 1: empieza en hora completa.
export function assertWholeHour(startsAt: Date): void {
  const isWholeHour =
    startsAt.getUTCMinutes() === 0 && startsAt.getUTCSeconds() === 0 && startsAt.getUTCMilliseconds() === 0;
  if (!isWholeHour) {
    throw badRequest("NOT_WHOLE_HOUR", "La reserva debe empezar en una hora completa");
  }
}

// Regla 1: entre 1 y 4 horas completas.
export function assertDuration(hours: number): void {
  if (!Number.isInteger(hours) || hours < RULES.minHours || hours > RULES.maxHours) {
    throw badRequest("INVALID_DURATION", `La reserva debe durar entre ${RULES.minHours} y ${RULES.maxHours} horas`);
  }
}

// Regla 2: entre las 7:00 y las 21:00 de Bogotá (terminar a las 21:00 en punto vale).
export function assertWithinOpeningHours(range: TimeRange): void {
  const startHour = getLocalHour(range.startsAt);
  const endHour = getLocalHour(range.endsAt);
  const endsNextDay = endHour < startHour;
  if (startHour < RULES.openHour || endHour > RULES.closeHour || endsNextDay) {
    throw badRequest(
      "OUTSIDE_OPENING_HOURS",
      `Solo se puede reservar entre las ${RULES.openHour}:00 y las ${RULES.closeHour}:00`,
    );
  }
}

// Regla 3: ni en el pasado ni con más de 30 días de anticipación.
export function assertBookingWindow(startsAt: Date, now: Date): void {
  if (startsAt.getTime() <= now.getTime()) {
    throw badRequest("BOOKING_IN_PAST", "No se puede reservar en el pasado");
  }
  if (startsAt.getTime() > addHours(now, RULES.maxDaysAhead * 24).getTime()) {
    throw badRequest("BOOKING_TOO_FAR", `Solo se puede reservar con máximo ${RULES.maxDaysAhead} días de anticipación`);
  }
}

// Reglas 4 y 5: con "<" estricto, 10-12 y 12-14 NO se solapan.
export function overlaps(a: TimeRange, b: TimeRange): boolean {
  return a.startsAt.getTime() < b.endsAt.getTime() && b.startsAt.getTime() < a.endsAt.getTime();
}

// Reglas 10 y 11: solo se cancela una reserva confirmada, hasta 2 horas antes.
export function assertCanCancel(status: "CONFIRMED" | "CANCELLED", startsAt: Date, now: Date): void {
  if (status !== "CONFIRMED") {
    throw conflict("ALREADY_CANCELLED", "La reserva ya está cancelada");
  }
  if (startsAt.getTime() < addHours(now, RULES.cancelMinHoursBefore).getTime()) {
    throw conflict(
      "CANCELLATION_TOO_LATE",
      `Solo se puede cancelar hasta ${RULES.cancelMinHoursBefore} horas antes del inicio`,
    );
  }
}

export function computeEndsAt(startsAt: Date, hours: number): Date {
  return addHours(startsAt, hours);
}
