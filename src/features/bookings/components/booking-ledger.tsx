"use client";
// Dashboard (CSR): las reservas se piden desde el navegador a /api/bookings/me.
import { useCallback, useEffect, useState, type ReactElement } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BookingDto } from "@/shared/types";
import { apiFetch } from "@/shared/lib/api";
import { useErrorMessage } from "@/shared/hooks/useErrorMessage";
import { Alert } from "@/shared/components/ui/alert";
import { buttonClass } from "@/shared/components/ui/button";
import { Eyebrow } from "@/shared/components/ui/eyebrow";
import { formatCOP, pad2 } from "@/shared/utils/format";
import { SpaceTypeTag } from "@/features/spaces/components/space-type-tag";
import { LocalDateTime } from "@/features/bookings/components/local-date-time";
import { StatusTag } from "@/features/bookings/components/status-tag";

const MAX_FUTURE_BOOKINGS = 3;

export function BookingLedger(): ReactElement {
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const toMessage = useErrorMessage();
  const [bookings, setBookings] = useState<BookingDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [now, setNow] = useState<number | null>(null);

  const load = useCallback(async (): Promise<void> => {
    try {
      const result = await apiFetch<{ bookings: BookingDto[] }>("/api/bookings/me");
      setBookings(result.bookings);
      setNow(Date.now());
    } catch (caught) {
      setError(toMessage(caught));
    }
  }, [toMessage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function cancel(booking: BookingDto): Promise<void> {
    if (!window.confirm(t("confirmCancel", { name: booking.space.name }))) return;
    setError(null);
    setBusyId(booking.id);
    try {
      await apiFetch(`/api/bookings/${booking.id}/cancel`, { method: "POST" });
      await load();
    } catch (caught) {
      setError(toMessage(caught));
    } finally {
      setBusyId(null);
    }
  }

  if (!bookings) {
    return error ? <Alert>{error}</Alert> : <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">{t("loading")}</p>;
  }

  const upcoming = bookings.filter(
    (booking) => booking.status === "CONFIRMED" && now !== null && new Date(booking.startsAt).getTime() > now,
  ).length;

  return (
    <div className="space-y-10">
      {/* Regla 6 visible: cuántas de las 3 reservas futuras se están usando. */}
      <div className="grid gap-6 border-y border-ink/15 py-5 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <Eyebrow className="text-ink-soft">{t("limitLabel")}</Eyebrow>
          <p className="mt-1 text-2xl font-medium tracking-[-0.02em]">
            {t("limitValue", { used: upcoming, max: MAX_FUTURE_BOOKINGS })}
          </p>
        </div>
        <div className="flex gap-1.5" aria-hidden>
          {Array.from({ length: MAX_FUTURE_BOOKINGS }, (_, index) => (
            <span key={index} className={`h-10 w-10 border border-ink/30 ${index < upcoming ? "bg-forest" : "bg-transparent"}`} />
          ))}
        </div>
      </div>

      {error ? <Alert>{error}</Alert> : null}

      {bookings.length === 0 ? (
        <div className="border border-dashed border-ink/30 p-10 text-center">
          <p className="text-ink-soft">{t("empty")}</p>
          <Link href="/spaces" className={buttonClass("primary", "mt-5")}>
            <span>{t("emptyCta")}</span>
            <span aria-hidden>→</span>
          </Link>
        </div>
      ) : (
        <ol className="border-t border-ink/20">
          {bookings.map((booking, index) => (
            <li
              key={booking.id}
              className={`grid gap-3 border-b border-ink/15 py-5 sm:grid-cols-[48px_1.4fr_1.2fr_0.8fr_auto] sm:items-center ${booking.status === "CANCELLED" ? "opacity-55" : ""}`}
            >
              <Eyebrow className="text-ink-soft">{pad2(index + 1)}</Eyebrow>
              <div>
                <p className="text-lg font-medium tracking-[-0.01em]">{booking.space.name}</p>
                <SpaceTypeTag type={booking.space.type} />
              </div>
              <div className="text-sm">
                <LocalDateTime value={booking.startsAt} />
                <span className="text-ink-soft"> → </span>
                <LocalDateTime value={booking.endsAt} mode="time" />
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-soft">
                  {t("hours", { hours: booking.hours })}
                </p>
              </div>
              <div>
                <p className="font-medium">{formatCOP(booking.totalPrice, locale)}</p>
                <StatusTag status={booking.status} />
              </div>
              <div className="sm:text-right">
                {booking.status === "CONFIRMED" ? (
                  <button
                    type="button"
                    onClick={() => void cancel(booking)}
                    disabled={busyId === booking.id}
                    className="font-mono text-[11px] uppercase tracking-[0.14em] text-clay underline-offset-4 hover:underline disabled:opacity-50"
                  >
                    {busyId === booking.id ? t("cancelling") : t("cancel")}
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
