import type { ReactElement, ReactNode } from "react";

// Etiqueta pequeña en monoespaciada y mayúsculas: el "pie de lámina" del sistema.
export function Eyebrow({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}): ReactElement {
  return (
    <span className={`font-mono text-[11px] uppercase tracking-[0.14em] ${className}`}>
      {children}
    </span>
  );
}
