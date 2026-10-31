import { useSelector } from "@tanstack/react-form"
import type { ComponentProps, ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { FieldShell } from "../field-shell"
import { useFieldContext } from "../form-context"

type TextFieldProps = {
  label: ReactNode
  description?: ReactNode
  className?: string
} & Omit<ComponentProps<typeof Input>, "value" | "onChange" | "name" | "id">

export function TextField({
  label,
  description,
  className,
  ...props
}: TextFieldProps) {
  const field = useFieldContext<string>()
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
      <Input
        id={field.name}
        name={field.name}
        value={value ?? ""}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        autoComplete="off"
        {...props}
      />
    </FieldShell>
  )
}
