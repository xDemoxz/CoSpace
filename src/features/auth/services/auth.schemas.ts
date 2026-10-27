import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Mínimo 2 caracteres").max(60),
  email: z.string().trim().toLowerCase().pipe(z.email("Correo inválido")),
  // bcrypt solo usa los primeros 72 bytes.
  password: z.string().min(8, "Mínimo 8 caracteres").max(72),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Correo inválido")),
  password: z.string().min(1, "Requerida"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;