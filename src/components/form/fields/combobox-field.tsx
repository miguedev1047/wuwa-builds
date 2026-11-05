import { useSelector } from "@tanstack/react-form"
import type { ReactNode } from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"

export type ComboboxOption = {
  label: string
  value: string | number
}

type ComboboxFieldProps = {
  label: ReactNode
  description?: ReactNode
  options: readonly ComboboxOption[]
  placeholder?: string
  emptyMessage?: ReactNode
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

  const selected =
    options.find((option) => String(option.value) === value) ?? null

  return (
    <FieldShell
      label={label}
      description={description}
      htmlFor={field.name}
      invalid={invalid}
      errors={meta.errors}
      className={className}
    >
      <Combobox<ComboboxOption>
        autoHighlight
        items={[...options]}
        value={selected}
        onValueChange={(next) =>
          field.handleChange(next ? String(next.value) : "")
        }
        isItemEqualToValue={(item, current) => item.value === current.value}
        disabled={disabled}
      >
        <ComboboxInput
          id={field.name}
          placeholder={placeholder}
          showClear
          aria-invalid={invalid}
          onBlur={field.handleBlur}
        />

        <ComboboxContent>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(option: ComboboxOption) => (
              <ComboboxItem key={String(option.value)} value={option}>
                {option.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </FieldShell>
  )
}
