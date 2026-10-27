import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { getSessionFromCookies } from "@/features/auth/services/session";
import { Eyebrow } from "@/shared/components/ui/eyebrow";
import { Logo } from "@/shared/components/ui/logo";
import { LocaleSwitcher } from "@/shared/layouts/locale-switcher";
import { LogoutButton } from "@/shared/layouts/logout-button";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

// Layout (admin): panel propio con barra lateral oscura.
export default async function AdminLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const session = await getSessionFromCookies();
  if (!session) redirect({ href: "/login", locale });
  if (session?.role !== "ADMIN") redirect({ href: "/", locale });

  const t = await getTranslations("admin");
  const tNav = await getTranslations("nav");

  return (
    <div className="grid min-h-screen flex-1 lg:grid-cols-[240px_1fr]">
      <aside className="flex flex-col gap-10 bg-ink p-6 text-linen">
        <Link href="/" aria-label="CoSpace"><Logo /></Link>
        <nav className="flex flex-col gap-3 font-mono text-[11px] uppercase tracking-[0.14em]">
          <Eyebrow className="text-linen/40">{t("panel")}</Eyebrow>
          <Link href="/admin" className="text-linen">{t("navSpaces")}</Link>
          <Link href="/spaces" className="text-linen/60 hover:text-linen">{tNav("spaces")}</Link>
          <Link href="/dashboard" className="text-linen/60 hover:text-linen">{tNav("dashboard")}</Link>
        </nav>
        <div className="mt-auto flex items-center justify-between border-t border-linen/20 pt-4 font-mono text-[11px] uppercase tracking-[0.14em]">
          <LogoutButton className="text-oak hover:text-linen" />
          <LocaleSwitcher tone="dark" />
        </div>
      </aside>
      <main className="bg-paper px-5 py-10 sm:px-10">{children}</main>
    </div>
  );
}
