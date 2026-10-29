import { Field, FieldLabel } from "@/components/ui/field"
import { Slider } from "@/components/ui/slider"
import { Spinner } from "@/components/ui/spinner"
import { Show } from "@/components/utility/show"
import type { BuildDraftCollection } from "@/modules/builds/client/build-drafts-provider"
import { SKILL_LEVEL_MAX } from "@/modules/builds/domain/build"
import {
  getUpgradeableSkills,
  type UpgradeableSkill,
} from "@/modules/builds/infrastructure/encore/skill-levels"
import { characterQueries } from "@/modules/encore/queries/characters"
import { eq, useLiveQuery } from "@tanstack/react-db"
import { useQuery } from "@tanstack/react-query"

interface BuildResonatorSkillsProps {
  draftId: string
  collection: BuildDraftCollection
}

export function BuildResonatorSkills({
  collection,
  draftId,
}: BuildResonatorSkillsProps) {
  const { data: draft } = useLiveQuery((q) =>
    q
      .from({ draft: collection })
      .where(({ draft }) => eq(draft.id, draftId))
      .findOne()
  )

  const { data: character, isLoading } = useQuery({
    ...characterQueries.detail(draft?.characterId ?? 0),
    enabled: draft?.characterId !== undefined,
  })

  const resonatorSkills = getUpgradeableSkills(character?.skills ?? [])

  if (!draft) return null

  return (
    <Field>
      <FieldLabel className="text-xl">Habilidades</FieldLabel>

      <Show when={!isLoading} fallback={<Spinner />}>
        <Show
          when={character?.skills}
          fallback={<p>Este resonador no tiene habilidades</p>}
        >
          <ul className="grid grid-cols-5 gap-1">
            {resonatorSkills.map((skill) => {
              return (
                <BuildResonatorSkillItem
                  key={skill.skillId}
                  collection={collection}
                  draftId={draftId}
                  skill={skill}
                />
              )
            })}
          </ul>
        </Show>
      </Show>
    </Field>
  )
}

interface BuildResonatorSkillItemProps {
  draftId: string
  collection: BuildDraftCollection
  skill: UpgradeableSkill
}

export function BuildResonatorSkillItem({
  collection,
  draftId,
  skill,
}: BuildResonatorSkillItemProps) {
  const { data: draft } = useLiveQuery((q) =>
    q
      .from({ draft: collection })
      .where(({ draft }) => eq(draft.id, draftId))
      .findOne()
  )

  if (!draft) return null

  const skillLevel =
    draft.payload.resonator.skillLevels.find(
      (item) => item.skillId === skill.skillId
    )?.level ?? SKILL_LEVEL_MAX

  const handleSkillLevelChange = (value: number | readonly number[]) => {
    const skillId = skill.skillId
    const level = Array.isArray(value) ? value[0] : value
    if (typeof level !== "number") return

    collection.update(draftId, (current) => {
      const skillLevels = current.payload.resonator.skillLevels
      const existing = skillLevels.find((item) => item.skillId === skillId)

      if (existing) {
        existing.level = level
      } else {
        skillLevels.push({ skillId, level })
      }

      current.updatedAt = new Date().toISOString()
    })
  }

  return (
    <li className="space-y-3">
      <h2 className="text-xs">{skill.type}</h2>
      <p className="text-xs">{skillLevel}</p>
      <Slider
        min={1}
        max={SKILL_LEVEL_MAX}
        value={skillLevel}
        onValueChange={(value) => handleSkillLevelChange(value)}
      />
    </li>
  )
}
