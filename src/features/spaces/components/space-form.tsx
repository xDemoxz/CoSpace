"use client";
// Formulario de espacio para el admin: sirve para crear y para editar.
import type { FormEvent, ReactElement } from "react";
import { useTranslations } from "next-intl";
import { SPACE_TYPES, type SpaceDto, type SpaceInput, type SpaceType } from "@/shared/types";
import { Button } from "@/shared/components/ui/button";
import { Field, SelectField, TextAreaField } from "@/shared/components/ui/field";

export function SpaceForm({
  initial,
  submitting,
  onSubmit,
  onCancel,
}: {
  initial?: SpaceDto;
  submitting: boolean;
  onSubmit: (input: SpaceInput) => Promise<void>;
  onCancel?: () => void;
}): ReactElement {
  const t = useTranslations("admin");
  const tTypes = useTranslations("spaceTypes");

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await onSubmit({
      name: String(form.get("name") ?? ""),
      description: String(form.get("description") ?? ""),
      type: String(form.get("type")) as SpaceType,
      capacity: Number(form.get("capacity")),
      pricePerHour: Number(form.get("pricePerHour")),
      imageUrl: String(form.get("imageUrl") ?? ""),
    });
  }

  return (
    <form key={initial?.id ?? "new"} onSubmit={handleSubmit} className="space-y-6">
      <Field name="name" label={t("name")} index="01" required minLength={2} defaultValue={initial?.name} />
      <TextAreaField name="description" label={t("description")} index="02" required defaultValue={initial?.description} />
      <div className="grid grid-cols-2 gap-6">
        <SelectField name="type" label={t("type")} index="03" defaultValue={initial?.type ?? "DESK"}>
          {SPACE_TYPES.map((type) => (
            <option key={type} value={type}>{tTypes(type)}</option>
          ))}
        </SelectField>
        <Field type="number" name="capacity" label={t("capacity")} index="04" min={1} required defaultValue={initial?.capacity ?? 1} />
      </div>
      <Field type="number" name="pricePerHour" label={t("price")} index="05" min={1} step="0.01" required defaultValue={initial ? Number(initial.pricePerHour) : undefined} />
      <Field type="url" name="imageUrl" label={t("imageUrl")} index="06" required defaultValue={initial?.imageUrl} placeholder="https://picsum.photos/seed/..." />
      <div className="flex gap-3">
        <Button type="submit" arrow className="flex-1" disabled={submitting}>
          {submitting ? t("saving") : t("save")}
        </Button>
        {onCancel ? (
          <Button variant="outline" onClick={onCancel}>{t("cancelEdit")}</Button>
        ) : null}
      </div>
    </form>
  );
}
