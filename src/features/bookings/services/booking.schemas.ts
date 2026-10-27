import { z } from "zod";

// Forma del dato. Las reglas de negocio (horario, duración, solapes) viven en booking.rules.ts.
export const createBookingSchema = z.object({
  spaceId: z.string().min(1),
  startsAt: z.iso.datetime({ offset: true }).transform((value) => new Date(value)),
  hours: z.number().int(),
});

export type CreateBookingData = z.output<typeof createBookingSchema>;
