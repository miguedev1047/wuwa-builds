import { useSelector } from "@tanstack/react-form"
import type { ComponentProps, ReactNode } from "react"
import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"
import {
  NumberField as NumberFieldRoot,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
} from "@/components/ui/number-field"

type NumberFieldProps = {
  /** Label shown in the scrub area; it also names the input. */
  label: string
  description?: ReactNode
  /** Applied to the field wrapper. */
  className?: string
  /** Placeholder of the text input. */
  placeholder?: string
} & Omit<
  ComponentProps<typeof NumberFieldRoot>,
  | "value"
  | "defaultValue"
  | "onValueChange"
  | "name"
  | "id"
  | "className"
  | "children"
>

/** Numeric input with decrement/increment buttons and a draggable label. */
export function NumberField({
  label,
  description,
  className,
  placeholder,
  ...props
}: NumberFieldProps) {
  const field = useFieldContext<number>()
  const value = useSelector(field.store, (state) => state.value)
  const meta = useSelector(field.store, (state) => state.meta)
  const invalid = meta.isTouched && !meta.isValid

  return (
    <FieldShell
      description={description}
      htmlFor={field.name}
      invalid={invalid}
      errors={meta.errors}
      className={className}
    >
      <NumberFieldRoot
        id={field.name}
        value={value ?? null}
        onValueChange={(next) => field.handleChange(next ?? 0)}
        {...props}
      >
        <NumberFieldScrubArea label={label} />

        <NumberFieldGroup aria-invalid={invalid}>
          <NumberFieldDecrement />

          <NumberFieldInput
            placeholder={placeholder}
            aria-invalid={invalid}
            onBlur={field.handleBlur}
          />

          <NumberFieldIncrement />
        </NumberFieldGroup>
      </NumberFieldRoot>
    </FieldShell>
  )
}
