"use client";
// Panel de administración: lista todos los espacios (activos e inactivos),
// permite crear, editar y desactivar. Las reglas (p. ej. regla 13) las valida el servidor.
import { useCallback, useEffect, useState, type ReactElement } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { SpaceDto, SpaceInput } from "@/shared/types";
import { apiFetch } from "@/shared/lib/api";
import { useErrorMessage } from "@/shared/hooks/useErrorMessage";
import { Alert } from "@/shared/components/ui/alert";
import { Eyebrow } from "@/shared/components/ui/eyebrow";
import { formatCOP, pad2 } from "@/shared/utils/format";
import { SpaceForm } from "@/features/spaces/components/space-form";
import { SpaceTypeTag } from "@/features/spaces/components/space-type-tag";

export function AdminSpaces(): ReactElement {
  const t = useTranslations("admin");
  const locale = useLocale();
  const toMessage = useErrorMessage();
  const [spaces, setSpaces] = useState<SpaceDto[] | null>(null);
  const [editing, setEditing] = useState<SpaceDto | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    try {
      const result = await apiFetch<{ spaces: SpaceDto[] }>("/api/admin/spaces");
      setSpaces(result.spaces);
    } catch (caught) {
      setError(toMessage(caught));
    }
  }, [toMessage]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function run(action: () => Promise<unknown>, message: string): Promise<void> {
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      await action();
      setNotice(message);
      setEditing(null);
      await load();
    } catch (caught) {
      setError(toMessage(caught));
    } finally {
      setSubmitting(false);
    }
  }

  async function save(input: SpaceInput): Promise<void> {
    await run(
      () =>
        editing
          ? apiFetch(`/api/spaces/${editing.id}`, { method: "PATCH", json: input })
          : apiFetch("/api/spaces", { json: input }),
      t("saved"),
    );
  }

  async function deactivate(space: SpaceDto): Promise<void> {
    if (!window.confirm(t("confirmDeactivate", { name: space.name }))) return;
    await run(() => apiFetch(`/api/spaces/${space.id}/deactivate`, { method: "POST" }), t("deactivated"));
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
      <section>
        {error ? <div className="mb-4"><Alert>{error}</Alert></div> : null}
        {notice ? <div className="mb-4"><Alert tone="success">{notice}</Alert></div> : null}

        {!spaces ? (
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-ink-soft">{t("loading")}</p>
        ) : spaces.length === 0 ? (
          <p className="text-ink-soft">{t("empty")}</p>
        ) : (
          <ol className="border-t border-ink/20">
            {spaces.map((space, index) => (
              <li
                key={space.id}
                className={`grid gap-2 border-b border-ink/15 py-4 sm:grid-cols-[40px_1fr_auto_auto] sm:items-center sm:gap-5 ${space.active ? "" : "opacity-50"}`}
              >
                <Eyebrow className="text-ink-soft">{pad2(index + 1)}</Eyebrow>
                <div>
                  <p className="font-medium">{space.name}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <SpaceTypeTag type={space.type} />
                    <Eyebrow className={space.active ? "text-forest" : "text-clay"}>
                      {space.active ? t("active") : t("inactive")}
                    </Eyebrow>
                  </div>
                </div>
                <span className="text-sm">{formatCOP(space.pricePerHour, locale)}</span>
                <div className="flex gap-4 font-mono text-[11px] uppercase tracking-[0.14em]">
                  <button type="button" onClick={() => setEditing(space)} className="hover:text-forest">
                    {t("edit")}
                  </button>
                  {space.active ? (
                    <button type="button" onClick={() => void deactivate(space)} className="text-clay hover:underline">
                      {t("deactivate")}
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <aside className="h-fit border border-ink/20 bg-paper p-6">
        <div className="mb-6 flex items-baseline justify-between border-b border-ink/15 pb-3">
          <Eyebrow className="text-ink-soft">{editing ? "B" : "A"}</Eyebrow>
          <h2 className="text-xl font-medium tracking-[-0.02em]">{editing ? t("editSpace") : t("newSpace")}</h2>
        </div>
        <SpaceForm
          initial={editing ?? undefined}
          submitting={submitting}
          onSubmit={save}
          onCancel={editing ? () => setEditing(null) : undefined}
        />
      </aside>
    </div>
  );
}
