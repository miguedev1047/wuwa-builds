import { useSelector } from "@tanstack/react-form"
import type { ComponentProps, ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"

type NumberFieldProps = {
  label: ReactNode
  description?: ReactNode
  className?: string
} & Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange" | "name" | "id" | "type"
>

/** Numeric input. `0` is the empty value of the forms, so it shows the placeholder. */
export function NumberField({
  label,
  description,
  className,
  ...props
}: NumberFieldProps) {
  const field = useFieldContext<number>()
  const value = useSelector(field.store, (state) => state.value)
  const meta = useSelector(field.store, (state) => state.meta)
  const invalid = meta.isTouched && !meta.isValid
  const displayValue = value === undefined || value === 0 ? "" : String(value)

  return (
    <FieldShell
      label={label}
      description={description}
      htmlFor={field.name}
      invalid={invalid}
      errors={meta.errors}
      className={className}
    >
      <Input
        id={field.name}
        name={field.name}
        type="number"
        value={displayValue}
        onChange={(event) =>
          field.handleChange(
            event.target.value === "" ? 0 : Number(event.target.value)
          )
        }
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        {...props}
      />
    </FieldShell>
  )
}
