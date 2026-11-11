import { BuildTextHeader } from "@builder/ui/build-text-header"
import { ResonatorSequenceItem } from "@builder/sections/resonator-section/components/resonator-sequence-item"
import type { CharacterDetail } from "@game-data/domain/character"

type ResonatorSequencesProps = {
  sequences: CharacterDetail["sequences"]
  /** Current sequence rank of the build; nodes up to it are active. */
  rank: number
  onToggle: (rank: number) => void
}

/**
 * Sequence nodes of the resonator.
 *
 * The desktop layout chains the nodes with connectors; narrow screens use a
 * badge grid because the connectors do not fit.
 */
export function ResonatorSequences({
  sequences,
  rank,
  onToggle,
}: ResonatorSequencesProps) {
  return (
    <div className="space-y-2">
      <BuildTextHeader size="lg">Secuencias</BuildTextHeader>

      <div className="hidden flex-wrap items-center sm:flex">
        {sequences.map((sequence, index) => (
          <ResonatorSequenceItem
            key={sequence.id}
            sequence={sequence}
            layout="row"
            isActive={rank >= sequence.index}
            showConnector={index > 0}
            onToggle={onToggle}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 items-center gap-4 sm:hidden">
        {sequences.map((sequence) => (
          <ResonatorSequenceItem
            key={sequence.id}
            sequence={sequence}
            layout="grid"
            isActive={rank >= sequence.index}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  )
}
