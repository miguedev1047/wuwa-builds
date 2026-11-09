import { useSuspenseQuery } from "@tanstack/react-query"
import { SkeletonSuspense } from "skullet/react"
import { ItemGroup } from "@/components/ui/item"
import { Show } from "@/components/utility/show"
import {
  withPassiveEnabled,
  withSkillLevel,
} from "@/modules/builds/application/resonator-config"
import { updateBuild } from "@/modules/builds/client/build-store"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { useBuildCollection } from "../../../../builds/application/build-live-queries"
import { useBuilderId } from "../../../application/use-builder-id"
import { PassiveItem } from "./passive-item"
import { SkillItem } from "./skill-item"
import { SkillsEditorSkeleton } from "./skills-editor-skeleton"

const SKILL_COUNT = 5

type SkillsEditorLoadedProps = {
  buildId: string
  resonatorId: number
}

/** Skills and passives of the selected resonator. */
export function SkillsEditor() {
  const buildId = useBuilderId()
  const { data: build } = useBuildCollection({ buildId })
  const resonatorId = build?.resonator.data?.id

  return (
    <Show
      when={resonatorId}
      fallback={
        <p className="text-sm text-muted-foreground">
          Selecciona un resonador primero.
        </p>
      }
    >
      {(id) => (
        <SkeletonSuspense skeleton={<SkillsEditorSkeleton />}>
          <SkillsEditorLoaded buildId={buildId} resonatorId={id} />
        </SkeletonSuspense>
      )}
    </Show>
  )
}

function SkillsEditorLoaded({ buildId, resonatorId }: SkillsEditorLoadedProps) {
  const { data: build } = useBuildCollection({ buildId })
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
    updateBuild(buildId, (draft) => {
      draft.resonator.skills = withSkillLevel(
        draft.resonator.skills,
        skillId,
        level
      )
      draft.updateAt = new Date().toISOString()
    })
  }

  const handlePassiveEnabled = (id: number, enabled: boolean) => {
    updateBuild(buildId, (draft) => {
      draft.resonator.passives = withPassiveEnabled(
        draft.resonator.passives,
        id,
        enabled
      )
      draft.updateAt = new Date().toISOString()
    })
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h3 className="text-sm font-medium">Habilidades</h3>

        {skills.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Sin habilidades en el catálogo.
          </p>
        ) : (
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
        )}
      </section>

      <section className="space-y-2">
        <h3 className="text-sm font-medium">Pasivas</h3>

        {passives.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin pasivas.</p>
        ) : (
          <ItemGroup>
            {passives.map((passive) => (
              <PassiveItem
                key={passive.id}
                passive={passive}
                onEnabledChange={(enabled) =>
                  handlePassiveEnabled(passive.id, enabled)
                }
              />
            ))}
          </ItemGroup>
        )}
      </section>
    </div>
  )
}
