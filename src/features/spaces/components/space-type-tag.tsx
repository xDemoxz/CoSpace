import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import type { SpaceType } from "@/shared/types";
import { TYPE_STYLE } from "@/features/spaces/types";

export function SpaceTypeTag({ type }: { type: SpaceType }): ReactElement {
  const t = useTranslations("spaceTypes");
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
      <span aria-hidden className={`h-2.5 w-2.5 ${TYPE_STYLE[type].swatch}`} />
      {t(type)}
    </span>
  );
}
