import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getSessionFromCookies } from "@/features/auth/services/session";
import { Footer } from "@/shared/layouts/footer";
import { UserNavbar } from "@/shared/layouts/user-navbar";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

// Layout (private): navbar con menú de usuario. El proxy ya protege la ruta;
// esta comprobación es una segunda capa por si se llega sin pasar por él.
export default async function PrivateLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSessionFromCookies();
  if (!session) redirect({ href: "/login", locale });

  return (
    <>
      <UserNavbar role={session?.role ?? "USER"} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
