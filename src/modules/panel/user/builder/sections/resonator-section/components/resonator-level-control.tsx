import { Slider } from "@/components/ui/slider"
import { BuildTextHeader } from "@builder/ui/build-text-header"

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
  level,
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
      <BuildTextHeader size="lg">Nivel {level}</BuildTextHeader>
      <Slider
        value={step}
        min={0}
        max={maxStep}
        onValueChange={handleValueChange}
      />
    </div>
  )
}
