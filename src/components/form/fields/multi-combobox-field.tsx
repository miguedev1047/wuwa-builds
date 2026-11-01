import { useSelector } from "@tanstack/react-form"
import type { ReactNode } from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { FieldShell } from "../field-shell"
import { useFieldContext } from "../form-context"

export type MultiComboboxOption = {
  label: string
  value: string
}

type MultiComboboxFieldProps = {
  label: ReactNode
  description?: ReactNode
  options: readonly MultiComboboxOption[]
  placeholder?: string
  emptyMessage?: ReactNode
  disabled?: boolean
  className?: string
}

export function MultiComboboxField({
  label,
  description,
  options,
  placeholder,
  emptyMessage = "Sin opciones",
  disabled,
  className,
}: MultiComboboxFieldProps) {
  const field = useFieldContext<string[]>()
  const value = useSelector(field.store, (state) => state.value) ?? []
  const meta = useSelector(field.store, (state) => state.meta)
  const invalid = meta.isTouched && !meta.isValid
  const anchor = useComboboxAnchor()

  const labelOf = (name: string) =>
    options.find((option) => option.value === name)?.label ?? name

  return (
    <FieldShell
      label={label}
      description={description}
      htmlFor={field.name}
      invalid={invalid}
      errors={meta.errors}
      className={className}
    >
      <Combobox<string, true>
        multiple
        autoHighlight
        items={options.map((option) => option.value)}
        value={value}
        onValueChange={(next) => field.handleChange(next)}
        disabled={disabled}
      >
        <ComboboxChips ref={anchor} className="w-full" aria-invalid={invalid}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((name) => (
                  <ComboboxChip key={name}>{labelOf(name)}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id={field.name}
                  placeholder={values.length === 0 ? placeholder : undefined}
                  onBlur={field.handleBlur}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
          <ComboboxList>
            {(name: string) => (
              <ComboboxItem key={name} value={name}>
                {labelOf(name)}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </FieldShell>
  )
}
