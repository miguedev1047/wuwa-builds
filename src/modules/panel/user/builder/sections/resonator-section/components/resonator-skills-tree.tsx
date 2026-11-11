import { Show } from "@/components/utility/show"
import {
  withPassiveEnabled,
  withSkillStep,
} from "@builds/application/resonator-config"
import { updateBuild } from "@builds/client/build-store"
import { SKILL_COUNT } from "@builds/domain/build"
import type { BuildProps } from "@builds/domain/build-record"
import { characterQueries } from "@game-data/queries/characters"
import { ResonatorSkillBranch } from "@builder/sections/resonator-section/components/resonator-skill-branch"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ResonatorBonusList } from "./resonator-bonus-list"
import { Empty, EmptyTitle } from "@/components/ui/empty"

interface ResonatorSkillsTreeProps {
  build: BuildProps
  resonatorId: number
}

/**
 * Arch of the tree, column by column: the edges drop, the columns next to them
 * rise a little and the middle one sits highest.
 */
const BRANCH_LIFT = ["down", "up", "top", "up", "down"] as const

/**
 * Forte tree of the resonator.
 *
 * The build stores the ten nodes in reading order, so the first five are the
 * top row and the last five the bottom row of the same five branches. Each
 * branch ends with its skill, which is what the tree is really configuring.
 */
export function ResonatorSkillsTree({
  build,
  resonatorId,
}: ResonatorSkillsTreeProps) {
  const { data: catalog } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  const catalogSkills = new Map(
    catalog.skills.map((skill) => [skill.skillId, skill])
  )

  const passives = build.resonator.passives
  const skills = build.resonator.skills.slice(0, SKILL_COUNT)

  const branches = Array.from({ length: SKILL_COUNT }, (_, index) => {
    const skill = skills[index]

    return {
      index,
      lift: BRANCH_LIFT[index],
      top: passives[index],
      bottom: passives[index + SKILL_COUNT],
      skill,
      catalogSkill: skill ? catalogSkills.get(skill.skillId) : undefined,
    }
  })

  const handlePassiveToggle = (id: number, enabled: boolean) => {
    updateBuild(build.buildId, (draft) => {
      draft.resonator.passives = withPassiveEnabled(
        draft.resonator.passives,
        id,
        enabled
      )
      draft.updateAt = new Date().toISOString()
    })
  }

  const handleSkillStep = (skillId: number, delta: number) => {
    updateBuild(build.buildId, (draft) => {
      draft.resonator.skills = withSkillStep(
        draft.resonator.skills,
        skillId,
        delta
      )
      draft.updateAt = new Date().toISOString()
    })
  }

  const hasAvailableSkills = passives.length > 0 || skills.length > 0

  return (
    <Show
      when={hasAvailableSkills}
      fallback={
        <Empty className="h-50 border border-dashed">
          <EmptyTitle>Sin habilidades en el catálogo.</EmptyTitle>
        </Empty>
      }
    >
      <div className="space-y-4 select-none">
        <ResonatorBonusList passives={passives} />
        <ol className="mx-auto grid max-w-200 grid-cols-5 gap-1 px-2 py-6 sm:min-w-0 sm:gap-3 sm:px-6 sm:py-8">
          {branches.map((branch) => (
            <ResonatorSkillBranch
              key={branch.index}
              top={branch.top}
              lift={branch.lift}
              bottom={branch.bottom}
              skill={branch.skill}
              catalogSkill={branch.catalogSkill}
              onPassiveToggle={handlePassiveToggle}
              onSkillStep={handleSkillStep}
            />
          ))}
        </ol>
      </div>
    </Show>
  )
}
