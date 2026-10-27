"use client";
import { useState, type FormEvent, type ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { apiFetch } from "@/shared/lib/api";
import { useErrorMessage } from "@/shared/hooks/useErrorMessage";
import { Alert } from "@/shared/components/ui/alert";
import { Button } from "@/shared/components/ui/button";
import { Field } from "@/shared/components/ui/field";

export function LoginForm({ next }: { next: string }): ReactElement {
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
      await apiFetch("/api/auth/login", {
        json: { email: form.get("email"), password: form.get("password") },
      });
      // Recarga completa: los layouts del servidor leen la cookie nueva.
      window.location.assign(next);
    } catch (caught) {
      setError(toMessage(caught));
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <Field type="email" name="email" label={t("email")} index="01" autoComplete="email" required />
      <Field type="password" name="password" label={t("password")} index="02" autoComplete="current-password" required />
      {error ? <Alert>{error}</Alert> : null}
      <Button type="submit" arrow className="w-full" disabled={submitting}>
        {submitting ? t("submitting") : t("submitLogin")}
      </Button>
      <p className="text-sm text-ink-soft">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-forest underline underline-offset-4">{t("toRegister")}</Link>
      </p>
    </form>
  );
}
