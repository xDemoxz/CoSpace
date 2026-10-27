"use client";
import type { ReactElement } from "react";
import { useLocale, useTranslations } from "next-intl";
import { apiFetch } from "@/shared/lib/api";

export function LogoutButton({ className = "" }: { className?: string }): ReactElement {
  const t = useTranslations("nav");
  const locale = useLocale();

  async function handleLogout(): Promise<void> {
    await apiFetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    // Recarga completa: los layouts del servidor vuelven a leer la sesión (ya vacía).
    window.location.assign(`/${locale}`);
  }

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {t("logout")}
    </button>
  );
}
