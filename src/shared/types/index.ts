// Tipos compartidos entre el servidor (route handlers) y la interfaz.
// Son la forma de los datos en JSON, no los modelos de Prisma:
// Decimal y Date no se serializan tal cual, por eso viajan como string.

export type Role = 'USER' | 'ADMIN';
export type SpaceType = 'DESK' | 'MEETING_ROOM' | 'BOOTH';
export type BookingStatus = 'CONFIRMED' | 'CANCELLED';

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
  space: Pick<SpaceDto, 'id' | 'name' | 'type' | 'imageUrl'>;
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
    details?: unknown;
  };
};
