import type { Space } from "@/generated/prisma/client";
import type { SpaceDto } from "@/shared/types";

export function toSpaceDto(space: Space): SpaceDto {
  return {
    id: space.id,
    name: space.name,
    description: space.description,
    type: space.type,
    capacity: space.capacity,
    pricePerHour: space.pricePerHour.toFixed(2),
    imageUrl: space.imageUrl,
    active: space.active,
  };
}
