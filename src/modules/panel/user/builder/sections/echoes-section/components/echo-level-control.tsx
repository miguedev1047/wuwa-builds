import { Slider } from "@/components/panelui/slider"
import { BuildWorkspace } from "@builder/components/workspace"
import type { EchoesDataProps } from "@builds/domain/build-record"
import {
  ECHO_LEVEL_MILESTONES,
  echoLevelFromStep,
  echoStepFromLevel,
} from "@builds/domain/build"

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
    <div className="space-y-2">
      <BuildWorkspace.Text size="sm">Nivel del eco</BuildWorkspace.Text>

      <Slider
        value={step}
        min={0}
        max={ECHO_LEVEL_MILESTONES.length - 1}
        onValueChange={handleLevelChange}
        format={(value) => `Nv. ${echoLevelFromStep(value)}`}
        aria-label={`Nivel del eco ${slot.index + 1}`}
      />
    </div>
  )
}
