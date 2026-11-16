import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"
import { Combobox } from "@/components/panelui/combobox"
import { useSelector } from "@tanstack/react-form"
import type { ReactNode } from "react"

export type MultiComboboxOption = {
  label: string
  value: string
}

type MultiComboboxFieldProps = {
  label: ReactNode
  description?: ReactNode
  options: readonly MultiComboboxOption[]
  placeholder?: string
  emptyMessage?: string
  disabled?: boolean
  className?: string
}

export function MultiComboboxField({
  label,
  description,
  options,
  placeholder,
  emptyMessage = "Sin opciones",
  disabled,
  className,
}: MultiComboboxFieldProps) {
  const field = useFieldContext<string[]>()
  const value = useSelector(field.store, (state) => state.value) ?? []
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
        mode="multiple"
        id={field.name}
        name={field.name}
        value={value}
        onValueChange={(next) => field.handleChange(next)}
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
