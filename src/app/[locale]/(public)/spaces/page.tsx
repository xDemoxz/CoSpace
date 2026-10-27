// Catálogo (SSR): se consulta la base de datos en cada petición.
import { setRequestLocale } from "next-intl/server";
import { isSpaceType } from "@/shared/types";
import { listPublicSpaces } from "@/features/spaces/services/space.queries";
import { SpacesCatalogPage } from "@/features/spaces/pages/SpacesCatalogPage";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { type } = await searchParams;
  const activeType = isSpaceType(type) ? type : undefined;
  const spaces = await listPublicSpaces(activeType);
  return <SpacesCatalogPage spaces={spaces} activeType={activeType} />;
}
