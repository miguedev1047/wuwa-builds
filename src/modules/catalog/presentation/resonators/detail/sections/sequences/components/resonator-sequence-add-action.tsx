import type { EncoreSequence } from "@encore/domain/character"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorSequenceAddForm } from "@catalog/presentation/resonators/detail/sections/sequences/components/resonator-sequence-add-form"
import { PlusIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

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
      trigger={
        <EditableSection.ButtonAction variant="default">
          <HugeiconsIcon icon={PlusIcon} />
          Agregar
        </EditableSection.ButtonAction>
      }
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
