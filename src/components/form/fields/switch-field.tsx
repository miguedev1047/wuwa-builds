import { useFieldContext } from "@/components/form/form-context"
import { Field } from "@/components/panelui/field"
import { Switch } from "@/components/panelui/switch"
import { FieldContent, FieldTitle } from "@/components/ui/field"

import { Show } from "@/components/utility/show"
import { useSelector } from "@tanstack/react-form"
import { cn } from "cn"
import type { ReactNode } from "react"

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
    <Field invalid={invalid} className={cn("overflow-hidden", className)}>
      <Field.Label htmlFor={field.name}>
        <FieldContent>
          <FieldTitle>{label}</FieldTitle>
          <Field.Description>{description}</Field.Description>
          <Show when={meta.errors}>
            <Field.Error match={invalid}>
              {meta.errors
                .map((error) => error?.message)
                .filter(Boolean)
                .join(". ")}
            </Field.Error>
          </Show>
        </FieldContent>

        <Switch
          id={field.name}
          checked={value ?? false}
          disabled={disabled}
          onCheckedChange={(checked) => field.handleChange(checked)}
          onBlur={field.handleBlur}
        />
      </Field.Label>
    </Field>
  )
}
