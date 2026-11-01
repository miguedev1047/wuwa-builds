import { Button } from "@/components/ui/button"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import type { ResonatorRow } from "@/db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { ResonatorEditForm } from "@/modules/panel/admin/game-data/views/resonators/shared/components/resonator-edit-form"

type ResonatorEditActionProps = {
  resonator: ResonatorRow
}

export function ResonatorEditAction({ resonator }: ResonatorEditActionProps) {
  return (
    <EditableSection.EditAction
      title="Editar resonador"
      trigger={
        <Button type="button" variant="secondary" size="sm">
          <HugeiconsIcon icon={PencilEdit01Icon} />
          Editar
        </Button>
      }
    >
      {({ close }) => (
        <ResonatorEditForm
          resonator={resonator}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.EditAction>
  )
}
