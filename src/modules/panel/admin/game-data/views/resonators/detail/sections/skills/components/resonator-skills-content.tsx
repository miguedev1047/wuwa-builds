import { useSuspenseQuery } from "@tanstack/react-query"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { ResonatorSkillCard } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/skills/components/resonator-skill-card"

type ResonatorSkillsContentProps = {
  resonatorId: number
}

/** Suspended list of resonator skills rendered as cards. */
export function ResonatorSkillsContent({
  resonatorId,
}: ResonatorSkillsContentProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={resonator.skills}
        getItemKey={(skill) => skill.id}
        empty={
          <EditableSection.Text>
            Sin habilidades agregadas.
          </EditableSection.Text>
        }
      >
        {(skill) => (
          <ResonatorSkillCard skill={skill} resonatorId={resonatorId} />
        )}
      </EditableSection.List>
    </EditableSection.Content>
  )
}
