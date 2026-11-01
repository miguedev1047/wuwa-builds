import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ResonatorSequenceRow } from "@/db/schema"
import { Button } from "@/components/ui/button"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { ResonatorSequenceEditForm } from "@/modules/panel/admin/game-data/views/resonators/detail/sections/sequences/components/resonator-sequence-edit-form"

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
        <Button
          type="button"
          variant="secondary"
          size="icon"
          aria-label="Editar secuencia"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </Button>
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
