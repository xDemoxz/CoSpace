// Tarjeta tipo "ficha técnica": número, imagen, nombre y datos en filas.
import type { ReactElement } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { SpaceDto } from "@/shared/types";
import { Eyebrow } from "@/shared/components/ui/eyebrow";
import { formatCOP, pad2 } from "@/shared/utils/format";
import { SpaceTypeTag } from "@/features/spaces/components/space-type-tag";

export function SpaceCard({
  space,
  position,
  total,
}: {
  space: SpaceDto;
  position: number;
  total: number;
}): ReactElement {
  const t = useTranslations("space");
  const locale = useLocale();

  return (
    <article className="group relative border-t border-ink/20 pt-3">
      <div className="mb-3 flex items-center justify-between">
        <Eyebrow className="text-ink-soft">
          {pad2(position)} / {pad2(total)}
        </Eyebrow>
        <SpaceTypeTag type={space.type} />
      </div>

      <div className="relative aspect-[4/3] overflow-hidden bg-oak">
        <Image
          src={space.imageUrl}
          alt={space.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover grayscale-[40%] transition duration-500 group-hover:scale-[1.02] group-hover:grayscale-0"
        />
      </div>

      <h3 className="mt-4 text-2xl font-medium leading-tight tracking-[-0.02em]">
        <Link href={`/spaces/${space.id}`} className="after:absolute after:inset-0">
          {space.name}
        </Link>
      </h3>

      <dl className="mt-3 divide-y divide-ink/10 border-y border-ink/10 text-sm">
        <div className="flex justify-between py-2">
          <dt><Eyebrow className="text-ink-soft">{t("capacity")}</Eyebrow></dt>
          <dd>{t("capacityValue", { count: space.capacity })}</dd>
        </div>
        <div className="flex justify-between py-2">
          <dt><Eyebrow className="text-ink-soft">{t("pricePerHour")}</Eyebrow></dt>
          <dd className="font-medium">{formatCOP(space.pricePerHour, locale)}</dd>
        </div>
      </dl>
    </article>
  );
}
