import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { Footer } from "@/shared/layouts/footer";
import { PublicNavbar } from "@/shared/layouts/public-navbar";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

// Layout (public): navbar y footer. No lee cookies, así la Home sigue siendo SSG.
export default async function PublicLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <>
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
