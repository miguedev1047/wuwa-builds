import { Empty, EmptyTitle } from "@/components/ui/empty"
import { Show } from "@/components/utility/show"
import { SKILL_COUNT } from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"
import { useResonatorProgress } from "@build/presentation/editor/sections/resonator-section/hooks/use-resonator-progress"
import { ResonatorSkillNode } from "@/modules/build/presentation/editor/sections/resonator-section/components/resonator-pasive-node"
import { characterQueries } from "@catalog/queries/characters"
import { useSuspenseQuery } from "@tanstack/react-query"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

interface ResonatorPassivesProps {
  build: BuildProps
  resonatorId: number
}

/**
 * Passives of the resonator.
 *
 * The skills tab writes a level per skill and the passives tab toggles the
 * passive nodes. Both edit the build collection through the section progress
 * hook, so the canvas and the rest of the editor stay in sync.
 */
export function ResonatorPassives({
  build,
  resonatorId,
}: ResonatorPassivesProps) {
  const { data: catalog } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { togglePassive } = useResonatorProgress(build)

  const skills = catalog.skills.slice(0, SKILL_COUNT)
  const passives = build.resonator.passives
  const hasAvailableSkills = passives.length > 0 || skills.length > 0

  return (
    <Show
      when={hasAvailableSkills}
      fallback={
        <Empty className="h-full border border-dashed">
          <EmptyTitle>Sin pasivas en el catálogo.</EmptyTitle>
        </Empty>
      }
    >
      <div className="space-y-2">
        <BuildWorkspace.Text size="sm">Pasivas</BuildWorkspace.Text>
        <ul className="grid grid-cols-5 gap-2">
          {passives.map((passive) => (
            <li key={passive.id}>
              <ResonatorSkillNode
                node={passive}
                onToggle={(enabled) => togglePassive(passive.id, enabled)}
              />
            </li>
          ))}
        </ul>
      </div>
    </Show>
  )
}
