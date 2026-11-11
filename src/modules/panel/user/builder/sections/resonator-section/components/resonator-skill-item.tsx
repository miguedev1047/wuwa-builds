import { Image } from "@/components/ui/image"
import type { ResonatorSkillsDataProps } from "@builds/domain/build-record"
import { ResonatorSkillLevelStepper } from "@builder/sections/resonator-section/components/resonator-skill-level-stepper"
import type { ResonatorSkillRow } from "@db/schema"

type ResonatorSkillItemProps = {
  skill: ResonatorSkillsDataProps
  catalogSkill: Pick<ResonatorSkillRow, "name" | "type" | "icon">
  /** Moves the level by one step. */
  onStep: (delta: number) => void
}

/**
 * Skill icon, type label and level stepper at the bottom of a tree branch.
 *
 * It stretches to the branch height and pins the stepper to the bottom, so the
 * five steppers keep their own line whatever the label wraps to.
 */
export function ResonatorSkillItem({
  skill,
  catalogSkill,
  onStep,
}: ResonatorSkillItemProps) {
  return (
    <div className="flex w-full flex-1 flex-col items-center gap-1.5">
      <div className="size-10 sm:size-12 md:size-16">
        <Image
          src={catalogSkill.icon}
          alt={catalogSkill.name}
          fit="contain"
          size="full"
          rounded="md"
        />
      </div>

      <p
        className="line-clamp-1 text-center text-xs leading-tight text-balance text-muted-foreground"
        aria-label={catalogSkill.type}
        title={catalogSkill.type}
      >
        {catalogSkill.type}
      </p>

      <div className="mt-auto pt-1">
        <ResonatorSkillLevelStepper
          level={skill.level}
          name={catalogSkill.name}
          onStep={onStep}
        />
      </div>
    </div>
  )
}
