import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"
import { Button } from "@/components/panelui/button"
import { Input } from "@/components/panelui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ImageIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useSelector } from "@tanstack/react-form"
import type { ComponentProps, ReactNode } from "react"

type ImageFieldProps = {
  label: ReactNode
  description?: ReactNode
  className?: string
} & Omit<ComponentProps<typeof Input>, "value" | "onChange" | "name" | "id">

export function ImageField({
  label,
  description,
  className,
  ...props
}: ImageFieldProps) {
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
      <Input.Group>
        <Input
          id={field.name}
          name={field.name}
          value={value ?? ""}
          onChange={(event) => field.handleChange(event.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          autoComplete="off"
          {...props}
        />
        <Input.Addon align="end">
          <Popover>
            <PopoverTrigger
              render={
                <Button
                  size="icon-sm"
                  aria-label="Previsualizar imagen"
                  disabled={!value}
                  variant="ghost"
                >
                  <HugeiconsIcon icon={ImageIcon} />
                </Button>
              }
            />
            <PopoverContent className="size-40 p-4">
              <img
                src={value}
                alt="Preview"
                className="size-full object-cover"
              />
            </PopoverContent>
          </Popover>
        </Input.Addon>
      </Input.Group>
    </FieldShell>
  )
}
