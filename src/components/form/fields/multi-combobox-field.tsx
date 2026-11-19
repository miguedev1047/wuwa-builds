import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"
import { Button } from "@/components/panelui/button"
import { Combobox } from "@/components/panelui/combobox"
import { Show } from "@/components/utility/show"
import { SaveAllIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSelector } from "@tanstack/react-form"
import type { ReactNode } from "react"

export type MultiComboboxOption = {
  label: string
  value: string
  icon?: string
}

type MultiComboboxFieldProps = {
  label: ReactNode
  description?: ReactNode
  options: readonly MultiComboboxOption[]
  placeholder?: string
  emptyMessage?: string
  /** How many chosen options show as chips before the rest fold into a count. Default `2`. */
  maxVisibleChips?: number
  disabled?: boolean
  className?: string
}

export function MultiComboboxField({
  label,
  description,
  options,
  placeholder,
  emptyMessage = "Sin opciones",
  maxVisibleChips,
  disabled,
  className,
}: MultiComboboxFieldProps) {
  const field = useFieldContext<string[]>()
  const value = useSelector(field.store, (state) => state.value) ?? []
  const meta = useSelector(field.store, (state) => state.meta)
  const invalid = meta.isTouched && !meta.isValid

  const allSelected =
    options.length > 0 &&
    options.every((option) => value.includes(option.value))

  const addAllOptions = () => {
    if (allSelected) return
    field.handleChange(options.map((option) => option.value))
  }

  return (
    <FieldShell
      label={label}
      description={description}
      htmlFor={field.name}
      invalid={invalid}
      errors={meta.errors}
      className={className}
    >
      <div className="flex flex-col gap-1">
        <Combobox
          mode="multiple"
          id={field.name}
          name={field.name}
          value={value}
          onValueChange={(next) => field.handleChange(next)}
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          placeholder={placeholder}
          emptyMessage={emptyMessage}
          maxVisibleChips={maxVisibleChips}
          disabled={disabled}
          clearable
        >
          {options.map((option) => (
            <Combobox.Item
              key={String(option.value)}
              value={String(option.value)}
              label={option.label}
              start={
                option.icon ? (
                  <img
                    className="aspect-square size-full rounded-md bg-accent object-contain"
                    src={option.icon}
                    alt={option.label}
                  />
                ) : null
              }
            />
          ))}
        </Combobox>
        <Show when={options.length > 0}>
          <Button
            className="w-full"
            type="button"
            variant="outline"
            disabled={disabled || allSelected}
            onClick={addAllOptions}
          >
            <HugeiconsIcon icon={SaveAllIcon} />
            Seleccionar todo
          </Button>
        </Show>
      </div>
    </FieldShell>
  )
}
