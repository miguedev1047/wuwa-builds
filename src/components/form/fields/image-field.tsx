import { useSelector } from "@tanstack/react-form"
import type { ComponentProps, ReactNode } from "react"
import { Input } from "@/components/ui/input"
import { FieldShell } from "@/components/form/field-shell"
import { useFieldContext } from "@/components/form/form-context"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { HugeiconsIcon } from "@hugeicons/react"
import { ImageIcon } from "@hugeicons/core-free-icons"

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
      <InputGroup>
        <InputGroupInput
          id={field.name}
          name={field.name}
          value={value ?? ""}
          onChange={(event) => field.handleChange(event.target.value)}
          onBlur={field.handleBlur}
          aria-invalid={invalid}
          autoComplete="off"
          {...props}
        />
        <InputGroupAddon align="inline-end">
          <Popover>
            <PopoverTrigger
              render={
                <InputGroupButton disabled={!value} variant="ghost">
                  <HugeiconsIcon icon={ImageIcon} />
                </InputGroupButton>
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
        </InputGroupAddon>
      </InputGroup>
    </FieldShell>
  )
}
