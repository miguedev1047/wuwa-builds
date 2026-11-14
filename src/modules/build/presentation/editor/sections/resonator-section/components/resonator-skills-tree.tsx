import { Empty, EmptyTitle } from "@/components/ui/empty"
import { ItemGroup } from "@/components/ui/item"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Show } from "@/components/utility/show"
import { SKILL_COUNT, SKILL_LEVEL_MAX } from "@build/domain/build"
import type { BuildProps } from "@build/domain/build-record"
import { useResonatorProgress } from "@build/presentation/editor/sections/resonator-section/hooks/use-resonator-progress"
import { ResonatorSkillNode } from "@build/presentation/editor/sections/resonator-section/components/resonator-skill-node"
import { ResonatorSkillRow } from "@build/presentation/editor/sections/resonator-section/components/resonator-skill-row"
import { characterQueries } from "@catalog/queries/characters"
import { useSuspenseQuery } from "@tanstack/react-query"

interface ResonatorSkillsTreeProps {
  build: BuildProps
  resonatorId: number
  onSelect?: () => void
}

/**
 * Skills and passives of the resonator.
 *
 * The skills tab writes a level per skill and the passives tab toggles the
 * passive nodes. Both edit the build collection through the section progress
 * hook, so the canvas and the rest of the editor stay in sync.
 */
export function ResonatorSkillsTree({
  build,
  resonatorId,
}: ResonatorSkillsTreeProps) {
  const { data: catalog } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { setSkillLevel, togglePassive } = useResonatorProgress(build)

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
        <Empty className="h-full border border-dashed">
          <EmptyTitle>Sin habilidades en el catálogo.</EmptyTitle>
        </Empty>
      }
    >
      <Tabs defaultValue="skills">
        <TabsList>
          <TabsTrigger value="skills">Habilidades</TabsTrigger>
          <TabsTrigger value="passives">Pasivas</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <ItemGroup>
            {skills.map((skill) => (
              <ResonatorSkillRow
                key={skill.id}
                skill={skill}
                level={levels.get(skill.skillId) ?? SKILL_LEVEL_MAX}
                onLevelChange={(level) => setSkillLevel(skill.skillId, level)}
              />
            ))}
          </ItemGroup>
        </TabsContent>

        <TabsContent value="passives">
          <ul className="grid grid-cols-5 gap-4">
            {passives.map((passive) => (
              <li key={passive.id}>
                <ResonatorSkillNode
                  node={passive}
                  onToggle={(enabled) => togglePassive(passive.id, enabled)}
                />
              </li>
            ))}
          </ul>
        </TabsContent>
      </Tabs>
    </Show>
  )
}
