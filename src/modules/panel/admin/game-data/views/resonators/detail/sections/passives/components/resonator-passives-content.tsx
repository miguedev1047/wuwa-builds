import { useSuspenseQuery } from "@tanstack/react-query"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { characterQueries } from "@/modules/panel/admin/game-data/queries/characters"
import { ResonatorPassiveCard } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passive-card"

type ResonatorPassivesContentProps = {
  resonatorId: number
}

/** Suspended list of resonator passives rendered as cards. */
export function ResonatorPassivesContent({
  resonatorId,
}: ResonatorPassivesContentProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={resonator.passives}
        getItemKey={(passive) => passive.id}
        empty={
          <EditableSection.Text>Sin pasivas agregadas.</EditableSection.Text>
        }
      >
        {(passive) => (
          <ResonatorPassiveCard passive={passive} resonatorId={resonatorId} />
        )}
      </EditableSection.List>
    </EditableSection.Content>
  )
}
