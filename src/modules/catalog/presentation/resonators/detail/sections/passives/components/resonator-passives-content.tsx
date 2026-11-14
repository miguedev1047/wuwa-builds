import { useSuspenseQuery } from "@tanstack/react-query"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { characterQueries } from "@catalog/queries/characters"
import { ResonatorPassiveCard } from "@catalog/presentation/resonators/detail/sections/passives/components/resonator-passive-card"

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

  const orderedPassives = resonator.passives.sort((a, b) =>
    a.title.localeCompare(b.title)
  )

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={orderedPassives}
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
