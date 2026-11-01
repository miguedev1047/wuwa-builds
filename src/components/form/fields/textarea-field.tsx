import { useSelector } from "@tanstack/react-form"
import type { ComponentProps, ReactNode } from "react"
import { Textarea } from "@/components/ui/textarea"
import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"

type TextareaFieldProps = {
  label: ReactNode
  description?: ReactNode
  className?: string
} & Omit<ComponentProps<typeof Textarea>, "value" | "onChange" | "name" | "id">

export function TextareaField({
  label,
  description,
  className,
  ...props
}: TextareaFieldProps) {
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
      <Textarea
        id={field.name}
        name={field.name}
        value={value ?? ""}
        onChange={(event) => field.handleChange(event.target.value)}
        onBlur={field.handleBlur}
        aria-invalid={invalid}
        {...props}
      />
    </FieldShell>
  )
}
