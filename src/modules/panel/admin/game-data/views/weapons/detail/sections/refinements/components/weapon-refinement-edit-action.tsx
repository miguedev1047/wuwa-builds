import { Button } from "@/components/ui/button"
import type { WeaponRefinementRow } from "@/db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { EditableSection } from "@/modules/panel/admin/game-data/components/editable-section"
import { WeaponRefinementEditForm } from "@/modules/panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-edit-form"

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
        <Button type="button" variant="outline" size="icon">
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </Button>
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
