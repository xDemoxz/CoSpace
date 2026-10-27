"use client";
import { useState, type FormEvent, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/shared/lib/api";
import { useErrorMessage } from "@/shared/hooks/useErrorMessage";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Field } from "@/shared/components/ui/field";

export function RegisterForm({ next }: { next: string }): ReactElement {
  const t = useTranslations("auth");
  const toMessage = useErrorMessage();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    try {
      await apiFetch("/api/auth/register", {
        json: { name: form.get("name"), email: form.get("email"), password: form.get("password") },
      });
      window.location.assign(next);
    } catch (caught) {
      setError(toMessage(caught));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <Field name="name" label={t("name")} index="01" autoComplete="name" required minLength={2} />
      <Field type="email" name="email" label={t("email")} index="02" autoComplete="email" required />
      <Field type="password" name="password" label={t("password")} index="03" autoComplete="new-password" required minLength={8} />
      {error ? <Alert>{error}</Alert> : null}
      <Button type="submit" arrow className="w-full" disabled={submitting}>
        {submitting ? t("submitting") : t("submitRegister")}
      </Button>
      <p className="text-sm text-ink-soft">
        {t("haveAccount")}{" "}
        <Link href="/login" className="text-forest underline underline-offset-4">{t("toLogin")}</Link>
      </p>
    </form>
  );
}
