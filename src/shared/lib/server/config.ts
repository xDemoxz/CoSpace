// Lee y valida las variables de entorno. Si falta alguna, falla con un mensaje claro.
import { z } from "zod";

const envSchema = z.object({
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET debe tener al menos 32 caracteres"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET debe tener al menos 32 caracteres"),
  ACCESS_TOKEN_EXPIRES_IN: z.string().default("15m"),
  REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
});

const UNIT_SECONDS = { s: 1, m: 60, h: 3600, d: 86400 } as const;

// "15m" -> 900, "7d" -> 604800
export function parseDurationToSeconds(value: string): number {
  const match = /^(\d+)([smhd])$/.exec(value.trim());
  if (!match) {
    throw new Error(`Duración inválida "${value}". Usa número + unidad (s, m, h, d), ej: 15m`);
  }
  return Number(match[1]) * UNIT_SECONDS[match[2] as keyof typeof UNIT_SECONDS];
}

type AppConfig = {
  accessSecret: Uint8Array;
  refreshSecret: Uint8Array;
  accessTtlSeconds: number;
  refreshTtlSeconds: number;
};

let cached: AppConfig | undefined;

function loadConfig(): AppConfig {
  const env = envSchema.parse(process.env);
  return {
    accessSecret: new TextEncoder().encode(env.JWT_ACCESS_SECRET),
    refreshSecret: new TextEncoder().encode(env.JWT_REFRESH_SECRET),
    accessTtlSeconds: parseDurationToSeconds(env.ACCESS_TOKEN_EXPIRES_IN),
    refreshTtlSeconds: parseDurationToSeconds(env.REFRESH_TOKEN_EXPIRES_IN),
  };
}

// Se lee una sola vez y de forma diferida, para no fallar durante el build.
export function getConfig(): AppConfig {
  cached ??= loadConfig();
  return cached;
}