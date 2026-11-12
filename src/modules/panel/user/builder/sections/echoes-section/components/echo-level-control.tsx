import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import type { EchoesDataProps } from "@builds/domain/build-record"
import { ECHO_LEVEL_MILESTONES, echoStepFromLevel } from "@builds/domain/build"

type EchoLevelControlProps = {
  slot: EchoesDataProps
  onChange: (step: number) => void
}

/** Level slider of one echo slot. */
export function EchoLevelControl({ slot, onChange }: EchoLevelControlProps) {
  const step = echoStepFromLevel(slot.level)

  const handleLevelChange = (value: number | readonly number[]) => {
    const nextStep = Array.isArray(value) ? value[0] : value

    if (typeof nextStep === "number") onChange(nextStep)
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium">Nivel del eco</p>
        <Badge variant="outline">Nv. {slot.level}</Badge>
      </div>

      <Slider
        value={step}
        min={0}
        max={ECHO_LEVEL_MILESTONES.length - 1}
        onValueChange={handleLevelChange}
        aria-label={`Nivel del eco ${slot.index + 1}`}
      />
    </section>
  )
}
