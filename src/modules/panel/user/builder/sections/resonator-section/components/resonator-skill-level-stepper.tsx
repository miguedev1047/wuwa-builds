import { Button } from "@/components/ui/button"
import { SKILL_LEVEL_MAX, SKILL_LEVEL_MIN } from "@builds/domain/build"
import { MinusIcon, PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type ResonatorSkillLevelStepperProps = {
  level: number
  /** Accessible name of the skill the stepper belongs to. */
  name: string
  /** Moves the level by one step; the store clamps the result. */
  onStep: (delta: number) => void
}

/** Compact level stepper of one skill: down, level, up. */
export function ResonatorSkillLevelStepper({
  level,
  name,
  onStep,
}: ResonatorSkillLevelStepperProps) {
  return (
    <div className="flex items-center gap-2 p-0.5">
      <Button
        variant="outline"
        size="icon-xs"
        aria-label={`Bajar nivel de ${name}`}
        disabled={level <= SKILL_LEVEL_MIN}
        onClick={() => onStep(-1)}
      >
        <HugeiconsIcon icon={MinusIcon} />
      </Button>

      <span className="min-w-4 text-center text-xs font-bold text-brand-warning tabular-nums">
        {level}
      </span>

      <Button
        variant="outline"
        size="icon-xs"
        aria-label={`Subir nivel de ${name}`}
        disabled={level >= SKILL_LEVEL_MAX}
        onClick={() => onStep(1)}
      >
        <HugeiconsIcon icon={PlusIcon} />
      </Button>
    </div>
  )
}
