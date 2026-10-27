// Detalle (SSR): imagen como "figura", ficha técnica y formulario de reserva.
import type { ReactElement } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { SpaceDto } from "@/shared/types";
import { buttonClass } from "@/shared/components/ui/button";
import { Container } from "@/shared/components/ui/container";
import { Eyebrow } from "@/shared/components/ui/eyebrow";
import { MetaStrip } from "@/shared/components/ui/meta-strip";
import { formatCOP } from "@/shared/utils/format";
import { SpaceTypeTag } from "@/features/spaces/components/space-type-tag";
import { TYPE_STYLE } from "@/features/spaces/types";
import { BookingForm } from "@/features/bookings/components/booking-form";

export function SpaceDetailPage({
  space,
  isAuthenticated,
  loginHref,
}: {
  space: SpaceDto;
  isAuthenticated: boolean;
  loginHref: string;
}): ReactElement {
  const t = useTranslations("space");
  const locale = useLocale();

  return (
    <Container className="py-10">
      <Link href="/spaces" className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft hover:text-ink">
        ← {t("back")}
      </Link>

      <div className="mt-6 border-t border-ink/20 pt-6">
        <MetaStrip
          items={[
            { label: t("type"), value: <SpaceTypeTag type={space.type} /> },
            { label: t("capacity"), value: t("capacityValue", { count: space.capacity }) },
            { label: t("pricePerHour"), value: formatCOP(space.pricePerHour, locale) },
            { label: t("code"), value: `${TYPE_STYLE[space.type].code}-${space.id.slice(0, 4).toUpperCase()}` },
          ]}
        />
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
        <figure>
          <div className="relative aspect-[4/3] overflow-hidden bg-oak">
            <Image src={space.imageUrl} alt={space.name} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </div>
          <figcaption className="mt-3 flex justify-between border-t border-ink/15 pt-2">
            <Eyebrow className="text-ink-soft">{t("figure")}</Eyebrow>
            <Eyebrow className="text-ink-soft">{space.name}</Eyebrow>
          </figcaption>
        </figure>

        <div>
          <h1 className="text-5xl font-medium leading-[0.92] tracking-[-0.04em] sm:text-6xl">{space.name}</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">{space.description}</p>

          <ul className="mt-8 grid grid-cols-3 border-y border-ink/15">
            {(["rule1", "rule2", "rule3"] as const).map((rule) => (
              <li key={rule} className="border-l border-ink/15 px-3 py-3 first:border-l-0 first:pl-0">
                <Eyebrow className="text-ink-soft">{t(`${rule}Label`)}</Eyebrow>
                <p className="mt-1 text-lg font-medium tracking-[-0.01em]">{t(`${rule}Value`)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            {isAuthenticated ? (
              <BookingForm spaceId={space.id} pricePerHour={space.pricePerHour} />
            ) : (
              <div className="bg-paper p-6">
                <p className="text-lg">{t("loginToBook")}</p>
                <Link href={loginHref} className={buttonClass("primary", "mt-4 w-full")}>
                  <span>{t("loginCta")}</span>
                  <span aria-hidden>→</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
