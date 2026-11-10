import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import type { ResonatorPassiveRow } from "@db/schema"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { ResonatorPassiveEditForm } from "@panel/admin/game-data/views/resonators/detail/sections/passives/components/resonator-passive-edit-form"

type ResonatorPassiveEditActionProps = {
  passive: ResonatorPassiveRow
}

/** Card action that opens the passive edit form inside a dialog. */
export function ResonatorPassiveEditAction({
  passive,
}: ResonatorPassiveEditActionProps) {
  return (
    <EditableSection.EditAction
      title="Editar pasiva"
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="icon"
          aria-label="Editar pasiva"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <ResonatorPassiveEditForm
          passive={passive}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.EditAction>
  )
}
