import type { WeaponRefinementStatRow } from "@db/schema"
import { PencilEdit01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { EditableSection } from "@panel/admin/game-data/components/editable-section"
import { WeaponRefinementStatEditForm } from "@panel/admin/game-data/views/weapons/detail/sections/refinements/components/weapon-refinement-stat-edit-form"

type WeaponRefinementStatEditActionProps = {
  stat: WeaponRefinementStatRow
  weaponId: number
}

export function WeaponRefinementStatEditAction({
  stat,
  weaponId,
}: WeaponRefinementStatEditActionProps) {
  return (
    <EditableSection.EditAction
      title="Editar estadística"
      trigger={
        <EditableSection.ButtonAction
          type="button"
          variant="icon"
          aria-label="Editar estadística"
        >
          <HugeiconsIcon icon={PencilEdit01Icon} />
        </EditableSection.ButtonAction>
      }
    >
      {({ close }) => (
        <WeaponRefinementStatEditForm
          stat={stat}
          weaponId={weaponId}
          onSaved={close}
          onCancel={close}
        />
      )}
    </EditableSection.EditAction>
  )
}
