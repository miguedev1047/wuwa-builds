import { useSelector } from "@tanstack/react-form"
import type { ReactNode } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"

export type SelectMultipleOption = {
  label: string
  value: string
}

type SelectMultipleFieldProps = {
  label: ReactNode
  description?: ReactNode
  options: readonly SelectMultipleOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

/** Multi-select field that joins the selected labels in its trigger. */
export function SelectMultipleField({
  label,
  description,
  options,
  placeholder = "Seleccionar",
  className,
  disabled,
}: SelectMultipleFieldProps) {
  const field = useFieldContext<string[]>()
  const value = useSelector(field.store, (state) => state.value) ?? []
  const meta = useSelector(field.store, (state) => state.meta)
  const invalid = meta.isTouched && !meta.isValid

  const labelOf = (optionValue: string) =>
    options.find((option) => option.value === optionValue)?.label ?? optionValue

  return (
    <FieldShell
      label={label}
      description={description}
      htmlFor={field.name}
      invalid={invalid}
      errors={meta.errors}
      className={className}
    >
      <Select<string, true>
        multiple
        items={[...options]}
        value={value}
        onValueChange={(next) => field.handleChange(next)}
        disabled={disabled}
      >
        <SelectTrigger
          id={field.name}
          className="w-full"
          aria-invalid={invalid}
        >
          <SelectValue placeholder={placeholder}>
            {(selected: string[]) =>
              selected.length === 0
                ? placeholder
                : selected.map(labelOf).join(", ")
            }
          </SelectValue>
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FieldShell>
  )
}
