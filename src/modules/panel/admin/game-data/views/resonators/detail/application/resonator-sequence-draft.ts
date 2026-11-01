import type { ResonatorSequenceRow } from "@/db/schema"
import type { EncoreSequence } from "@/modules/encore/domain/character"
import type {
  ResonatorSequenceInput,
  ResonatorSequenceUpdateInput,
} from "@/modules/panel/admin/game-data/application/schemas"

/** Maps a saved sequence row to the edit form values. */
export function resonatorSequenceDraftFromRow(
  sequence: ResonatorSequenceRow
): ResonatorSequenceUpdateInput {
  return {
    id: sequence.id,
    resonatorId: sequence.resonatorId,
    sequenceId: sequence.sequenceId,
    sortOrder: sequence.sortOrder,
    index: sequence.index,
    name: sequence.name,
    description: sequence.description,
  }
}

/** Payloads for the selected Encore sequences, in Encore order. */
export function resonatorSequencePayloads(
  selectedIds: string[],
  encoreSequences: EncoreSequence[],
  resonatorId: number,
  firstSortOrder: number
): ResonatorSequenceInput[] {
  return encoreSequences
    .filter((sequence) => selectedIds.includes(String(sequence.id)))
    .map((sequence, index) => ({
      resonatorId,
      sequenceId: sequence.id,
      sortOrder: firstSortOrder + index,
      index: sequence.index,
      name: sequence.name,
      description: sequence.description,
    }))
}
