import { useSelector } from "@tanstack/react-form"
import type { ReactNode } from "react"
import { useFieldContext } from "@/components/form/form-context"
import { Switch } from "@/components/ui/switch"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Show } from "@/components/utility/show"
import { cn } from "cn"

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
    <Field
      orientation="horizontal"
      data-invalid={invalid}
      className={cn("border", className)}
    >
      <FieldLabel htmlFor={field.name} className="p-2">
        <FieldContent>
          <FieldTitle>{label}</FieldTitle>
          <FieldDescription>{description}</FieldDescription>
          <Show when={meta.errors}>
            <FieldError errors={meta.errors} />
          </Show>
        </FieldContent>

        <Switch
          id={field.name}
          checked={value ?? false}
          disabled={disabled}
          onCheckedChange={(checked) => field.handleChange(checked)}
          onBlur={field.handleBlur}
        />
      </FieldLabel>
    </Field>
  )
}
