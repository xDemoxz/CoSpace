import type { ButtonHTMLAttributes, ReactElement, ReactNode } from "react";

export type ButtonVariant = "primary" | "dark" | "outline" | "light";

const BASE =
  "inline-flex items-center justify-between gap-8 px-4 py-3 font-mono text-xs uppercase tracking-[0.14em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50";

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-forest text-linen hover:bg-ink",
  dark: "bg-ink text-linen hover:bg-forest",
  outline: "border border-ink text-ink hover:bg-ink hover:text-linen",
  light: "bg-linen text-forest hover:bg-oak",
};

// Se exporta la clase para usarla también en <Link>.
export function buttonClass(variant: ButtonVariant = "primary", extra = ""): string {
  return `${BASE} ${VARIANTS[variant]} ${extra}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  arrow?: boolean;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  arrow = false,
  className = "",
  children,
  type = "button",
  ...props
}: ButtonProps): ReactElement {
  return (
    <button type={type} className={buttonClass(variant, className)} {...props}>
      <span>{children}</span>
      {arrow ? <span aria-hidden>→</span> : null}
    </button>
  );
}
