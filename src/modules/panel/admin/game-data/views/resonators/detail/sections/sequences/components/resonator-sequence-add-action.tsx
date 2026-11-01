import type { EncoreSequence } from "@/modules/encore/domain/character"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { ResonatorSequenceAddForm } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequence-add-form"

type ResonatorSequenceAddActionProps = {
  resonatorId: number
  sortOrder: number
  isMaxSequences: boolean
  encoreSequences: EncoreSequence[]
  savedSequenceIds: number[]
}

/** Header action that opens the sequence form inside a dialog. */
export function ResonatorSequenceAddAction({
  resonatorId,
  sortOrder,
  isMaxSequences,
  encoreSequences,
  savedSequenceIds,
}: ResonatorSequenceAddActionProps) {
  return (
    <EditableSection.AddAction
      disabled={isMaxSequences}
      title="Agregar secuencias"
      description="Elige una o mas secuencias de Encore."
    >
      {({ close }) => (
        <ResonatorSequenceAddForm
          resonatorId={resonatorId}
          sortOrder={sortOrder}
          encoreSequences={encoreSequences}
          savedSequenceIds={savedSequenceIds}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.AddAction>
  )
}
