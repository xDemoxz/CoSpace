// Barra del área privada: menú de usuario. Recibe el rol desde el layout (servidor).
import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Role } from "@/shared/types";
import { Logo } from "@/shared/components/ui/logo";
import { LocaleSwitcher } from "@/shared/layouts/locale-switcher";
import { LogoutButton } from "@/shared/layouts/logout-button";

export function UserNavbar({ role }: { role: Role }): ReactElement {
  const t = useTranslations("nav");
  return (
    <header className="bg-ink text-linen">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="CoSpace">
            <Logo />
          </Link>
          <span className="border border-linen/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-linen/70">
            {role}
          </span>
        </div>
        <div className="flex items-center gap-5 font-mono text-[11px] uppercase tracking-[0.14em] sm:gap-8">
          <Link href="/spaces" className="text-linen/70 hover:text-linen">{t("spaces")}</Link>
          <Link href="/dashboard" className="text-linen/70 hover:text-linen">{t("dashboard")}</Link>
          {role === "ADMIN" ? (
            <Link href="/admin" className="text-linen/70 hover:text-linen">{t("admin")}</Link>
          ) : null}
          <LogoutButton className="text-oak hover:text-linen" />
          <LocaleSwitcher tone="dark" />
        </div>
      </nav>
    </header>
  );
}
