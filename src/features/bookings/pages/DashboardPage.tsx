import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { Container } from "@/shared/components/ui/container";
import { SectionHeader } from "@/shared/components/ui/section-header";
import { BookingLedger } from "@/features/bookings/components/booking-ledger";

export function DashboardPage(): ReactElement {
  const t = useTranslations("dashboard");
  return (
    <Container className="space-y-10 py-12">
      <SectionHeader as="h1" index={t("index")} title={t("title")} aside={t("aside")} />
      <BookingLedger />
    </Container>
  );
}
