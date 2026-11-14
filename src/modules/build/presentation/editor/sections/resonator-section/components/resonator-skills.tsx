import { Empty, EmptyTitle } from "@/components/ui/empty"
import { Show } from "@/components/utility/show"
import { SKILL_COUNT, SKILL_LEVEL_MAX } from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"
import { useResonatorProgress } from "@build/presentation/editor/sections/resonator-section/hooks/use-resonator-progress"
import { ResonatorSkillNode } from "@/modules/build/presentation/editor/sections/resonator-section/components/resonator-skill-node"
import { characterQueries } from "@catalog/queries/characters"
import { useSuspenseQuery } from "@tanstack/react-query"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

interface ResonatorSkillsProps {
  build: BuildProps
  resonatorId: number
}

/**
 * Skills of the resonator.
 *
 * The skills tab writes a level per skill and the passives tab toggles the
 * passive nodes. Both edit the build collection through the section progress
 * hook, so the canvas and the rest of the editor stay in sync.
 */
export function ResonatorSkills({ build, resonatorId }: ResonatorSkillsProps) {
  const { data: catalog } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { setSkillLevel } = useResonatorProgress(build)

  const skills = catalog.skills.slice(0, SKILL_COUNT)
  const levels = new Map(
    build.resonator.skills.map((skill) => [skill.skillId, skill.level])
  )
  const passives = build.resonator.passives
  const hasAvailableSkills = passives.length > 0 || skills.length > 0

  return (
    <Show
      when={hasAvailableSkills}
      fallback={
        <Empty className="h-20 border border-dashed">
          <EmptyTitle>Sin habilidades en el catálogo.</EmptyTitle>
        </Empty>
      }
    >
      <div className="space-y-2">
        <BuildWorkspace.Text size="sm">Habilidades</BuildWorkspace.Text>
        <ul className="space-y-2">
          {skills.map((skill) => (
            <ResonatorSkillNode
              key={skill.id}
              skill={skill}
              level={levels.get(skill.skillId) ?? SKILL_LEVEL_MAX}
              onLevelChange={(level) => setSkillLevel(skill.skillId, level)}
            />
          ))}
        </ul>
      </div>
    </Show>
  )
}
