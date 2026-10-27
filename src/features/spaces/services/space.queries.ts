// Lecturas públicas de espacios (las usan las páginas SSR y los handlers).
// Regla 12: los espacios desactivados nunca aparecen en lo público.
import { prisma } from "@/shared/lib/prisma";
import type { SpaceDto, SpaceType } from "@/shared/types";
import { toSpaceDto } from "@/features/spaces/services/space.mapper";

export async function listPublicSpaces(type?: SpaceType): Promise<SpaceDto[]> {
  const spaces = await prisma.space.findMany({
    where: { active: true, ...(type ? { type } : {}) },
    orderBy: [{ type: "asc" }, { name: "asc" }],
  });
  return spaces.map(toSpaceDto);
}

export async function findPublicSpace(id: string): Promise<SpaceDto | null> {
  const space = await prisma.space.findFirst({ where: { id, active: true } });
  return space ? toSpaceDto(space) : null;
}
