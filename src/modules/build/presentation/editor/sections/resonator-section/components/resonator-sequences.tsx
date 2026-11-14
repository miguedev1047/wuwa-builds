import { ResonatorSequenceItem } from "@build/presentation/editor/sections/resonator-section/components/resonator-sequence-item"
import type { CharacterDetail } from "@catalog/domain/character"
import { BuildWorkspace } from "@build/presentation/editor/components/workspace"

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
      <BuildWorkspace.Text size="sm">Secuencias</BuildWorkspace.Text>
      <div className="grid grid-cols-6 items-center gap-1">
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
