"use client";
// Selector de idioma visible: cambia /es <-> /en manteniendo la página.
import type { ReactElement } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

export function LocaleSwitcher({ tone = "light" }: { tone?: "light" | "dark" }): ReactElement {
  const locale = useLocale();
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const idle = tone === "dark" ? "text-linen/50 hover:text-linen" : "text-ink/45 hover:text-ink";
  const current = tone === "dark" ? "text-linen" : "text-ink";

  return (
    <div role="group" aria-label={t("language")} className="flex items-center font-mono text-[11px] uppercase tracking-[0.14em]">
      {routing.locales.map((code, position) => (
        <span key={code} className="flex items-center">
          {position > 0 ? <span className={`mx-1.5 ${idle}`}>/</span> : null}
          <button
            type="button"
            aria-pressed={code === locale}
            onClick={() => router.replace(pathname, { locale: code as Locale })}
            className={`transition-colors ${code === locale ? `${current} underline underline-offset-4` : idle}`}
          >
            {code}
          </button>
        </span>
      ))}
    </div>
  );
}
