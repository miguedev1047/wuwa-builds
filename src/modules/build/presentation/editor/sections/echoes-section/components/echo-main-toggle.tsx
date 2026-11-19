import { Field } from "@/components/panelui/field"
import { Switch } from "@/components/panelui/switch"
import { FieldContent, FieldTitle } from "@/components/ui/field"

import { useId } from "react"

type EchoMainToggleProps = {
  isMain: boolean
  onToggle: () => void
}

/** Marks or clears the main echo of the build. */
export function EchoMainToggle({ isMain, onToggle }: EchoMainToggleProps) {
  const id = useId()

  return (
    <Field>
      <Field.Label
        htmlFor={id}
        className="flex items-center justify-between gap-4 overflow-hidden p-2"
      >
        <FieldContent>
          <FieldTitle>
            {isMain ? "Quitar eco principal" : "Marcar eco principal"}
          </FieldTitle>
        </FieldContent>

        <Switch id={id} checked={isMain} onCheckedChange={() => onToggle()} />
      </Field.Label>
    </Field>
  )
}
