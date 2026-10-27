import type { ReactNode } from "react";
import { setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Eyebrow } from "@/shared/components/ui/eyebrow";
import { Logo } from "@/shared/components/ui/logo";
import { LocaleSwitcher } from "@/shared/layouts/locale-switcher";

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

function AuthPanel() {
  const t = useTranslations("auth");
  return (
    <aside className="bg-blueprint-light relative hidden flex-col justify-between bg-forest p-10 text-linen lg:flex">
      <Link href="/" aria-label="CoSpace"><Logo /></Link>
      <p className="text-[clamp(3rem,6vw,5.5rem)] font-medium leading-[0.88] tracking-[-0.05em]">
        {t("panelLine1")}
        <br />
        <span className="text-oak">{t("panelLine2")}</span>
      </p>
      <div className="flex justify-between border-t border-linen/20 pt-3">
        <Eyebrow className="text-linen/70">{t("panelMeta")}</Eyebrow>
        <Eyebrow className="text-linen/70">07:00 — 21:00</Eyebrow>
      </div>
    </aside>
  );
}

// Layout (auth): pantalla dividida, centrado y simple, sin navbar.
export default async function AuthLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <div className="grid min-h-screen flex-1 lg:grid-cols-2">
      <AuthPanel />
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:invisible" aria-label="CoSpace"><Logo /></Link>
          <LocaleSwitcher />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">{children}</div>
      </main>
    </div>
  );
}
