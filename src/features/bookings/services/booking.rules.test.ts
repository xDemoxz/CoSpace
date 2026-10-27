import { describe, expect, it } from "vitest";
import {
  assertBookingWindow,
  assertCanCancel,
  assertWholeHour,
  assertWithinOpeningHours,
  overlaps,
} from "@/features/bookings/services/booking.rules";

// Fechas en hora de Bogotá (UTC-5).
const at = (iso: string): Date => new Date(`${iso}-05:00`);
const range = (start: string, end: string) => ({ startsAt: at(start), endsAt: at(end) });

describe("overlaps (reglas 4 y 5)", () => {
  it("10-12 y 12-14 no se solapan", () => {
    expect(overlaps(range("2026-11-02T10:00:00", "2026-11-02T12:00:00"), range("2026-11-02T12:00:00", "2026-11-02T14:00:00"))).toBe(false);
  });
  it("10-12 y 11-13 se solapan", () => {
    expect(overlaps(range("2026-11-02T10:00:00", "2026-11-02T12:00:00"), range("2026-11-02T11:00:00", "2026-11-02T13:00:00"))).toBe(true);
  });
  it("una reserva que contiene a otra se solapa", () => {
    expect(overlaps(range("2026-11-02T10:00:00", "2026-11-02T14:00:00"), range("2026-11-02T11:00:00", "2026-11-02T12:00:00"))).toBe(true);
  });
});

describe("horario y hora completa (reglas 1 y 2)", () => {
  it("rechaza inicio 10:30", () => {
    expect(() => assertWholeHour(at("2026-11-02T10:30:00"))).toThrow();
  });
  it("rechaza inicio a las 6:00", () => {
    expect(() => assertWithinOpeningHours(range("2026-11-02T06:00:00", "2026-11-02T07:00:00"))).toThrow();
  });
  it("permite 20:00 a 21:00", () => {
    expect(() => assertWithinOpeningHours(range("2026-11-02T20:00:00", "2026-11-02T21:00:00"))).not.toThrow();
  });
  it("rechaza 20:00 a 22:00", () => {
    expect(() => assertWithinOpeningHours(range("2026-11-02T20:00:00", "2026-11-02T22:00:00"))).toThrow();
  });
});

describe("ventana y cancelación (reglas 3 y 10)", () => {
  const now = at("2026-11-02T08:00:00");
  it("rechaza fechas pasadas y a más de 30 días", () => {
    expect(() => assertBookingWindow(at("2026-11-01T10:00:00"), now)).toThrow();
    expect(() => assertBookingWindow(at("2026-12-05T10:00:00"), now)).toThrow();
  });
  it("permite cancelar con 3 h y rechaza con 1 h de anticipación", () => {
    expect(() => assertCanCancel("CONFIRMED", at("2026-11-02T11:00:00"), now)).not.toThrow();
    expect(() => assertCanCancel("CONFIRMED", at("2026-11-02T09:00:00"), now)).toThrow();
  });
});
