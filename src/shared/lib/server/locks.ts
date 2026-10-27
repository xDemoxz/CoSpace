// Bloqueos de fila (SELECT ... FOR UPDATE) dentro de una transacción.
// Si dos peticiones llegan a la vez, la segunda ESPERA a que termine la primera
// y valida con los datos ya actualizados. Siempre se bloquea en el mismo orden
// (espacio y luego usuario) para evitar bloqueos cruzados.
import type { Prisma } from "@/generated/prisma/client";

export async function lockSpace(tx: Prisma.TransactionClient, spaceId: string): Promise<void> {
  await tx.$queryRaw`SELECT "id" FROM "Space" WHERE "id" = ${spaceId} FOR UPDATE`;
}

export async function lockUser(tx: Prisma.TransactionClient, userId: string): Promise<void> {
  await tx.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${userId} FOR UPDATE`;
}
