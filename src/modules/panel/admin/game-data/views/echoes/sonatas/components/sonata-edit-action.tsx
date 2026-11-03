import type { SonataSetEffectRow, SonataSetRow } from "@/db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { SonataEditForm } from "@/modules/panel/admin/game-data/views/echoes/sonatas/components/sonata-edit-form"

type SonataWithEffects = SonataSetRow & { effects: SonataSetEffectRow[] }

type SonataEditActionProps = {
  sonata: SonataWithEffects
}

export function SonataEditAction({ sonata }: SonataEditActionProps) {
  return (
    <EditableSection.EditAction
      title="Editar set de sonata"
      trigger={
        <EditableSection.ButtonAction type="button" variant="icon">
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <SonataEditForm sonata={sonata} onSaved={close} onCancel={close} />
      )}
    </EditableSection.EditAction>
  )
}
