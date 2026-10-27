// Filtro por tipo como columnas de color (similar a la lámina de paleta).
import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SPACE_TYPES, type SpaceType } from "@/shared/types";
import { TYPE_STYLE } from "@/features/spaces/types";

export function TypeFilter({ activeType }: { activeType?: SpaceType }): ReactElement {
  const t = useTranslations("catalog");
  const tTypes = useTranslations("spaceTypes");

  const options: { key: string; href: string; label: string; code: string; swatch: string; active: boolean }[] = [
    { key: "ALL", href: "/spaces", label: t("all"), code: "ALL", swatch: "bg-paper text-ink", active: !activeType },
    ...SPACE_TYPES.map((type) => ({
      key: type,
      href: `/spaces?type=${type}`,
      label: tTypes(type),
      code: TYPE_STYLE[type].code,
      swatch: TYPE_STYLE[type].swatch,
      active: activeType === type,
    })),
  ];

  return (
    <nav aria-label={t("filterLabel")} className="grid grid-cols-2 border border-ink/20 sm:grid-cols-4">
      {options.map((option) => (
        <Link
          key={option.key}
          href={option.href}
          aria-current={option.active ? "page" : undefined}
          className={`flex min-h-24 flex-col justify-between p-3 transition-[filter] hover:brightness-95 ${option.swatch}`}
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">
            {option.code} {option.active ? "●" : ""}
          </span>
          <span className="text-lg font-medium tracking-[-0.01em]">{option.label}</span>
        </Link>
      ))}
    </nav>
  );
}
