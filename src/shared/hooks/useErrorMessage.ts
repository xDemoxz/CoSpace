"use client";
// Traduce un error de la API por su código (messages -> "errors").
// Si no hay traducción, muestra el mensaje del servidor.
import { useTranslations } from "next-intl";
import { ApiError } from "@/shared/lib/api";

type Issue = { path: string; message: string };

export function useErrorMessage(): (error: unknown) => string {
  const t = useTranslations("errors");

  return (error: unknown): string => {
    if (!(error instanceof ApiError)) return t("generic");
    if (error.code === "VALIDATION_ERROR") {
      const first = (error.details?.issues as Issue[] | undefined)?.[0];
      return first ? `${t("VALIDATION_ERROR")} (${first.path}: ${first.message})` : t("VALIDATION_ERROR");
    }
    return t.has(error.code) ? t(error.code) : error.message;
  };
}
