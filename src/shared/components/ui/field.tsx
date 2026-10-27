import type {
  InputHTMLAttributes,
  ReactElement,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { Eyebrow } from "@/shared/components/ui/eyebrow";

const CONTROL =
  "mt-2 w-full border-0 border-b border-ink/30 bg-transparent px-0 py-2 text-lg text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-forest";

function FieldLabel({ label, index }: { label: string; index?: string }): ReactElement {
  return (
    <span className="flex items-baseline justify-between gap-4 text-ink-soft">
      <Eyebrow>{label}</Eyebrow>
      {index ? <Eyebrow className="text-ink/40">{index}</Eyebrow> : null}
    </span>
  );
}

function FieldError({ error }: { error?: string }): ReactElement | null {
  return error ? <span className="mt-1 block font-mono text-[11px] text-clay">{error}</span> : null;
}

type BaseProps = { label: string; index?: string; error?: string };

export function Field({
  label,
  index,
  error,
  id,
  name,
  ...props
}: BaseProps & InputHTMLAttributes<HTMLInputElement>): ReactElement {
  const inputId = id ?? name;
  return (
    <label htmlFor={inputId} className="block">
      <FieldLabel label={label} index={index} />
      <input id={inputId} name={name} className={CONTROL} {...props} />
      <FieldError error={error} />
    </label>
  );
}

export function SelectField({
  label,
  index,
  error,
  id,
  name,
  children,
  ...props
}: BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }): ReactElement {
  const inputId = id ?? name;
  return (
    <label htmlFor={inputId} className="block">
      <FieldLabel label={label} index={index} />
      <select id={inputId} name={name} className={`${CONTROL} cursor-pointer appearance-none`} {...props}>
        {children}
      </select>
      <FieldError error={error} />
    </label>
  );
}

export function TextAreaField({
  label,
  index,
  error,
  id,
  name,
  ...props
}: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>): ReactElement {
  const inputId = id ?? name;
  return (
    <label htmlFor={inputId} className="block">
      <FieldLabel label={label} index={index} />
      <textarea id={inputId} name={name} rows={3} className={`${CONTROL} resize-none text-base`} {...props} />
      <FieldError error={error} />
    </label>
  );
}
