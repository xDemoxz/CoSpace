// HOME (SSG): sin base de datos ni cookies. Se genera al compilar, una vez por idioma.
import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SPACE_TYPES } from "@/shared/types";
import { buttonClass } from "@/shared/components/ui/button";
import { Container } from "@/shared/components/ui/container";
import { Eyebrow } from "@/shared/components/ui/eyebrow";
import { MetaStrip } from "@/shared/components/ui/meta-strip";
import { SectionHeader } from "@/shared/components/ui/section-header";
import { TYPE_STYLE } from "@/features/spaces/types";

const RULES = ["duration", "hours", "window", "limit"] as const;
const STEPS = ["1", "2", "3"] as const;

export function HomePage(): ReactElement {
  const t = useTranslations("home");
  const tTypes = useTranslations("spaceTypes");

  return (
    <>
      {/* Portada: bloque verde con cuadrícula de plano y titular enorme. */}
      <section className="bg-blueprint-light bg-forest text-linen">
        <Container className="grid min-h-[78vh] grid-rows-[auto_1fr_auto] gap-10 py-8">
          <div className="flex items-center justify-between border-b border-linen/20 pb-3">
            <Eyebrow className="text-linen/70">{t("eyebrow")}</Eyebrow>
            <Eyebrow className="text-linen/70">{t("edition")}</Eyebrow>
          </div>

          <div className="grid items-end gap-10 lg:grid-cols-[1fr_320px]">
            <h1 className="text-[clamp(3.6rem,11vw,10rem)] font-medium leading-[0.86] tracking-[-0.055em]">
              {t("heroLine1")}
              <br />
              <span className="text-oak">{t("heroLine2")}</span>
            </h1>
            <div className="space-y-6 pb-3">
              <p className="text-lg leading-relaxed text-linen/85">{t("heroBody")}</p>
              <Link href="/spaces" className={buttonClass("light", "w-full")}>
                <span>{t("cta")}</span>
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Container>
        <div className="bg-ink">
          <Container className="py-6">
            <MetaStrip
              tone="dark"
              items={[
                { label: t("metaDesks"), value: "DSK" },
                { label: t("metaRooms"), value: "MTG" },
                { label: t("metaBooths"), value: "BTH" },
                { label: t("metaHours"), value: "07:00 — 21:00" },
              ]}
            />
          </Container>
        </div>
      </section>

      {/* 01: tipos de espacio como columnas de color. */}
      <Container className="mt-24 space-y-10">
        <SectionHeader index="01" title={t("typesTitle")} aside={t("typesAside")} />
        <div className="grid border border-ink/20 sm:grid-cols-3">
          {SPACE_TYPES.map((type) => (
            <Link
              key={type}
              href={`/spaces?type=${type}`}
              className={`group flex min-h-80 flex-col justify-between p-5 ${TYPE_STYLE[type].swatch}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-medium tracking-[-0.02em]">{tTypes(type)}</span>
                <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
              </div>
              <dl className="divide-y divide-current/20 border-t border-current/20 font-mono text-[11px] uppercase tracking-[0.14em]">
                <div className="flex justify-between py-2"><dt className="opacity-70">{t("codeLabel")}</dt><dd>{TYPE_STYLE[type].code}</dd></div>
                <div className="flex justify-between py-2"><dt className="opacity-70">{t("useLabel")}</dt><dd>{t(`typeUse.${type}`)}</dd></div>
              </dl>
            </Link>
          ))}
        </div>
      </Container>

      {/* 02: cómo funciona, en tres pasos numerados. */}
      <Container className="mt-24 space-y-10">
        <SectionHeader index="02" title={t("howTitle")} />
        <ol className="grid gap-10 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step} className="border-l border-ink/20 pl-5">
              <span className="font-mono text-6xl font-medium text-oak">{step.padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl font-medium tracking-[-0.01em]">{t(`steps.${step}.title`)}</h3>
              <p className="mt-2 text-ink-soft">{t(`steps.${step}.body`)}</p>
            </li>
          ))}
        </ol>
      </Container>

      {/* 03: las reglas como espécimen tipográfico. */}
      <Container className="mt-24 space-y-10">
        <SectionHeader index="03" title={t("rulesTitle")} aside={t("rulesAside")} />
        <dl className="bg-blueprint grid border border-ink/20 bg-paper sm:grid-cols-2 lg:grid-cols-4">
          {RULES.map((rule) => (
            <div key={rule} className="border-b border-ink/15 p-6 last:border-b-0 sm:border-r lg:border-b-0">
              <dt className="text-5xl font-medium tracking-[-0.04em]">{t(`rules.${rule}.value`)}</dt>
              <dd className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-soft">
                {t(`rules.${rule}.label`)}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </>
  );
}
