import { z } from "zod";

const spaceFields = {
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().min(5).max(1000),
  type: z.enum(["DESK", "MEETING_ROOM", "BOOTH"]),
  capacity: z.number().int().min(1).max(200),
  pricePerHour: z.number().positive().max(100_000_000),
  imageUrl: z.url({ protocol: /^https?$/ }),
};

export const createSpaceSchema = z.object(spaceFields);

export const updateSpaceSchema = z
  .object(spaceFields)
  .partial()
  .refine((value) => Object.keys(value).length > 0, "Envía al menos un campo para editar");

export type CreateSpaceData = z.output<typeof createSpaceSchema>;
export type UpdateSpaceData = z.output<typeof updateSpaceSchema>;
