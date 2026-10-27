// Dashboard (CSR): el contenido se carga en el navegador (ver BookingLedger).
import { setRequestLocale } from "next-intl/server";
import { DashboardPage } from "@/features/bookings/pages/DashboardPage";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <DashboardPage />;
}
