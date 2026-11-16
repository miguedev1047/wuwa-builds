import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"
import { Combobox } from "@/components/panelui/combobox"
import { useSelector } from "@tanstack/react-form"
import type { ReactNode } from "react"

export type ComboboxOption = {
  label: string
  value: string | number
}

type ComboboxFieldProps = {
  label: ReactNode
  description?: ReactNode
  options: readonly ComboboxOption[]
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
}

/**
 * Searchable single-select.
 *
 * The form always stores the option value as a string, so a numeric id (a
 * character id) never leaks into a text column and the schema keeps one type.
 * Labels are only for display; the option object lets Base UI show the label in
 * the input while the form keeps the id.
 */
export function ComboboxField({
  label,
  description,
  options,
  placeholder,
  emptyMessage = "Sin opciones",
  disabled,
  className,
}: ComboboxFieldProps) {
  const field = useFieldContext<string>()
  const value = useSelector(
    field.store,
    (state) => state.value as string | null
  )
  const meta = useSelector(field.store, (state) => state.meta)
  const invalid = meta.isTouched && !meta.isValid

  return (
    <FieldShell
      label={label}
      description={description}
      htmlFor={field.name}
      invalid={invalid}
      errors={meta.errors}
      className={className}
    >
      <Combobox
        mode="single"
        id={field.name}
        name={field.name}
        value={value || undefined}
        onValueChange={(next) => field.handleChange(next ?? "")}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        placeholder={placeholder}
        emptyMessage={emptyMessage}
        disabled={disabled}
        clearable
      >
        {options.map((option) => (
          <Combobox.Item
            key={String(option.value)}
            value={String(option.value)}
            label={option.label}
          />
        ))}
      </Combobox>
    </FieldShell>
  )
}
