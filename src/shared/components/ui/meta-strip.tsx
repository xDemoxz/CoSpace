import type { ReactElement, ReactNode } from "react";
import { Eyebrow } from "@/shared/components/ui/eyebrow";

export type MetaItem = { label: string; value: ReactNode };

// Franja de datos separados por líneas verticales, como la cabecera de una lámina.
export function MetaStrip({
  items,
  tone = "light",
}: {
  items: MetaItem[];
  tone?: "light" | "dark";
}): ReactElement {
  const line = tone === "dark" ? "border-linen/25" : "border-ink/20";
  const label = tone === "dark" ? "text-linen/60" : "text-ink-soft";
  return (
    <dl className="grid grid-cols-2 gap-y-4 sm:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className={`border-l ${line} pl-3`}>
          <dt>
            <Eyebrow className={label}>{item.label}</Eyebrow>
          </dt>
          <dd className="mt-1 text-sm">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
