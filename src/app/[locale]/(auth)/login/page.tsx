import { setRequestLocale } from "next-intl/server";
import { safeNextPath } from "@/features/auth/services/redirects";
import { LoginPage } from "@/features/auth/pages/AuthPages";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ next?: string }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { next } = await searchParams;
  return <LoginPage next={safeNextPath(next, `/${locale}/dashboard`)} />;
}
