import type { ReactNode } from "react"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

type FieldShellProps = {
  label: ReactNode
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
 * stays presentational.
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
    <Field data-invalid={invalid} className={className}>
      <FieldLabel htmlFor={htmlFor}>{label}</FieldLabel>
      {children}
      {description ? <FieldDescription>{description}</FieldDescription> : null}
      <FieldError errors={errors} />
    </Field>
  )
}
