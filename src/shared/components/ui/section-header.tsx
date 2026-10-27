import type { ReactElement, ReactNode } from "react";
import { Eyebrow } from "@/shared/components/ui/eyebrow";

// Encabezado numerado: "02 | Espacios" con una línea fina arriba.
export function SectionHeader({
  index,
  title,
  aside,
  as: Heading = "h2",
}: {
  index: string;
  title: string;
  aside?: ReactNode;
  as?: "h1" | "h2";
}): ReactElement {
  return (
    <header className="grid gap-3 border-t border-ink/20 pt-4 sm:grid-cols-[96px_1fr_auto] sm:items-start">
      <Eyebrow className="pt-2 text-ink-soft">{index}</Eyebrow>
      <Heading className="text-4xl font-medium leading-[0.95] tracking-[-0.035em] sm:text-6xl">
        {title}
      </Heading>
      {aside ? <div className="text-ink-soft sm:max-w-56 sm:pt-2 sm:text-right">{aside}</div> : null}
    </header>
  );
}
