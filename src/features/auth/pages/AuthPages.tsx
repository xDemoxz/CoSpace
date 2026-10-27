import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Eyebrow } from "@/shared/components/ui/eyebrow";
import { LoginForm } from "@/features/auth/components/login-form";
import { RegisterForm } from "@/features/auth/components/register-form";

function AuthHeading({ index, title, subtitle }: { index: string; title: string; subtitle: string }): ReactElement {
  return (
    <header className="mb-10">
      <Eyebrow className="text-ink-soft">{index}</Eyebrow>
      <h1 className="mt-2 text-5xl font-medium leading-[0.95] tracking-[-0.04em]">{title}</h1>
      <p className="mt-3 text-ink-soft">{subtitle}</p>
    </header>
  );
}

export function LoginPage({ next }: { next: string }): ReactElement {
  const t = useTranslations("auth");
  return (
    <>
      <AuthHeading index={t("loginIndex")} title={t("loginTitle")} subtitle={t("loginSubtitle")} />
      <LoginForm next={next} />
    </>
  );
}

export function RegisterPage({ next }: { next: string }): ReactElement {
  const t = useTranslations("auth");
  return (
    <>
      <AuthHeading index={t("registerIndex")} title={t("registerTitle")} subtitle={t("registerSubtitle")} />
      <RegisterForm next={next} />
    </>
  );
}
