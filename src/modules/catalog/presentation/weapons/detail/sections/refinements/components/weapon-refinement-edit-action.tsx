import type { WeaponRefinementRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { EditableSection } from "@catalog/presentation/components/editable-section"
import { WeaponRefinementEditForm } from "@catalog/presentation/weapons/detail/sections/refinements/components/weapon-refinement-edit-form"

type WeaponRefinementEditActionProps = {
  refinement: WeaponRefinementRow
}

export function WeaponRefinementEditAction({
  refinement,
}: WeaponRefinementEditActionProps) {
  return (
    <EditableSection.EditAction
      title="Editar refinamiento"
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="icon"
          aria-label="Editar refinamiento"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <WeaponRefinementEditForm
          refinement={refinement}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.EditAction>
  )
}
