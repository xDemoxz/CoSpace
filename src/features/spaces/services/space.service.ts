// Gestión de espacios (administrador).
import { prisma } from "@/shared/lib/prisma";
import { conflict, notFound } from "@/shared/lib/server/errors";
import { lockSpace } from "@/shared/lib/server/locks";
import type { SpaceDto } from "@/shared/types";
import { toSpaceDto } from "@/features/spaces/services/space.mapper";
import type { CreateSpaceData, UpdateSpaceData } from "@/features/spaces/services/space.schemas";

// El admin ve todos, activos e inactivos.
export async function listAllSpaces(): Promise<SpaceDto[]> {
  const spaces = await prisma.space.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }] });
  return spaces.map(toSpaceDto);
}

export async function createSpace(input: CreateSpaceData): Promise<SpaceDto> {
  const space = await prisma.space.create({ data: input });
  return toSpaceDto(space);
}

export async function updateSpace(id: string, input: UpdateSpaceData): Promise<SpaceDto> {
  const exists = await prisma.space.findUnique({ where: { id }, select: { id: true } });
  if (!exists) throw notFound("SPACE_NOT_FOUND", "El espacio no existe");
  const space = await prisma.space.update({ where: { id }, data: input });
  return toSpaceDto(space);
}

// Reglas 12 y 13: no se borra, se desactiva; y no si tiene reservas futuras confirmadas.
// Se bloquea la fila del espacio para que no entre una reserva justo mientras se desactiva.
export async function deactivateSpace(id: string, now: Date = new Date()): Promise<SpaceDto> {
  return prisma.$transaction(async (tx) => {
    await lockSpace(tx, id);
    const space = await tx.space.findUnique({ where: { id } });
    if (!space) throw notFound("SPACE_NOT_FOUND", "El espacio no existe");
    if (!space.active) return toSpaceDto(space);

    const futureBookings = await tx.booking.count({
      where: { spaceId: id, status: "CONFIRMED", startsAt: { gt: now } },
    });
    if (futureBookings > 0) {
      throw conflict("SPACE_HAS_FUTURE_BOOKINGS", "No se puede desactivar: tiene reservas futuras confirmadas", {
        futureBookings,
      });
    }

    const updated = await tx.space.update({ where: { id }, data: { active: false } });
    return toSpaceDto(updated);
  });
}
