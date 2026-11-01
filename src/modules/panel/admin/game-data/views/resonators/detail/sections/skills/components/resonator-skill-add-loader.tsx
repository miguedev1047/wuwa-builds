import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreCharacterQueries } from "@/modules/encore/queries/characters"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorSkillAddAction } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skill-add-action"

type ResonatorSkillAddLoaderProps = {
  resonatorId: number
}

/** Small suspended action of the skills section header. */
export function ResonatorSkillAddLoader({
  resonatorId,
}: ResonatorSkillAddLoaderProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { data: encoreCharacter } = useSuspenseQuery(
    encoreCharacterQueries.detail(resonatorId)
  )

  const savedSkillIds = resonator.skills.map((skill) => skill.skillId)
  const isMaxSkills = encoreCharacter.skills.every((skill) =>
    savedSkillIds.includes(skill.id)
  )
  const sortOrder =
    resonator.skills.reduce((max, skill) => Math.max(max, skill.sortOrder), 0) +
    1

  return (
    <ResonatorSkillAddAction
      resonatorId={resonatorId}
      sortOrder={sortOrder}
      isMaxSkills={isMaxSkills}
      encoreSkills={encoreCharacter.skills}
      savedSkillIds={savedSkillIds}
    />
  )
}
