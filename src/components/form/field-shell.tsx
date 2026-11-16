import { Field } from "@/components/panelui/field"
import { Show } from "@/components/utility/show"
import type { ReactNode } from "react"

type FieldShellProps = {
  label?: ReactNode
  htmlFor: string
  invalid: boolean
  errors?: Array<{ message?: string } | undefined>
  description?: ReactNode
  className?: string
  children: ReactNode
}

/**
 * Shared label + error layout for every field component.
 *
 * Field components read their meta reactively and pass it down, so the shell
 * stays presentational. `label` is optional because the number field renders
 * its own label inside the scrub area.
 */
export function FieldShell({
  label,
  htmlFor,
  invalid,
  errors,
  description,
  className,
  children,
}: FieldShellProps) {
  return (
    <Field name={htmlFor} invalid={invalid} className={className}>
      <Show when={label}>
        <Field.Label htmlFor={htmlFor}>{label}</Field.Label>
      </Show>
      {children}
      <Show when={description}>
        <Field.Description>{description}</Field.Description>
      </Show>
      <Show when={invalid && errors?.length}>
        <Field.Error match>
          {[
            ...new Set(errors?.map((error) => error?.message).filter(Boolean)),
          ].join(". ")}
        </Field.Error>
      </Show>
    </Field>
  )
}
