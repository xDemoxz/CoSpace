import type { ReactElement, ReactNode } from "react";

export function Alert({
  children,
  tone = "error",
}: {
  children: ReactNode;
  tone?: "error" | "success";
}): ReactElement {
  const styles = tone === "error" ? "border-clay bg-clay/10 text-clay" : "border-forest bg-forest/10 text-forest";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`border-l-[3px] px-4 py-3 text-sm ${styles}`}>
      {children}
    </div>
  );
}
