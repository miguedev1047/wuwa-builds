import { useSuspenseQuery } from "@tanstack/react-query"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { characterQueries } from "@/modules/game-data/queries/characters"
import { ResonatorSequenceCard } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequence-card"

type ResonatorSequencesContentProps = {
  resonatorId: number
}

/** Suspended list of resonator sequences rendered as cards. */
export function ResonatorSequencesContent({
  resonatorId,
}: ResonatorSequencesContentProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )

  return (
    <EditableSection.Content>
      <EditableSection.List
        items={resonator.sequences}
        getItemKey={(sequence) => sequence.id}
        empty={
          <EditableSection.Text>Sin secuencias agregadas.</EditableSection.Text>
        }
      >
        {(sequence) => (
          <ResonatorSequenceCard
            sequence={sequence}
            resonatorId={resonatorId}
          />
        )}
      </EditableSection.List>
    </EditableSection.Content>
  )
}
