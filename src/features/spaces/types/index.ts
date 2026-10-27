import type { SpaceType } from "@/shared/types";

// Cada tipo de espacio tiene su "muestra de color" y un código corto.
export const TYPE_STYLE: Record<SpaceType, { swatch: string; code: string }> = {
  DESK: { swatch: "bg-oak text-ink", code: "DSK" },
  MEETING_ROOM: { swatch: "bg-forest text-linen", code: "MTG" },
  BOOTH: { swatch: "bg-sand text-linen", code: "BTH" },
};
