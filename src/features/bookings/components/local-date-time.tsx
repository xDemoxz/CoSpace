"use client";
// Muestra una fecha en la hora local del navegador SIN errores de hidratación:
// el servidor y el primer render del cliente pintan lo mismo ("—") y la fecha
// real se calcula después de montar, en useEffect.
import { useEffect, useState, type ReactElement } from "react";
import { useLocale } from "next-intl";

type Mode = "datetime" | "time" | "date";

const OPTIONS: Record<Mode, Intl.DateTimeFormatOptions> = {
  datetime: { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" },
  time: { hour: "2-digit", minute: "2-digit" },
  date: { weekday: "long", day: "2-digit", month: "long" },
};

export function LocalDateTime({ value, mode = "datetime" }: { value: string; mode?: Mode }): ReactElement {
  const locale = useLocale();
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setText(new Intl.DateTimeFormat(locale === "en" ? "en-US" : "es-CO", OPTIONS[mode]).format(new Date(value)));
  }, [value, mode, locale]);

  return (
    <time dateTime={value} suppressHydrationWarning>
      {text ?? "—"}
    </time>
  );
}
