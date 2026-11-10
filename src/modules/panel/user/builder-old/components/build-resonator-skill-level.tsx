import { Slider } from "@/components/ui/slider"
import { SKILL_LEVEL_MAX } from "@builds/domain/build"

interface BuildResonatorSkillLevelProps {
  level: number
  onLevelChange: (level: number) => void
}

/** Level slider for one resonator skill. */
export function BuildResonatorSkillLevel({
  level,
  onLevelChange,
}: BuildResonatorSkillLevelProps) {
  const handleValueChange = (value: number | readonly number[]) => {
    const next = Array.isArray(value) ? value[0] : value

    if (typeof next === "number") onLevelChange(next)
  }

  return (
    <Slider
      min={1}
      max={SKILL_LEVEL_MAX}
      value={level}
      onValueChange={handleValueChange}
    />
  )
}
