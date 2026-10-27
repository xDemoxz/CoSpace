// Forma de los datos en JSON entre el servidor y la interfaz.
// Decimal y Date viajan como string.

export type Role = "USER" | "ADMIN";
export type SpaceType = "DESK" | "MEETING_ROOM" | "BOOTH";
export type BookingStatus = "CONFIRMED" | "CANCELLED";

export const SPACE_TYPES: readonly SpaceType[] = ["DESK", "MEETING_ROOM", "BOOTH"];

export function isSpaceType(value: unknown): value is SpaceType {
  return typeof value === "string" && (SPACE_TYPES as readonly string[]).includes(value);
}

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type SpaceDto = {
  id: string;
  name: string;
  description: string;
  type: SpaceType;
  capacity: number;
  pricePerHour: string;
  imageUrl: string;
  active: boolean;
};

export type BookingDto = {
  id: string;
  startsAt: string;
  endsAt: string;
  hours: number;
  totalPrice: string;
  status: BookingStatus;
  cancelledAt: string | null;
  createdAt: string;
  space: Pick<SpaceDto, "id" | "name" | "type" | "imageUrl">;
};

export type CreateBookingInput = {
  spaceId: string;
  startsAt: string;
  hours: number;
};

export type SpaceInput = {
  name: string;
  description: string;
  type: SpaceType;
  capacity: number;
  pricePerHour: number;
  imageUrl: string;
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};
