import { useSelector } from "@tanstack/react-form"
import type { ReactNode } from "react"
import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"
import { Switch } from "@/components/ui/switch"

type SwitchFieldProps = {
  label: ReactNode
  description?: ReactNode
  className?: string
  disabled?: boolean
}

/** Boolean field rendered as a switch, with the shared label and error layout. */
export function SwitchField({
  label,
  description,
  className,
  disabled,
}: SwitchFieldProps) {
  const field = useFieldContext<boolean>()
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
      <Switch
        id={field.name}
        checked={value ?? false}
        disabled={disabled}
        onCheckedChange={(checked) => field.handleChange(checked)}
        onBlur={field.handleBlur}
      />
    </FieldShell>
  )
}
