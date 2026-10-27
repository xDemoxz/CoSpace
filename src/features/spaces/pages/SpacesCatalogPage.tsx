// Catálogo (SSR): recibe los espacios ya consultados en el servidor.
import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import type { SpaceDto, SpaceType } from "@/shared/types";
import { Container } from "@/shared/components/ui/container";
import { SectionHeader } from "@/shared/components/ui/section-header";
import { SpaceCard } from "@/features/spaces/components/space-card";
import { TypeFilter } from "@/features/spaces/components/type-filter";

export function SpacesCatalogPage({
  spaces,
  activeType,
}: {
  spaces: SpaceDto[];
  activeType?: SpaceType;
}): ReactElement {
  const t = useTranslations("catalog");

  return (
    <Container className="space-y-10 py-12">
      <SectionHeader as="h1" index={t("index")} title={t("title")} aside={t("count", { count: spaces.length })} />
      <TypeFilter activeType={activeType} />

      {spaces.length === 0 ? (
        <p className="border border-dashed border-ink/30 p-10 text-center text-ink-soft">{t("empty")}</p>
      ) : (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space, index) => (
            <SpaceCard key={space.id} space={space} position={index + 1} total={spaces.length} />
          ))}
        </div>
      )}
    </Container>
  );
}
