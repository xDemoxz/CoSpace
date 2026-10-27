// Detalle (SSR): ruta dinámica [id].
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getSessionFromCookies } from "@/features/auth/services/session";
import { findPublicSpace } from "@/features/spaces/services/space.queries";
import { SpaceDetailPage } from "@/features/spaces/pages/SpaceDetailPage";

type Props = { params: Promise<{ locale: string; id: string }> };

export default async function Page({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const space = await findPublicSpace(id);
  if (!space) notFound();
  const session = await getSessionFromCookies();
  const next = encodeURIComponent(`/${locale}/spaces/${id}`);
  return <SpaceDetailPage space={space} isAuthenticated={session !== null} loginHref={`/login?next=${next}`} />;
}
