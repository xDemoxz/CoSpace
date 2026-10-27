import type { ReactElement } from "react";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/shared/components/ui/section-header";
import { AdminSpaces } from "@/features/spaces/components/admin-spaces";

export function AdminPage(): ReactElement {
  const t = useTranslations("admin");
  return (
    <div className="space-y-10">
      <SectionHeader as="h1" index={t("index")} title={t("title")} aside={t("aside")} />
      <AdminSpaces />
    </div>
  );
}
