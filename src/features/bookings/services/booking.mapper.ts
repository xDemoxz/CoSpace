import type { Booking, Space } from "@/generated/prisma/client";
import type { BookingDto } from "@/shared/types";

const HOUR_MS = 60 * 60 * 1000;

export function toBookingDto(booking: Booking & { space: Space }): BookingDto {
  return {
    id: booking.id,
    startsAt: booking.startsAt.toISOString(),
    endsAt: booking.endsAt.toISOString(),
    hours: Math.round((booking.endsAt.getTime() - booking.startsAt.getTime()) / HOUR_MS),
    totalPrice: booking.totalPrice.toFixed(2),
    status: booking.status,
    cancelledAt: booking.cancelledAt ? booking.cancelledAt.toISOString() : null,
    createdAt: booking.createdAt.toISOString(),
    space: {
      id: booking.space.id,
      name: booking.space.name,
      type: booking.space.type,
      imageUrl: booking.space.imageUrl,
    },
  };
}
