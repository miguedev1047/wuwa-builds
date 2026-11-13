import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import { useId } from "react"

type EchoMainToggleProps = {
  isMain: boolean
  onToggle: () => void
}

/** Marks or clears the main echo of the build. */
export function EchoMainToggle({ isMain, onToggle }: EchoMainToggleProps) {
  const id = useId()

  return (
    <Field orientation="horizontal">
      <FieldLabel htmlFor={id} className="overflow-hidden rounded-lg p-4">
        <FieldContent>
          <FieldTitle>
            {isMain ? "Quitar eco principal" : "Marcar eco principal"}
          </FieldTitle>
        </FieldContent>

        <Switch id={id} checked={isMain} onCheckedChange={() => onToggle()} />
      </FieldLabel>
    </Field>
  )
}
