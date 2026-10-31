import type { AnyFieldApi } from "@tanstack/react-form"
import type { ComponentProps, ReactNode } from "react"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

/**
 * Field building blocks for TanStack Form.
 *
 * They receive the `field` from a `form.Field` render prop, so every admin form
 * gets the same label, invalid state and error rendering for free.
 */

export type CatalogFormOption = {
  label: ReactNode
  value: string | number
}

type FormFieldProps = {
  field: AnyFieldApi
  label: ReactNode
  className?: string
  children: ReactNode
}

function isInvalid(field: AnyFieldApi) {
  return field.state.meta.isTouched && !field.state.meta.isValid
}

export function FormField({
  field,
  label,
  className,
  children,
}: FormFieldProps) {
  return (
    <Field data-invalid={isInvalid(field)} className={className}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
      {children}
      <FieldError errors={field.state.meta.errors} />
    </Field>
  )
}

type TextFieldProps = {
  field: AnyFieldApi
  label: ReactNode
  className?: string
} & Omit<ComponentProps<typeof Input>, "value" | "onChange" | "name" | "id">

export function TextField({
  field,
  label,
  className,
  ...props
}: TextFieldProps) {
  return (
    <FormField field={field} label={label} className={className}>
      <Input
        id={field.name}
        name={field.name}
        value={(field.state.value as string | undefined) ?? ""}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={isInvalid(field)}
        autoComplete="off"
        {...props}
      />
    </FormField>
  )
}

type TextareaFieldProps = {
  field: AnyFieldApi
  label: ReactNode
  className?: string
} & Omit<ComponentProps<typeof Textarea>, "value" | "onChange" | "name" | "id">

export function TextareaField({
  field,
  label,
  className,
  ...props
}: TextareaFieldProps) {
  return (
    <FormField field={field} label={label} className={className}>
      <Textarea
        id={field.name}
        name={field.name}
        value={(field.state.value as string | undefined) ?? ""}
        onBlur={field.handleBlur}
        onChange={(event) => field.handleChange(event.target.value)}
        aria-invalid={isInvalid(field)}
        {...props}
      />
    </FormField>
  )
}

type NumberFieldProps = {
  field: AnyFieldApi
  label: ReactNode
  className?: string
} & Omit<
  ComponentProps<typeof Input>,
  "value" | "onChange" | "name" | "id" | "type"
>

export function NumberField({
  field,
  label,
  className,
  ...props
}: NumberFieldProps) {
  const value = field.state.value as number | undefined | null
  // `0` is the "empty" value of the form, so it renders as a placeholder.
  const displayValue =
    value === undefined || value === null || value === 0 ? "" : String(value)

  return (
    <FormField field={field} label={label} className={className}>
      <Input
        id={field.name}
        name={field.name}
        type="number"
        value={displayValue}
        onBlur={field.handleBlur}
        onChange={(event) =>
          field.handleChange(
            event.target.value === "" ? 0 : Number(event.target.value)
          )
        }
        aria-invalid={isInvalid(field)}
        {...props}
      />
    </FormField>
  )
}

type SelectFieldProps = {
  field: AnyFieldApi
  label: ReactNode
  options: readonly CatalogFormOption[]
  disabled?: boolean
  placeholder?: string
  className?: string
  triggerProps?: ComponentProps<typeof SelectTrigger>
}

export function SelectField({
  field,
  label,
  options,
  placeholder,
  disabled = false,
  className,
  triggerProps,
}: SelectFieldProps) {
  const value = field.state.value as string | number | null | undefined

  return (
    <FormField field={field} label={label} className={className}>
      <Select<string | number>
        name={field.name}
        disabled={disabled}
        items={[...options]}
        value={value === "" ? null : (value ?? null)}
        onValueChange={(next) => {
          if (next !== null) field.handleChange(next)
        }}
      >
        <SelectTrigger
          id={field.name}
          className="w-full"
          aria-invalid={isInvalid(field)}
          {...triggerProps}
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
    </FormField>
  )
}
