// Pie oscuro, inspirado en la franja inferior de una lámina de marca.
import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Mark } from "@/shared/components/ui/logo";

export function Footer(): ReactElement {
  const t = useTranslations("footer");
  const columns = [t("tagline"), t("hours"), t("city"), t("rights", { year: 2026 })];
  return (
    <footer className="mt-24 bg-ink text-linen">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-[auto_1fr] sm:items-center sm:px-8">
        <span className="flex items-center gap-2 text-lg font-medium tracking-[-0.02em]">
          <Mark /> CoSpace
        </span>
        <ul className="grid grid-cols-2 gap-y-3 sm:grid-cols-4">
          {columns.map((text) => (
            <li key={text} className="border-l border-linen/20 pl-3 font-mono text-[11px] uppercase tracking-[0.12em] text-linen/70">
              {text}
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
