const TIME_ZONE = "America/Bogota";

// Hora (0-23) en Bogotá. No usar date.getHours(): en Vercel el servidor está en UTC.
export function getLocalHour(date: Date): number {
  const hour = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "numeric",
    hourCycle: "h23",
  })
    .formatToParts(date)
    .find((part) => part.type === "hour")?.value;
  return Number(hour);
}

export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
