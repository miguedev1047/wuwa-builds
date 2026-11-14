import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ResonatorSequenceRow } from "@db/schema"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { ResonatorSequenceEditForm } from "@catalog/presentation/resonators/detail/sections/sequences/components/resonator-sequence-edit-form"

type ResonatorSequenceEditActionProps = {
  sequence: ResonatorSequenceRow
}

/** Card action that opens the sequence edit form inside a dialog. */
export function ResonatorSequenceEditAction({
  sequence,
}: ResonatorSequenceEditActionProps) {
  return (
    <EditableSection.EditAction
      title="Editar secuencia"
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="icon"
          aria-label="Editar secuencia"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <ResonatorSequenceEditForm
          sequence={sequence}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.EditAction>
  )
}
