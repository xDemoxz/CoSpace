// Etiqueta con el estado de una reserva (CONFIRMED, CANCELLED).
import { useTranslations } from "next-intl";
import type { BookingStatus } from "@/shared/types";

const STYLES: Record<BookingStatus, string> = {
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: BookingStatus }) {
  const t = useTranslations("status");
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STYLES[status]}`}>
      {t(status)}
    </span>
  );
}