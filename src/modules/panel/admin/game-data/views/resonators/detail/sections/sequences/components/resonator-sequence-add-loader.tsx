import { useSuspenseQuery } from "@tanstack/react-query"
import { encoreCharacterQueries } from "@encore/queries/characters"
import { characterQueries } from "@game-data/queries/characters"
import { ResonatorSequenceAddAction } from "@panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequence-add-action"

type ResonatorSequenceAddLoaderProps = {
  resonatorId: number
}

/** Small suspended action of the sequences section header. */
export function ResonatorSequenceAddLoader({
  resonatorId,
}: ResonatorSequenceAddLoaderProps) {
  const { data: resonator } = useSuspenseQuery(
    characterQueries.detail(resonatorId)
  )
  const { data: encoreCharacter } = useSuspenseQuery(
    encoreCharacterQueries.detail(resonatorId)
  )

  const savedSequenceIds = resonator.sequences.map(
    (sequence) => sequence.sequenceId
  )
  const isMaxSequences = encoreCharacter.sequences.every((sequence) =>
    savedSequenceIds.includes(sequence.id)
  )
  const sortOrder =
    resonator.sequences.reduce(
      (max, sequence) => Math.max(max, sequence.sortOrder),
      0
    ) + 1

  return (
    <ResonatorSequenceAddAction
      resonatorId={resonatorId}
      sortOrder={sortOrder}
      isMaxSequences={isMaxSequences}
      encoreSequences={encoreCharacter.sequences}
      savedSequenceIds={savedSequenceIds}
    />
  )
}
