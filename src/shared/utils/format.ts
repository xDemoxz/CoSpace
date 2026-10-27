// Formatos compartidos. El precio viaja como string (Decimal) y se muestra en pesos.
export function formatCOP(value: string | number, locale: string): string {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : "es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

export function pad2(value: number): string {
  return String(value).padStart(2, "0");
}
