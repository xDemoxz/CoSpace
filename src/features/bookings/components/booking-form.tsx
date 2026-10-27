"use client";
// Formulario de reserva. La UI solo ofrece valores válidos (horas completas, 7 a 21,
// 1 a 4 horas), pero el servidor vuelve a validar todo: las reglas viven en el backend.
import { useEffect, useMemo, useState, type FormEvent, type ReactElement } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BookingDto } from "@/shared/types";
import { apiFetch } from "@/shared/lib/api";
import { useErrorMessage } from "@/shared/hooks/useErrorMessage";
import { Alert } from "@/shared/components/ui/alert";
import { Button, buttonClass } from "@/shared/components/ui/button";
import { Eyebrow } from "@/shared/components/ui/eyebrow";
import { Field, SelectField } from "@/shared/components/ui/field";
import { formatCOP, pad2 } from "@/shared/utils/format";

const OPEN_HOUR = 7;
const CLOSE_HOUR = 21;
const MAX_HOURS = 4;
const MAX_DAYS_AHEAD = 30;
const TIME_ZONE = "America/Bogota";

// Fecha YYYY-MM-DD en Bogotá, desplazada N días.
function bogotaDate(daysFromNow: number): string {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(date);
}

export function BookingForm({ spaceId, pricePerHour }: { spaceId: string; pricePerHour: string }): ReactElement {
  const t = useTranslations("booking");
  const locale = useLocale();
  const toMessage = useErrorMessage();

  // Los límites de fecha se calculan al montar (evita diferencias servidor/cliente).
  const [limits, setLimits] = useState<{ min: string; max: string } | null>(null);
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState(9);
  const [hours, setHours] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<BookingDto | null>(null);

  useEffect(() => {
    const min = bogotaDate(0);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLimits({ min, max: bogotaDate(MAX_DAYS_AHEAD) });
    setDate(bogotaDate(1));
  }, []);

  const startOptions = useMemo(
    () => Array.from({ length: CLOSE_HOUR - OPEN_HOUR }, (_, index) => OPEN_HOUR + index),
    [],
  );
  const maxHours = Math.min(MAX_HOURS, CLOSE_HOUR - startHour);
  const durationOptions = Array.from({ length: maxHours }, (_, index) => index + 1);
  const safeHours = Math.min(hours, maxHours);
  const total = Number(pricePerHour) * safeHours;

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      // La hora se envía con el offset de Bogotá para que no dependa de la zona del navegador.
      const startsAt = `${date}T${pad2(startHour)}:00:00-05:00`;
      const result = await apiFetch<{ booking: BookingDto }>("/api/bookings", {
        json: { spaceId, startsAt, hours: safeHours },
      });
      setCreated(result.booking);
    } catch (caught) {
      setError(toMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <div className="space-y-4 bg-forest p-6 text-linen">
        <Eyebrow className="text-linen/70">{t("successIndex")}</Eyebrow>
        <p className="text-2xl font-medium tracking-[-0.02em]">{t("success")}</p>
        <Link href="/dashboard" className={buttonClass("light", "w-full")}>
          <span>{t("goDashboard")}</span>
          <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 border border-ink/20 bg-paper p-6">
      <div className="flex items-baseline justify-between border-b border-ink/15 pb-3">
        <Eyebrow className="text-ink-soft">{t("index")}</Eyebrow>
        <h2 className="text-xl font-medium tracking-[-0.02em]">{t("title")}</h2>
      </div>

      <Field
        type="date"
        name="date"
        label={t("date")}
        index="A"
        required
        value={date}
        min={limits?.min}
        max={limits?.max}
        onChange={(event) => setDate(event.target.value)}
      />

      <div className="grid grid-cols-2 gap-6">
        <SelectField
          name="startHour"
          label={t("start")}
          index="B"
          value={startHour}
          onChange={(event) => setStartHour(Number(event.target.value))}
        >
          {startOptions.map((hour) => (
            <option key={hour} value={hour}>{pad2(hour)}:00</option>
          ))}
        </SelectField>
        <SelectField
          name="hours"
          label={t("duration")}
          index="C"
          value={safeHours}
          onChange={(event) => setHours(Number(event.target.value))}
        >
          {durationOptions.map((value) => (
            <option key={value} value={value}>{t("durationValue", { hours: value })}</option>
          ))}
        </SelectField>
      </div>

      <dl className="grid grid-cols-2 border-y border-ink/15 py-3">
        <div>
          <dt><Eyebrow className="text-ink-soft">{t("ends")}</Eyebrow></dt>
          <dd className="mt-1 text-lg">{pad2(startHour + safeHours)}:00</dd>
        </div>
        <div className="text-right">
          <dt><Eyebrow className="text-ink-soft">{t("total")}</Eyebrow></dt>
          <dd className="mt-1 text-lg font-medium">{formatCOP(total, locale)}</dd>
        </div>
      </dl>

      {error ? <Alert>{error}</Alert> : null}

      <Button type="submit" arrow className="w-full" disabled={submitting || !date}>
        {submitting ? t("submitting") : t("submit")}
      </Button>
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-soft">{t("estimateNote")}</p>
    </form>
  );
}
