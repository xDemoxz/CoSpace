import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/shared/lib/prisma';

const USER_PASSWORD = 'User1234!';
const TIME_ZONE = 'America/Bogota';

function img(slug: string): string {
  return `https://picsum.photos/seed/${slug}/800/600`;
}

// Fecha (YYYY-MM-DD) en Bogotá dentro de N días.
function bogotaDate(daysFromNow: number): string {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(date);
}

// Hora completa en Bogotá (UTC-5) convertida a Date (UTC).
function at(daysFromNow: number, hour: number): Date {
  const hh = String(hour).padStart(2, '0');
  return new Date(`${bogotaDate(daysFromNow)}T${hh}:00:00-05:00`);
}

async function main(): Promise<void> {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@cospace.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin1234!';

  // Se borra en orden inverso a las dependencias (llaves foráneas).
  await prisma.refreshToken.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.space.deleteMany();
  await prisma.user.deleteMany();

  const [adminHash, userHash] = await Promise.all([
    bcrypt.hash(adminPassword, 10),
    bcrypt.hash(USER_PASSWORD, 10),
  ]);

  await prisma.user.create({
    data: {
      name: 'Administrador',
      email: adminEmail,
      passwordHash: adminHash,
      role: 'ADMIN',
    },
  });
  const ana = await prisma.user.create({
    data: {
      name: 'Ana Torres',
      email: 'ana@cospace.com',
      passwordHash: userHash,
    },
  });
  await prisma.user.create({
    data: {
      name: 'Luis Pérez',
      email: 'luis@cospace.com',
      passwordHash: userHash,
    },
  });

  const desk = await prisma.space.create({
    data: {
      name: 'Escritorio junto a la ventana',
      description: 'Escritorio individual con luz natural y monitor externo.',
      type: 'DESK',
      capacity: 1,
      pricePerHour: '15000.00',
      imageUrl: img('desk-window'),
    },
  });

  await prisma.space.createMany({
    data: [
      {
        name: 'Escritorio compartido',
        description:
          'Mesa amplia en zona abierta, ideal para trabajo colaborativo.',
        type: 'DESK',
        capacity: 1,
        pricePerHour: '10000.00',
        imageUrl: img('desk-shared'),
      },
      {
        name: 'Sala Caribe',
        description: 'Sala de reuniones con pantalla de 55 pulgadas y tablero.',
        type: 'MEETING_ROOM',
        capacity: 8,
        pricePerHour: '60000.00',
        imageUrl: img('room-caribe'),
      },
      {
        name: 'Sala Magdalena',
        description: 'Sala pequeña para reuniones de equipo y entrevistas.',
        type: 'MEETING_ROOM',
        capacity: 4,
        pricePerHour: '40000.00',
        imageUrl: img('room-magdalena'),
      },
      {
        name: 'Cabina silenciosa 1',
        description: 'Cabina insonorizada para llamadas y videollamadas.',
        type: 'BOOTH',
        capacity: 1,
        pricePerHour: '12000.00',
        imageUrl: img('booth-1'),
      },
      {
        name: 'Cabina silenciosa 2',
        description: 'Cabina con escritorio, iluminación regulable y enchufes.',
        type: 'BOOTH',
        capacity: 1,
        pricePerHour: '12000.00',
        imageUrl: img('booth-2'),
      },
      {
        name: 'Sala en mantenimiento',
        description:
          'Espacio desactivado: no debe aparecer en el catálogo público.',
        type: 'MEETING_ROOM',
        capacity: 6,
        pricePerHour: '50000.00',
        imageUrl: img('room-maintenance'),
        active: false,
      },
    ],
  });

  // Reserva futura confirmada: mañana de 10:00 a 12:00 (sirve para probar la regla 13).
  await prisma.booking.create({
    data: {
      userId: ana.id,
      spaceId: desk.id,
      startsAt: at(1, 10),
      endsAt: at(1, 12),
      totalPrice: '30000.00',
    },
  });

  // Reserva cancelada: pasado mañana de 14:00 a 15:00 (regla 11).
  await prisma.booking.create({
    data: {
      userId: ana.id,
      spaceId: desk.id,
      startsAt: at(2, 14),
      endsAt: at(2, 15),
      totalPrice: '15000.00',
      status: 'CANCELLED',
      cancelledAt: new Date(),
    },
  });

  console.log('Seed completado.');
  console.log(`Administrador: ${adminEmail} / ${adminPassword}`);
  console.log(`Usuarios: ana@cospace.com, luis@cospace.com / ${USER_PASSWORD}`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
