import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { buttonClass } from "@/shared/components/ui/button";
import { Eyebrow } from "@/shared/components/ui/eyebrow";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <main className="bg-blueprint flex flex-1 flex-col items-center justify-center gap-6 px-5 py-24 text-center">
      <Eyebrow className="text-ink-soft">404</Eyebrow>
      <h1 className="text-6xl font-medium tracking-[-0.045em]">{t("title")}</h1>
      <p className="max-w-sm text-ink-soft">{t("body")}</p>
      <Link href="/" className={buttonClass("dark")}>
        <span>{t("back")}</span>
        <span aria-hidden>→</span>
      </Link>
    </main>
  );
}
