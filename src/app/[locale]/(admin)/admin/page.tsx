import { setRequestLocale } from "next-intl/server";
import { AdminPage } from "@/features/spaces/pages/AdminPage";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <AdminPage />;
}
