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

export type FormOption = {
  label: ReactNode
  value: string | number
}

type ComboboxFieldProps = {
  label: ReactNode
  description?: ReactNode
  options: readonly FormOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function ComboboxField({
  label,
  description,
  options,
  placeholder,
  className,
  disabled,
}: ComboboxFieldProps) {
  const field = useFieldContext<string | number>()
  const value = useSelector(field.store, (state) => state.value)
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
      <Select<string | number>
        name={field.name}
        items={[...options]}
        value={value === "" ? null : (value ?? null)}
        disabled={disabled}
        onValueChange={(next) => {
          if (next !== null) field.handleChange(next)
        }}
      >
        <SelectTrigger
          id={field.name}
          className="w-full"
          aria-invalid={invalid}
          disabled={disabled}
        >
          <SelectValue placeholder={placeholder} />
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
