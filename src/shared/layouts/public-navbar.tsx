// Barra pública. No lee cookies para no romper el SSG de la Home.
import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/shared/components/ui/logo";
import { LocaleSwitcher } from "@/shared/layouts/locale-switcher";

export function PublicNavbar(): ReactElement {
  const t = useTranslations("nav");
  return (
    <header className="border-b border-ink/15 bg-linen/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-8">
        <Link href="/" aria-label="CoSpace">
          <Logo />
        </Link>
        <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.14em] sm:gap-8">
          <Link href="/spaces" className="hover:text-forest">{t("spaces")}</Link>
          <Link href="/dashboard" className="hidden hover:text-forest sm:inline">{t("dashboard")}</Link>
          <Link href="/login" className="border border-ink px-3 py-1.5 hover:bg-ink hover:text-linen">
            {t("login")}
          </Link>
          <LocaleSwitcher />
        </div>
      </nav>
    </header>
  );
}
