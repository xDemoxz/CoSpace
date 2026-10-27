import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import type { BookingStatus } from "@/shared/types";

const STYLES: Record<BookingStatus, string> = {
  CONFIRMED: "text-forest",
  CANCELLED: "text-clay line-through decoration-1",
};

export function StatusTag({ status }: { status: BookingStatus }): ReactElement {
  const t = useTranslations("status");
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] ${STYLES[status]}`}>
      <span aria-hidden>{status === "CONFIRMED" ? "●" : "○"}</span>
      {t(status)}
    </span>
  );
}
