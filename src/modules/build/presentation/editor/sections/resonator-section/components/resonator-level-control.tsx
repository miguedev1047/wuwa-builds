import { Slider } from "@/components/panelui/slider"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"
import { levelFromStep } from "@build/domain/build"

type ResonatorLevelControlProps = {
  /** Real game level shown next to the header. */
  level: number
  /** 0-based milestone index the slider is positioned at. */
  step: number
  /** Last available milestone index. */
  maxStep: number
  onStepChange: (step: number) => void
}

/** Level label and milestone slider of the resonator. */
export function ResonatorLevelControl({
  step,
  maxStep,
  onStepChange,
}: ResonatorLevelControlProps) {
  const handleValueChange = (value: number | readonly number[]) => {
    const nextStep = Array.isArray(value) ? value[0] : value

    if (typeof nextStep !== "number") return

    onStepChange(nextStep)
  }

  return (
    <div className="space-y-2">
      <BuildWorkspace.Text size="sm">Nivel</BuildWorkspace.Text>
      <Slider
        value={step}
        min={0}
        max={maxStep}
        onValueChange={handleValueChange}
        format={(v) => `Nv. ${levelFromStep(v)}`}
      />
    </div>
  )
}
