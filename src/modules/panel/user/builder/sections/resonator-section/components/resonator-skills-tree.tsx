import { Empty, EmptyTitle } from "@/components/ui/empty"
import { ItemGroup } from "@/components/ui/item"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Show } from "@/components/utility/show"
import {
  withPassiveEnabled,
  withSkillLevel,
} from "@builds/application/resonator-config"
import { updateBuild } from "@builds/client/build-store"
import type { BuildProps } from "@builds/domain/build-record"
import { characterQueries } from "@game-data/queries/characters"
import { PassiveItem } from "@builder/sections/resonator-section/components/passive-item"
import { SkillItem } from "@builder/sections/resonator-section/components/skill-item"
import { useSuspenseQuery } from "@tanstack/react-query"

const SKILL_COUNT = 5

interface ResonatorSkillsTreeProps {
  build: BuildProps
  resonatorId: number
}

export function ResonatorSkillsTree({
  build,
  resonatorId,
}: ResonatorSkillsTreeProps) {
  const { data: catalog } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  const catalogSkills = new Map(
    catalog.skills.slice(0, SKILL_COUNT).map((skill) => [skill.skillId, skill])
  )

  const skills = (build?.resonator.skills ?? []).flatMap((skill) => {
    const catalogSkill = catalogSkills.get(skill.skillId)
    return catalogSkill ? [{ skill, catalogSkill }] : []
  })

  const passives = build?.resonator.passives ?? []

  const handleSkillLevel = (skillId: number, level: number) => {
    updateBuild(build.buildId, (draft) => {
      draft.resonator.skills = withSkillLevel(
        draft.resonator.skills,
        skillId,
        level
      )
      draft.updateAt = new Date().toISOString()
    })
  }

  const handlePassiveEnabled = (id: number, enabled: boolean) => {
    updateBuild(build.buildId, (draft) => {
      draft.resonator.passives = withPassiveEnabled(
        draft.resonator.passives,
        id,
        enabled
      )
      draft.updateAt = new Date().toISOString()
    })
  }

  return (
    <Tabs defaultValue="skills">
      <TabsList className="grid w-full gap-2 md:grid-cols-2">
        <TabsTrigger value="skills">Habilidades</TabsTrigger>
        <TabsTrigger value="passives">Pasivas</TabsTrigger>
      </TabsList>
      <TabsContent value="skills">
        <Show
          when={skills.length > 0}
          fallback={
            <Empty>
              <EmptyTitle>Sin habilidades en el catálogo.</EmptyTitle>
            </Empty>
          }
        >
          <ItemGroup>
            {skills.map(({ skill, catalogSkill }) => (
              <SkillItem
                key={skill.skillId}
                skill={skill}
                catalogSkill={catalogSkill}
                onLevelChange={(level) =>
                  handleSkillLevel(skill.skillId, level)
                }
              />
            ))}
          </ItemGroup>
        </Show>
      </TabsContent>
      <TabsContent value="passives">
        <Show
          when={passives.length > 0}
          fallback={
            <Empty>
              <EmptyTitle>Sin pasivas en el catálogo.</EmptyTitle>
            </Empty>
          }
        >
          <div className="grid gap-4 md:grid-cols-5">
            {passives.map((passive) => (
              <PassiveItem
                key={passive.id}
                passive={passive}
                onEnabledChange={(enabled) =>
                  handlePassiveEnabled(passive.id, enabled)
                }
              />
            ))}
          </div>
        </Show>
      </TabsContent>
    </Tabs>
  )
}
