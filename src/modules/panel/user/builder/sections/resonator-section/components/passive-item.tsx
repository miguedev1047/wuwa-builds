import { Field, FieldLabel } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"
import type { ResonatorPassivesDataProps } from "@builds/domain/build-record"
import { cn } from "cn"

type PassiveItemProps = {
  passive: ResonatorPassivesDataProps
  onEnabledChange: (enabled: boolean) => void
}

/** One resonator passive with its enable switch. */
export function PassiveItem({ passive, onEnabledChange }: PassiveItemProps) {
  return (
    <Field
      orientation="horizontal"
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-lg border"
      )}
    >
      <FieldLabel
        htmlFor={`passive-${passive.id}`}
        className="aspect-square p-4"
      >
        <img
          src={passive.icon}
          alt={passive.name}
          className="size-full object-contain"
        />

        <Switch
          id={`passive-${passive.id}`}
          checked={passive.enabled}
          className="sr-only absolute"
          onCheckedChange={onEnabledChange}
        />
      </FieldLabel>
    </Field>
  )
}
