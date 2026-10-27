import type { ReactElement } from "react";

// Marca propia: una cuadrícula de 2x2 con una celda ocupada (un espacio reservado).
export function Mark({ className = "h-5 w-5" }: { className?: string }): ReactElement {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <rect x="1" y="1" width="10" height="10" fill="currentColor" />
      <rect x="13.5" y="1.5" width="9" height="9" fill="none" stroke="currentColor" />
      <rect x="1.5" y="13.5" width="9" height="9" fill="none" stroke="currentColor" />
      <rect x="13.5" y="13.5" width="9" height="9" fill="none" stroke="currentColor" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }): ReactElement {
  return (
    <span className={`inline-flex items-center gap-2 text-lg font-medium tracking-[-0.02em] ${className}`}>
      <Mark />
      CoSpace
    </span>
  );
}
